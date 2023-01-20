import { format as formatDate } from 'date-fns';
import { TeleInfo } from '../../../shared/domain/teleinfo';
import { FareDetails } from '../../../shared/domain/teleinfo-config';
import { InstanceStore } from './helpers/instance-store';

const INITIAL_INDEXES_IS_KEY = 'INITIAL_INDEXES';
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
  let initialIndexes = InstanceStore.getInstance().get(INITIAL_INDEXES_IS_KEY) as (number | undefined)[];
  if (!initialIndexes) {
    initialIndexes = [...indexes];
    InstanceStore.getInstance().put(INITIAL_INDEXES_IS_KEY, initialIndexes);
  }
  // console.log({ indexes, currentPriceKeys, initialIndexes });

  // Retrieve or store indexes for the current day
  const currentDayISKey = `${PER_DAY_INDEXES_IS_KEY_PREFIX}${formatDate(new Date(), 'yyyyddMM')}`;
  let initialDayIndexes = InstanceStore.getInstance().get(currentDayISKey) as (number | undefined)[];
  if (!initialDayIndexes) {
    initialDayIndexes = [...indexes];
    InstanceStore.getInstance().put(currentDayISKey, initialDayIndexes);
  }
  console.log({ indexes, currentDayISKey, initialDayIndexes });

  // Compute prices
  // TODO Refactor in single function
  const totalPrice = indexes.reduce((amount: number, currentIndex: number | undefined, indexRank: number) => {
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
  const totalDayPrice = indexes.reduce((amount: number, currentIndex: number | undefined, indexRank: number) => {
    if (currentIndex === undefined) {
      return amount;
    }

    const initialDayIndex = initialDayIndexes[indexRank];
    if (initialDayIndex === undefined) {
      return amount;
    }

    const priceKey = currentPriceKeys[indexRank];
    const pricePerKwh = fareDetails[priceKey as string];
    // console.log({ priceKey, pricePerKwh });
    if (pricePerKwh === undefined) {
      return amount;
    }

    const indexDelta = (currentIndex - initialDayIndex) / 1000;
    // console.log({ indexDelta });
    return amount + indexDelta * pricePerKwh;
  }, 0);

  return {
    total: totalPrice === undefined ? undefined : Math.round(totalPrice),
    currentDay: totalDayPrice === undefined ? undefined : Math.round(totalDayPrice),
  };
}

function readIndexes(data: TeleInfo) {
  if(!data.chosenFareOption) {
    return undefined;
  }

  const currentIndexKeys = INDEX_KEYS_PER_FARE_OPTION[data.chosenFareOption];
  return currentIndexKeys.map((k) => data[k]) as (number | undefined)[];
}
