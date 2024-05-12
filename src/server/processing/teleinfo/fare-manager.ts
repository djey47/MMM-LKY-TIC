import differenceInHours from 'date-fns/differenceInHours';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import startOfDay from 'date-fns/startOfDay';
import startOfMonth from 'date-fns/startOfMonth';
import startOfYear from 'date-fns/startOfYear';
import { TeleInfo } from '../../../shared/domain/teleinfo';
import { FareDetails } from '../../../shared/domain/teleinfo-config';
import { InstanceStore } from './helpers/instance-store';
import { generateCurrentDayISKey, generateCurrentMonthISKey, generateCurrentYearISKey } from './helpers/instance-store-keys';
import {
  FIRST_DATA_TS_IS_KEY,
  INITIAL_INDEXES_IS_KEY,
  PER_DAY_COSTS_IS_KEY_PREFIX,
  PER_DAY_INDEXES_IS_KEY_PREFIX,
  PER_MONTH_COSTS_IS_KEY_PREFIX,
  PER_MONTH_INDEXES_IS_KEY_PREFIX,
  PER_YEAR_COSTS_IS_KEY_PREFIX,
  PER_YEAR_INDEXES_IS_KEY_PREFIX,
  TOTAL_COSTS_IS_KEY,
} from './helpers/store-constants';
import { StoredIndexes } from './helpers/store-models';
import { readIndexes } from './index-reader';
import { ComputationPeriod } from './types/computation-period';

const PRICE_KEYS_PER_FARE_OPTION: {
  [key: string]: string[];
} = {
  BASE: ['basePricePerKwh'],
  EJP: ['ejpNormalPricePerKwh', 'ejpPeakPricePerKwh'],
  HC: ['hcLHPricePerKwh', 'hcHHPricePerKwh'],
};

export function computeEstimatedPrices(
  data: TeleInfo,
  fareDetails: FareDetails
) {
  const storeInstance = InstanceStore.getInstance();
  let shouldStoreBePersisted = false;
  let shouldStoreBeExported = false;

  // Get current indexes from parsed data
  const indexes = readIndexes(data);
  if (!indexes) {
    return undefined;
  }

  // Retrieve fare price keys
  if (data.chosenFareOption === undefined) {
    return undefined;
  }
  const currentPriceKeys = PRICE_KEYS_PER_FARE_OPTION[
    data.chosenFareOption
  ] as string[];
  if (!currentPriceKeys) {
    return undefined;
  }

  // Retrieve initial indexes from instance store or save them for the first time
  let initialIndexes = storeInstance.get(INITIAL_INDEXES_IS_KEY) as StoredIndexes;
  if (!initialIndexes) {
    initialIndexes = [...indexes];
    storeInstance.put(INITIAL_INDEXES_IS_KEY, initialIndexes);
    shouldStoreBePersisted = true;
  }
  // console.log({ indexes, currentPriceKeys, initialIndexes });

  // Retrieve or store indexes for the current day
  const currentDayIndexesISKey = generateCurrentDayISKey(
    PER_DAY_INDEXES_IS_KEY_PREFIX
  );
  let initialDayIndexes = storeInstance.get(currentDayIndexesISKey) as StoredIndexes;
  if (!initialDayIndexes) {
    initialDayIndexes = [...indexes];
    storeInstance.put(currentDayIndexesISKey, initialDayIndexes);
    shouldStoreBePersisted = true;
    shouldStoreBeExported = true;
  }
  // console.log({ indexes, currentDayISKey: currentDayIndexesISKey, initialDayIndexes });

  // Retrieve or store indexes for the current month
  const currentMonthIndexesISKey = generateCurrentMonthISKey(
    PER_MONTH_INDEXES_IS_KEY_PREFIX
  );
  let initialMonthIndexes = storeInstance.get(currentMonthIndexesISKey) as StoredIndexes;
  if (!initialMonthIndexes) {
    initialMonthIndexes = [...indexes];
    storeInstance.put(currentMonthIndexesISKey, initialMonthIndexes);
    shouldStoreBePersisted = true;
  }

  // Retrieve or store indexes for the current year
  const currentYearIndexesISKey = generateCurrentYearISKey(
    PER_YEAR_INDEXES_IS_KEY_PREFIX
  );
  let initialYearIndexes = storeInstance.get(currentYearIndexesISKey) as StoredIndexes;
  if (!initialYearIndexes) {
    initialYearIndexes = [...indexes];
    storeInstance.put(currentYearIndexesISKey, initialYearIndexes);
    shouldStoreBePersisted = true;
  }

  // Compute prices
  const totalPrice = computePrice(
    initialIndexes,
    indexes,
    currentPriceKeys,
    fareDetails,
    ComputationPeriod.OVERALL
  );
  const totalDayPrice = computePrice(
    initialDayIndexes,
    indexes,
    currentPriceKeys,
    fareDetails,
    ComputationPeriod.DAY
  );
  const totalMonthPrice = computePrice(
    initialMonthIndexes,
    indexes,
    currentPriceKeys,
    fareDetails,
    ComputationPeriod.MONTH
  );
  const totalYearPrice = computePrice(
    initialYearIndexes,
    indexes,
    currentPriceKeys,
    fareDetails,
    ComputationPeriod.YEAR
  );

  storeInstance.put(TOTAL_COSTS_IS_KEY, totalPrice);

  const currentDayCostsISKey = generateCurrentDayISKey(
    PER_DAY_COSTS_IS_KEY_PREFIX
  );
  storeInstance.put(currentDayCostsISKey, totalDayPrice);

  const currentMonthCostsISKey = generateCurrentMonthISKey(
    PER_MONTH_COSTS_IS_KEY_PREFIX
  );
  storeInstance.put(currentMonthCostsISKey, totalMonthPrice);

  const currentYearCostsISKey = generateCurrentYearISKey(
    PER_YEAR_COSTS_IS_KEY_PREFIX
  );
  storeInstance.put(currentYearCostsISKey, totalYearPrice);

  // console.log({ totalPrice, totalDayPrice });

  // Persistance & export
  if (shouldStoreBePersisted) {
    storeInstance.persist();
  }
  if (shouldStoreBeExported) {
    storeInstance.export();
  }

  return {
    total: totalPrice && Math.round(totalPrice),
    currentDay:
      totalDayPrice,
    currentMonth: totalMonthPrice && Math.round(totalMonthPrice),
    currentYear: totalYearPrice && Math.round(totalYearPrice),
  };
}

