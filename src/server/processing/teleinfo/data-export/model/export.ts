import type { DocumentByDate } from './opensearch';

export type GroupedData = {
  perDay: DocumentByDate,
  perMonth: DocumentByDate,
};
