import { TeleInfo } from '../../../shared/domain/teleinfo';
import { FareDetails } from '../../../shared/domain/teleinfo-config';
import { InstanceStore } from './helpers/instance-store';
import {
  INITIAL_INDEXES_IS_KEY,
  PER_DAY_COSTS_IS_KEY_PREFIX,
  PER_DAY_INDEXES_IS_KEY_PREFIX,
  TOTAL_COSTS_IS_KEY
} from './helpers/store-constants';
import { generateCurrentDayISKey, readIndexes } from './index-reader';

const PRICE_KEYS_PER_FARE_OPTION: {
  [key: string]: string[];
} = {
  BASE: ['basePricePerKwh'],
  EJP: ['ejpNormalPricePerKwh', 'ejpPeakPricePerKwh'],
  HC: ['hcLHPricePerKwh', 'hcHHPricePerKwh'],
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
  const currentDayIndexesISKey = generateCurrentDayISKey(PER_DAY_INDEXES_IS_KEY_PREFIX);
  let initialDayIndexes = storeInstance.get(currentDayIndexesISKey) as (number | undefined)[];
  if (!initialDayIndexes) {
    initialDayIndexes = [...indexes];
    storeInstance.put(currentDayIndexesISKey, initialDayIndexes);
    storeInstance.persist();
  }
 // console.log({ indexes, currentDayISKey: currentDayIndexesISKey, initialDayIndexes });

  // Compute prices
  const totalPrice = computePrice(initialIndexes, indexes, currentPriceKeys, fareDetails);
  const totalDayPrice = computePrice(initialDayIndexes, indexes, currentPriceKeys, fareDetails);

  storeInstance.put(TOTAL_COSTS_IS_KEY, totalPrice);

  const currentDayCostsISKey = generateCurrentDayISKey(PER_DAY_COSTS_IS_KEY_PREFIX);
  storeInstance.put(currentDayCostsISKey, totalDayPrice);

  // console.log({ totalPrice, totalDayPrice });

  return {
    total: totalPrice === undefined ? undefined : Math.round(totalPrice),
    currentDay: totalDayPrice === undefined ? undefined : Math.round(totalDayPrice),
  };
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
