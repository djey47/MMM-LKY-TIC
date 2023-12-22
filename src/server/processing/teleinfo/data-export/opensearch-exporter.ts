import { Client } from '@opensearch-project/opensearch';
import parseDate from 'date-fns/parse';
import toDate from 'date-fns/toDate';

import type { OpensearchConfiguration } from '../../../../shared/domain/teleinfo-config';
import type { EntryValue, Stats, StatsItem, StoreDataEntries,  } from '../helpers/store-models';
import type { GroupedData } from './model/export';
import type { DocStatsItem, DocumentByDate } from './model/opensearch';
import { Log } from '../../../utils/mm2_facades';
import { ModuleConfiguration } from '../../../../shared/domain/module-config';

const IGNORED_STORE_KEYS_PREFIXES = ['FIRST_DATA_TIMESTAMP', 'INITIAL_', 'TOTAL_', 'OVERALL_', 'YEAR_'];

/**
 * Export data to openserach index
 */
export async function exportDataToOpensearch(entries: StoreDataEntries, config: ModuleConfiguration) {
  const osConfig = config.teleinfo?.dataExport.settings.opensearch;
  if (!osConfig) {
    Log.info('**** opensearch-exporter::exportDataToOpensearch no opensearch configuration provided, export won\'t be processed.');

    return;
  }

  Log.info('**** opensearch-exporter::exportDataToOpensearch Preparing export...');

  const client = createOpenSearchClient(osConfig);

  const groupedData = groupData(entries, config);
  if (config.debug) {
    Log.info(`'**** opensearch-exporter::exportDataToOpensearch groupedData=${JSON.stringify(groupedData)}`);
  }

  const { indexName } = osConfig;
  const docPromises = Object.entries(groupedData.perDay)
    .map(([dateKey, document]) => {
      if (config.debug) {
        Log.info(`'**** opensearch-exporter::exportDataToOpensearch Adding document for key: ${dateKey}`);
      }

      return client.index({
        id: `day-${dateKey}`,
        index: indexName,
        body: document,
        refresh: true,
      });
    });

    Log.info(`**** opensearch-exporter::exportDataToOpensearch Exporting ${docPromises.length} documents`);

    const responses = await Promise.all(docPromises);

  if (config.debug) {
    Log.info(`'**** opensearch-exporter::exportDataToOpensearch responses=${JSON.stringify(responses)}`);
  }

  Log.info(`**** opensearch-exporter::exportDataToOpensearch Export ended!`);
}

function createOpenSearchClient(config: OpensearchConfiguration) {
  const { instance, user, password } = config;
  const instanceURL = new URL(instance);

  // Create a client with SSL/TLS enabled.
  const client = new Client({
    node: `${instanceURL.protocol}//${user}:${password}@${instanceURL.hostname}:${instanceURL.port}`,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return client;
}

function groupData(data: StoreDataEntries, config: ModuleConfiguration): GroupedData {
  return Object.entries(data).reduce((grouped: GroupedData, [storeKey, storeValue]) => {
    if (IGNORED_STORE_KEYS_PREFIXES.some((prefix) => storeKey.startsWith(prefix))) {
      return grouped;
    }

    const { perDay, perMonth } = grouped;
    let category: DocumentByDate | undefined = undefined;
    if (storeKey.startsWith('DAY')) {
      category = perDay;
    } else if (storeKey.startsWith('MONTH')) {
      category = perMonth;
    }

    if (category){
      parseData(category, storeKey, storeValue, config);
    } 

    return grouped;
  }, {
    perDay: {},
    perMonth: {},
  });
}

function parseData(target: DocumentByDate, storeKey: string, storeValue: EntryValue, config: ModuleConfiguration) {
  const date = extractDate(storeKey)
  let docItem = target[date];
  if (!docItem) {
    docItem = {
      date: parseDate(date, 'yyyyMMdd', new Date()),
      options: {
        fareOption: 'HP/HC',
        period1Label: 'HC',
        period2Label: 'HP',  
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

  if (config.debug) {
    Log.info(`'**** opensearch-exporter::parseData docItem=${JSON.stringify(docItem)}`);
  }
}

function extractDate(storeKey: string) {
  // only support per-day dates for now
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
