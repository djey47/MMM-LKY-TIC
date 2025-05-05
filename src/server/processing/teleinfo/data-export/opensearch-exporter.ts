import { Client } from '@opensearch-project/opensearch/.';
import parseISO from 'date-fns/parseISO';
import toDate from 'date-fns/toDate';
import { createOpenSearchClient } from './helpers/opensearch-client';
import { FIRST_DATA_TS_IS_KEY } from '../helpers/store-constants';
import { dateToISO } from '../helpers/format';
import { Log } from '../../../utils/mm2_facades';
import type { EntryValue, StoreDataEntries, StoredStatistics, } from '../helpers/store-models';
import type { GroupedData } from './model/export';
import type { DocStatsItem, DocumentByDate } from './model/opensearch';
import type { ModuleConfiguration } from '../../../../shared/domain/module-config';
import type { OpensearchConfiguration } from '../../../../shared/domain/teleinfo-config';
import type { StatisticsValues } from '../../../../shared/domain/teleinfo';

const IGNORED_STORE_KEYS_PREFIXES = [FIRST_DATA_TS_IS_KEY, 'INITIAL_', 'TOTAL_', 'OVERALL_', 'YEAR_'];

/**
 * Export data to opensearch index
 */
export const exportDataToOpensearch = async (entries: StoreDataEntries, config: ModuleConfiguration) => {
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

  await sendToOpenSearch(groupedData, client, osConfig, config);

  Log.info('**** opensearch-exporter::exportDataToOpensearch Export ended!');
};

const groupData = (data: StoreDataEntries, config: ModuleConfiguration): GroupedData => {
  return Object.entries(data).reduce((grouped: GroupedData, [storeKey, storeValue]) => {
    if (IGNORED_STORE_KEYS_PREFIXES.some((prefix) => storeKey.startsWith(prefix))) {
      return grouped;
    }

    const { perDay } = grouped;
    let category: DocumentByDate | undefined = undefined;
    if (storeKey.startsWith('DAY')) {
      category = perDay;
    }

    if (category) {
      parseData(category, storeKey, storeValue, config);
    }

    return grouped;
  }, {
    perDay: {},
    perMonth: {},
  });
};

const parseData = (target: DocumentByDate, storeKey: string, storeValue: EntryValue, config: ModuleConfiguration) => {
  const date = extractDate(storeKey)
  const dateISO = dateToISO(date)
  let docItem = target[date];
  if (!docItem) {
    docItem = {
      date: parseISO(dateISO),
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
    const { apparentPower, estimatedPower, instantIntensity } = storeValue as StoredStatistics;
    docItem.statistics = {
      apparentPower: convertStats(apparentPower),
      estimatedPower: convertStats(estimatedPower),
      instantIntensity: convertStats(instantIntensity),
    };
  }

  if (config.debug) {
    Log.info(`'**** opensearch-exporter::parseData docItem=${JSON.stringify(docItem)}`);
  }
};

const extractDate = (storeKey: string) => {
  // only support per-day dates for now
  return storeKey.substring(storeKey.length - 8);
};

const convertStats = (statsItem?: StatisticsValues): DocStatsItem => {
  const { min, max, minTimestamp, maxTimestamp } = statsItem ?? {};
  return {
    max,
    maxDate: maxTimestamp !== undefined ? toDate(maxTimestamp) : undefined,
    min,
    minDate: minTimestamp !== undefined ? toDate(minTimestamp) : undefined,
  };
};

const sendToOpenSearch = async (data: GroupedData, osClient: Client, osConfig: OpensearchConfiguration, moduleConfig: ModuleConfiguration) => {
  const { indexName } = osConfig;

  const docPromises = Object.entries(data.perDay)
    .map(([dateKey, document]) => {
      if (moduleConfig.debug) {
        Log.info(`'**** opensearch-exporter::exportDataToOpensearch Adding document for key: ${dateKey}`);
      }

      return osClient.index({
        id: `day-${dateKey}`,
        index: indexName,
        body: document,
        refresh: true,
      });
    });

  Log.info(`**** opensearch-exporter::exportDataToOpensearch Exporting ${docPromises.length} documents`);

  const responses = await Promise.all(docPromises);

  if (moduleConfig.debug) {
    Log.info(`'**** opensearch-exporter::exportDataToOpensearch responses=${JSON.stringify(responses)}`);
  }
};
