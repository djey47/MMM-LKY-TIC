import formatDate from 'date-fns/format';
import { DATE_FORMAT, LABELS_PER_FARE_PERIOD, PERIOD_LABELS_PER_FARE_OPTION, TIME_FORMAT } from './displayConstants';

export function getPeriodLabel(chosenFareOption: string | undefined, rank: number) {
  if (!chosenFareOption) {
    return '';
  }
  return PERIOD_LABELS_PER_FARE_OPTION[chosenFareOption][rank] || '';
}

export function getCurrentPeriodLabel(currentFarePeriod?: string) {
  if (!currentFarePeriod) {
    return '';
  }
  return LABELS_PER_FARE_PERIOD[currentFarePeriod] || '';
}

export function displayDate(timestamp?: number) {
  if (!timestamp) {
    return '...';
  }
  return `${formatDate(timestamp, TIME_FORMAT)}, on ${formatDate(
    timestamp,
    DATE_FORMAT
  )}`;
}

export function displayPriceWithTwoDecimals(value?: number) {
  if (!value) {
    return '...';
  }

  return Math.round((value + Number.EPSILON) * 100) / 100;
}

