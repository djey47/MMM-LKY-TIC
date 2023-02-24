import { StatisticsValues, TeleInfo, TopicStatistics } from '../../../shared/domain/teleinfo';
import { InstanceStore } from './helpers/instance-store';
import { generateCurrentDayISKey, generateCurrentMonthISKey } from './helpers/instance-store-keys';
import { PER_DAY_STATS_IS_KEY_PREFIX, PER_MONTH_STATS_IS_KEY_PREFIX, OVERALL_STATS_IS_KEY } from './helpers/store-constants';
import { StoredStatistics } from './helpers/store-models';

export function computeStatistics(data: TeleInfo) {
  const instantPowerStats = computeTopicStats('estimatedPower', data.estimatedPower);
  const instantIntensityStats = computeTopicStats('instantIntensity', data.instantIntensity);
  return {
    instantPower: instantPowerStats,
    instantIntensity: instantIntensityStats,
  };
}

function computeTopicStats(name: string, value?: number): TopicStatistics | undefined {
  if (value === undefined) {
    return undefined;
  }
  const currentDay = computePeriodicStats(value, generateCurrentDayISKey(PER_DAY_STATS_IS_KEY_PREFIX), name);
  const currentMonth = computePeriodicStats(value, generateCurrentMonthISKey(PER_MONTH_STATS_IS_KEY_PREFIX), name);
  const overall = computePeriodicStats(value, OVERALL_STATS_IS_KEY, name);
  return {
    currentDay,
    currentMonth,
    overall,
  };
}

function computePeriodicStats(value: number, isKey: string, topicName: string): StatisticsValues {
  const storeInstance = InstanceStore.getInstance();

  const storedStats = storeInstance.get(isKey) as StoredStatistics;
  let newStatsValues: StatisticsValues;
  if (storedStats && storedStats[topicName]) {
    const currentStats = storedStats[topicName];
    newStatsValues = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      min: value < currentStats!.min ? value : currentStats!.min,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      max: value > currentStats!.max ? value : currentStats!.max,
      // TODO average
    }
  } else {
    newStatsValues = {
      min: value,
      max: value,
    };
  }

  const newStoredStats: StoredStatistics = {
    ...storedStats,
    [topicName]: newStatsValues,
  }

  storeInstance.put(isKey, newStoredStats);

  return newStatsValues;
}
