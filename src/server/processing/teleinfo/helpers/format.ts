import parseDate from 'date-fns/parse';

export const dateToISO = (dateStr: string) => {
  const date = parseDate(dateStr, 'yyyyMMdd', new Date());
  return date.toISOString();
};

