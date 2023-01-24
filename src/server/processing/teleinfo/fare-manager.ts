import { format as formatDate } from 'date-fns';
import { TeleInfo } from '../../../shared/domain/teleinfo';
import { FareDetails } from '../../../shared/domain/teleinfo-config';
import { InstanceStore } from './helpers/instance-store';

const INITIAL_INDEXES_IS_KEY = 'INITIAL_INDEXES';
const TOTAL_COSTS_IS_KEY = 'TOTAL_COSTS_';
const PER_DAY_COSTS_IS_KEY_PREFIX = 'DAY_COSTS_';
const PER_DAY_INDEXES_IS_KEY_PREFIX = 'DAY_INDEXES_';

const PRICE_KEYS_PER_FARE_OPTION: {
  [key: string]: string[];
} = {
  BASE: ['basePricePerKwh'],
  EJP: ['ejpNormalPricePerKwh', 'ejpPeakPricePerKwh'],
  HC: ['hcLHPricePerKwh', 'hcHHPricePerKwh'],
}

const INDEX_KEYS_PER_FARE_OPTION: {
  [key: string]: string[];
} = {
  BASE: ['baseIndex'],
  EJP: ['ejpNormalHoursIndex', 'ejpMobilePeakHoursIndex'],
  HC: ['hcLowHoursIndex', 'hcHighHoursIndex'],
}

export function computeEstimatedPrices(data: TeleInfo, fareDetails: FareDetails) {
  const storeInstance = InstanceStore.getInstance();

  // Get current indexes from parsed data
  const indexes = readIndexes(data);
  if(!indexes) {
    return undefined;
  }

  // Retrieve fare price keys
  if (data.chosenFareOption === undefined) {
    return undefined;
  }
  const currentPriceKeys = PRICE_KEYS_PER_FARE_OPTION[data.chosenFareOption] as string[];
  if (!currentPriceKeys) {
    return undefined;
  }
  
  // Retrieve initial indexes from instance store or save them for the first time
  let initialIndexes = storeInstance.get(INITIAL_INDEXES_IS_KEY) as (number | undefined)[];
  if (!initialIndexes) {
    initialIndexes = [...indexes];
    storeInstance.put(INITIAL_INDEXES_IS_KEY, initialIndexes);
  }
  // console.log({ indexes, currentPriceKeys, initialIndexes });

  // Retrieve or store indexes for the current day
  const dateSuffix = formatDate(new Date(), 'yyyyMMdd');
  const currentDayIndexesISKey = `${PER_DAY_INDEXES_IS_KEY_PREFIX}${dateSuffix}`;
  let initialDayIndexes = storeInstance.get(currentDayIndexesISKey) as (number | undefined)[];
  if (!initialDayIndexes) {
    initialDayIndexes = [...indexes];
    storeInstance.put(currentDayIndexesISKey, initialDayIndexes);
    storeInstance.persist();
  }
  console.log({ indexes, currentDayISKey: currentDayIndexesISKey, initialDayIndexes });

  // Compute prices
  const totalPrice = computePrice(initialIndexes, indexes, currentPriceKeys, fareDetails);
  const totalDayPrice = computePrice(initialDayIndexes, indexes, currentPriceKeys, fareDetails);

  storeInstance.put(TOTAL_COSTS_IS_KEY, totalPrice);
  storeInstance.put(`${PER_DAY_COSTS_IS_KEY_PREFIX}${dateSuffix}`, totalDayPrice);

  console.log({ totalPrice, totalDayPrice, dateSuffix });

  return {
    total: totalPrice === undefined ? undefined : Math.round(totalPrice),
    currentDay: totalDayPrice === undefined ? undefined : Math.round(totalDayPrice),
  };
}

function readIndexes(data: TeleInfo) {
  if(!data.chosenFareOption) {
    return undefined;
  }

  // Attempt to retrieve indexes for instance store first
  const currentIndexKeys = INDEX_KEYS_PER_FARE_OPTION[data.chosenFareOption];
  return currentIndexKeys.map((k) => data[k]) as (number | undefined)[];
}

function computePrice(
  initialIndexes: (number|undefined)[],
  indexes: (number|undefined)[],
  currentPriceKeys: string[],
  fareDetails: FareDetails,
) {
  return indexes.reduce((amount: number, currentIndex: number | undefined, indexRank: number) => {
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
    // console.log({ indexDelta });
    return amount + indexDelta * pricePerKwh;
  }, 0);
}
