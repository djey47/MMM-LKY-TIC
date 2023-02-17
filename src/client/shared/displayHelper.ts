import formatDate from 'date-fns/format';
import { DATE_FORMAT, PERIOD_LABELS_PER_FARE_OPTION, TIME_FORMAT } from './displayConstants';

export function getPeriodLabel(chosenFareOption: string | undefined, rank: number) {
  if (!chosenFareOption) {
    return '';
  }
  return PERIOD_LABELS_PER_FARE_OPTION[chosenFareOption][rank] || '';
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

