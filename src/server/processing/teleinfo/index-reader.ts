import { TeleInfo } from '../../../shared/domain/teleinfo';

const INDEX_KEYS_PER_FARE_OPTION: {
  [key: string]: string[];
} = {
  BASE: ['baseIndex'],
  EJP: ['ejpNormalHoursIndex', 'ejpMobilePeakHoursIndex'],
  HC: ['hcLowHoursIndex', 'hcHighHoursIndex'],
};

export function readIndexes(data: TeleInfo) {
  if (!data.chosenFareOption) {
    return undefined;
  }

  const currentIndexKeys = INDEX_KEYS_PER_FARE_OPTION[data.chosenFareOption];
  return currentIndexKeys.map((k) => data[k]) as (number | undefined)[];
}