function computePrice(
  initialIndexes: (number | undefined)[],
  indexes: (number | undefined)[],
  currentPriceKeys: string[],
  fareDetails: FareDetails,
  period: ComputationPeriod,
) {
  return indexes.reduce(
    (amount: number, currentIndex: number | undefined, indexRank: number) => {
      if (currentIndex === undefined) {
        return amount;
      }

      const initialIndex = initialIndexes[indexRank];
      if (initialIndex === undefined) {
        return amount;
      }

      const priceKey = currentPriceKeys[indexRank];
      const pricePerKwh = fareDetails[priceKey as string];
      // console.log({ priceKey, pricePerKwh });
      if (pricePerKwh === undefined) {
        return amount;
      }

      const indexDelta = (currentIndex - initialIndex) / 1000;

      const subscriptionFeeProRata = computeSubscriptionFee(period, fareDetails.subscriptionFeePerMonth);

      console.log('fare-manager::computePrice', { indexDelta, subscriptionFeeProRata });

      return amount + indexDelta * pricePerKwh + subscriptionFeeProRata;
    },
    0
  );
}

function computeSubscriptionFee(period: ComputationPeriod, feePerMonth?: number) {
  if (feePerMonth === undefined) {
    return 0;
  }

  const now = Date.now();
  const hoursInMonth = getDaysInMonth(now) * 24;
  // FIXME average nb of days per month in a year...
  const averageHoursInMonth = 30.42 * 24;
  const firstDataTs = InstanceStore.getInstance().get(FIRST_DATA_TS_IS_KEY)

  let start, diff;
  switch (period) {
    case ComputationPeriod.DAY:
      start = startOfDay(now);
      diff = differenceInHours(now, start);
      return feePerMonth * diff / hoursInMonth;

    case ComputationPeriod.MONTH:
      start = startOfMonth(now);
      diff = differenceInHours(now, start);
      return feePerMonth * diff / hoursInMonth;

    case ComputationPeriod.YEAR:
      start = startOfYear(now);
      diff = differenceInHours(now, start);
      return feePerMonth * diff / averageHoursInMonth;

    case ComputationPeriod.OVERALL:
      start = new Date(firstDataTs as number);
      diff = differenceInHours(now, start);
      return feePerMonth * diff / averageHoursInMonth;
  }
}
