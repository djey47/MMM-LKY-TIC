import { TeleInfo } from '../../../shared/domain/teleinfo';
import { FareDetails } from '../../../shared/domain/teleinfo-config';
import { InstanceStore } from './helpers/instance-store';

const INITIAL_INDEXES_IS_KEY = 'INITIAL_INDEXES';

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

export function computeEstimatedPrice(data: TeleInfo, fareDetails: FareDetails) {
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

  // Compute price
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

    const indexDelta = currentIndex - initialIndex ;
    // console.log({ indexDelta });
    return amount + indexDelta * pricePerKwh;
  }, 0);

  return totalPrice === undefined ? undefined : Math.round(totalPrice);
}

function readIndexes(data: TeleInfo) {
  if(!data.chosenFareOption) {
    return undefined;
  }

  const currentIndexKeys = INDEX_KEYS_PER_FARE_OPTION[data.chosenFareOption];
  return currentIndexKeys.map((k) => data[k]) as (number | undefined)[];
}
