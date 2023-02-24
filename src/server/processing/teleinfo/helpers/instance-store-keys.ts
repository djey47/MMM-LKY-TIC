import { format as formatDate } from 'date-fns';

export function generateCurrentDayISKey(keyPrefix: string) {
  return generateCurrentISKey(keyPrefix, 'yyyyMMdd');
}

export function generateCurrentMonthISKey(keyPrefix: string) {
  return generateCurrentISKey(keyPrefix, 'yyyyMM');
}

function generateCurrentISKey(keyPrefix: string, dateFormat: string) {
  const dateSuffix = formatDate(new Date(), dateFormat);
  return `${keyPrefix}${dateSuffix}`;
}
