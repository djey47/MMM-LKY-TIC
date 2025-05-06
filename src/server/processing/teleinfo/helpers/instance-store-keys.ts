import formatDate from 'date-fns/format';
import subDays from 'date-fns/subDays';
import subMonths from 'date-fns/subMonths';

export const generateCurrentDayISKey = (keyPrefix: string, dayOffset?: number) => {
  return generateCurrentISKey(keyPrefix, 'yyyyMMdd', dayOffset);
}

export const generateCurrentMonthISKey = (keyPrefix: string, monthOffset?: number) => {
  return generateCurrentISKey(keyPrefix, 'yyyyMM', monthOffset, false);
}

export const generateCurrentYearISKey = (keyPrefix: string) => {
  return generateCurrentISKey(keyPrefix, 'yyyy');
}

const generateCurrentISKey = (keyPrefix: string, dateFormat: string, offset = 0, isForDays = true) => {
  const currentDate = new Date();
  const effectiveDate = isForDays ? subDays(currentDate, offset) : subMonths(currentDate, offset);
  const dateSuffix = formatDate(effectiveDate, dateFormat);
  return `${keyPrefix}${dateSuffix}`;
};
