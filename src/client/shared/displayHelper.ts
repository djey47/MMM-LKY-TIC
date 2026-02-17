import formatDate from 'date-fns/format';
import { DATE_FORMAT, LABELS_PER_FARE_PERIOD, PERIOD_LABELS_PER_FARE_OPTION, TIME_FORMAT, VALUE_NA } from './displayConstants';
import type { TeleInfo } from '../../shared/domain/teleinfo';

export const getPeriodLabel = (chosenFareOption: string | undefined, rank: number) => {
  if (!chosenFareOption) {
    return '';
  }
  return PERIOD_LABELS_PER_FARE_OPTION[chosenFareOption][rank] || '';
}

export const getCurrentPeriodLabel = (currentFarePeriod?: string) => {
  if (!currentFarePeriod) {
    return '';
  }
  return LABELS_PER_FARE_PERIOD[currentFarePeriod] || '';
}

export const displayDate = (timestamp?: number) => {
  if (!timestamp) {
    return VALUE_NA;
  }
  return `${formatDate(timestamp, TIME_FORMAT)}, on ${formatDate(
    timestamp,
    DATE_FORMAT
  )}`;
}

export const displayPriceWithTwoDecimals = (value?: number) => {
  if (!value) {
    return VALUE_NA;
  }

  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export const computeWholeSuppliedPower = (categoryKey: string, data?: TeleInfo) => {
  if (!data) {
    return VALUE_NA;
  }

  const { suppliedPower } = data;
  if (!suppliedPower) {
    return VALUE_NA;
  }

  const suppliedPowers = suppliedPower[categoryKey] as number[];
  if (!suppliedPowers) {
    return VALUE_NA;
  }

  return suppliedPowers.reduce((sum, current) => {
    return sum + current;
  }, 0);
}
