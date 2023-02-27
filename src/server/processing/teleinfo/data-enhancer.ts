/**
 * Extrapolates Teleinfo data
 */

import { ExtendedMetadata, TeleInfo } from '../../../shared/domain/teleinfo';
import { TeleinfoConfiguration } from '../../../shared/domain/teleinfo-config';
import { computeEstimatedPrices } from './fare-manager';
import { computeStatistics } from './stats';
import { InstanceStore } from './helpers/instance-store';
import {
  FIRST_DATA_TS_IS_KEY,
  INITIAL_INDEXES_IS_KEY,
  PER_DAY_INDEXES_IS_KEY_PREFIX,
  PER_DAY_SUPPLIED_IS_KEY_PREFIX,
  PER_MONTH_INDEXES_IS_KEY_PREFIX,
  PER_MONTH_SUPPLIED_IS_KEY_PREFIX,
  TOTAL_SUPPLIED_IS_KEY,
} from './helpers/store-constants';
import { readIndexes } from './index-reader';
import { generateCurrentDayISKey, generateCurrentMonthISKey } from './helpers/instance-store-keys';
import { StoredIndexes } from './helpers/store-models';

export function computeAdditionalTeleinfoData(
  data: TeleInfo,
  config: TeleinfoConfiguration
): TeleInfo {
  const { apparentPower } = data;
  const { fareDetails, powerFactor } = config;

  const enhancedData = {
    ...data,
    meta: enhanceMetadata(data.meta),
    estimatedPower: computeEstimatedPower(powerFactor, apparentPower),
    estimatedPrices: { ...computeEstimatedPrices(data, fareDetails) },
    suppliedPower: { ...computeSuppliedPowers(data) },
  };

  return {
    ...enhancedData,
    statistics: { ...computeStatistics(enhancedData) },
  };
}

function enhanceMetadata(
  meta?: ExtendedMetadata
): ExtendedMetadata | undefined {
  if (!meta) {
    return undefined;
  }

  const storeInstance = InstanceStore.getInstance();

  // First received data timestamp: use value in data store otherwise initialize it
  const firstDataTimestamp =
    (storeInstance.get(FIRST_DATA_TS_IS_KEY) as number) || new Date().getTime();
  storeInstance.put(FIRST_DATA_TS_IS_KEY, firstDataTimestamp);
  return {
    ...meta,
    firstDataTimestamp,
  };
}

function computeEstimatedPower(
  powerFactor: number,
  apparentPower?: number
): number | undefined {
  if (apparentPower === undefined) {
    return undefined;
  }

  return Math.round(apparentPower * powerFactor);
}

function computeSuppliedPowers(
  data: TeleInfo
) {
  const storeInstance = InstanceStore.getInstance();
  const currentIndexes = readIndexes(data);

  // Total supply
  const initialIndexes = storeInstance.get(INITIAL_INDEXES_IS_KEY) as StoredIndexes;
  const total = computeSuppliedPower(initialIndexes, currentIndexes);

  // Supply for the current day
  const currentDayIndexesISKey = generateCurrentDayISKey(
    PER_DAY_INDEXES_IS_KEY_PREFIX
  );
  const initialDayIndexes = storeInstance.get(
    currentDayIndexesISKey
  ) as number[];
  const currentDay = computeSuppliedPower(initialDayIndexes, currentIndexes);

  // Supply for the current month
  const currentMonthIndexesISKey = generateCurrentMonthISKey(
    PER_MONTH_INDEXES_IS_KEY_PREFIX
  );
  const initialMonthIndexes = storeInstance.get(
    currentMonthIndexesISKey
  ) as number[];
  const currentMonth = computeSuppliedPower(initialMonthIndexes, currentIndexes);

  // Store computed values for historization
  if (total) {
    storeInstance.put(TOTAL_SUPPLIED_IS_KEY, total);
  }
  if (currentDay) {
    const currentDaySuppliedISKey = generateCurrentDayISKey(
      PER_DAY_SUPPLIED_IS_KEY_PREFIX
    );
    storeInstance.put(currentDaySuppliedISKey, currentDay);
  }
  if (currentMonth) {
    const currentMonthSuppliedISKey = generateCurrentMonthISKey(
      PER_MONTH_SUPPLIED_IS_KEY_PREFIX
    );
    storeInstance.put(currentMonthSuppliedISKey, currentMonth);
  }

  return {
    currentDay,
    currentMonth,
    total,
  };
}

function computeSuppliedPower(
  initialIndexes?: (number | undefined)[],
  currentIndexes?: (number | undefined)[]
) {
  if (!initialIndexes || !currentIndexes) {
    return undefined;
  }

  return currentIndexes.map((currentIndex, rank) => {
    const initialIndex = initialIndexes[rank];
    if (currentIndex === undefined || initialIndex === undefined) {
      return 0;
    }
    return currentIndex - initialIndex;
  });
}
