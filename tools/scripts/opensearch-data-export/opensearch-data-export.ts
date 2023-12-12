import fs from 'fs/promises';
import { Client } from '@opensearch-project/opensearch';
import parseDate from 'date-fns/parse';
import toDate from 'date-fns/toDate';
import config from './config/opensearch-data-export.json';

import type { EntryValue, StatsItem, Stats, Store, StoreEntries } from './model/datastore';
import type { DocStatsItem, DocumentByDate } from './model/opensearch';
import type { GroupedData } from './model/export';

const IGNORED_STORE_KEYS_PREFIXES = ['FIRST_DATA_TIMESTAMP', 'INITIAL_', 'TOTAL_', 'OVERALL_', 'YEAR_'];

function createOpenSearchClient() {
  const { opensearchInstance, user, password } = config;
  const url = new URL(opensearchInstance);

  // Optional client certificates if you don't want to use HTTP basic authentication.
  // var client_cert_path = '/full/path/to/client.pem'
  // var client_key_path = '/full/path/to/client-key.pem'

  // Create a client with SSL/TLS enabled.
  const client = new Client({
    node: `${url.protocol}//${user}:${password}@${url.hostname}:${url.port}`,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return client;
}

async function readDatastore(storeFilePath: string) {
  const contents = await fs.readFile(storeFilePath, 'utf8');
  return JSON.parse(contents) as Store;
}

function extractDate(storeKey: string) {
  return storeKey.substring(storeKey.length - 8);
}

function convertStats(statsItem: StatsItem): DocStatsItem {
  const { min, max, minTimestamp, maxTimestamp } = statsItem;
  return {
    max,
    maxDate: toDate(maxTimestamp),
    min,
    minDate: toDate(minTimestamp),
  };
}

function parseData(target: DocumentByDate, storeKey: string, storeValue: EntryValue) {
  const date = extractDate(storeKey)
  let docItem = target[date];
  if (!docItem) {
    docItem = {
      date: parseDate(date, 'yyyyMMdd', new Date()),
      options: {
        fareOption: 'HP/HC',
        period1Label: 'HP',
        period2Label: 'HC',  
      },
    };
    target[date] = docItem;
  }

  const isIndexesData = storeKey.includes('_INDEXES_');
  const isSuppliedData = storeKey.includes('_SUPPLIED_');
  const isCostsData = storeKey.includes('_COSTS_');
  const isStatsData = storeKey.includes('_STATS_');

  if (isIndexesData || isSuppliedData) {
    const [period1, period2] = storeValue as number[];
    const periodicItemKey = isIndexesData ? 'indexes' : 'supplied';
    docItem[periodicItemKey] = { period1, period2 };
  } else if (isCostsData) {
    docItem.costs = storeValue as number;
  } else if (isStatsData) {
    const { apparentPower, instantIntensity } = storeValue as Stats;
    docItem.statistics = {
      apparentPower: convertStats(apparentPower),
      instantIntensity: convertStats(instantIntensity),
    };
  }

  // console.log({ dateItem });

}

function groupData(data: StoreEntries): GroupedData {
  return Object.entries(data).reduce((grouped: GroupedData, [storeKey, storeValue]) => {
    if (IGNORED_STORE_KEYS_PREFIXES.some((prefix) => storeKey.startsWith(prefix))) {
      return grouped;
    }

    const { perDay, perMonth } = grouped;
    let category: DocumentByDate;
    if (storeKey.startsWith('DAY')) {
      category = perDay;
    } else if (storeKey.startsWith('MONTH')) {
      category = perMonth;
    }

    parseData(category, storeKey, storeValue);

    return grouped;
  }, {
    perDay: {},
    perMonth: {},
  });
}

async function main(args: string[]) {
  if (args.length !== 4) {
    console.error('Arguments: <store json file> <index name>')
    return;
  }

  const [, , storeFilePath, indexName] = args;

  console.log('> Loaded configuration:', config);

  const client = createOpenSearchClient();

  const dataStore = await readDatastore(storeFilePath);

  console.log('> Ready!', { args });

  const groupedData = groupData(dataStore.data);

  // console.log({ groupedData });

  const docPromises = Object.entries(groupedData.perDay)
    .map(([dateKey, document]) => {
      console.log('Adding document:', { dateKey });

      return client.index({
        id: `day-${dateKey}`,
        index: indexName,
        body: document,
        refresh: true,
      });
    });

  /*const responses = */
  await Promise.all(docPromises);

  // console.log(responses);

  console.log('Done!');
}

main(process.argv);
