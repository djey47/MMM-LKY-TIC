import { StatisticsValues, TeleInfo, TopicStatistics } from '../../../shared/domain/teleinfo';
import { InstanceStore } from './helpers/instance-store';
import { generateCurrentDayISKey, generateCurrentMonthISKey } from './helpers/instance-store-keys';
import { PER_DAY_STATS_IS_KEY_PREFIX, PER_MONTH_STATS_IS_KEY_PREFIX, OVERALL_STATS_IS_KEY } from './helpers/store-constants';
import { StoredStatistics } from './helpers/store-models';

export function computeStatistics(data: TeleInfo) {
  const instantPowerStats = computeTopicStats('apparentPower', data.apparentPower);
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

  const currentTime = new Date().getTime();
  const storedStats = storeInstance.get(isKey) as StoredStatistics;
  let newStatsValues: StatisticsValues;
  if (storedStats && storedStats[topicName]) {
    const currentStats = storedStats[topicName];
    const isNewMininum = value < (currentStats?.min || Number.POSITIVE_INFINITY);
    const isNewMaximum = value > (currentStats?.max || Number.NEGATIVE_INFINITY);
    newStatsValues = {
      min: isNewMininum ? value : currentStats?.min || 0,
      minTimestamp: isNewMininum ? currentTime : currentStats?.minTimestamp || 0,
      max: isNewMaximum ? value : currentStats?.max || Number.MAX_VALUE,
      maxTimestamp: isNewMaximum ? currentTime : currentStats?.maxTimestamp || 0,
      // TODO average
    }
  } else {
    newStatsValues = {
      min: value,
      max: value,
      minTimestamp: currentTime,
      maxTimestamp: currentTime,
    };
  }

  const newStoredStats: StoredStatistics = {
    ...storedStats,
    [topicName]: newStatsValues,
  }

  storeInstance.put(isKey, newStoredStats);

  return newStatsValues;
}
