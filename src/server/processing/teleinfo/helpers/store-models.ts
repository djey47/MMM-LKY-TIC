import { StatisticsValues } from '../../../../shared/domain/teleinfo';

export type StoredIndexes = (number | undefined)[];

export type StoredStatistics = {
  [topic: string]: StatisticsValues | undefined;
  instantPower?: StatisticsValues;
  instantIntensity?: StatisticsValues;
}

export type Store = {
  meta: {
    initTs: number;
    lastReadTs?: number;
    lastWriteTs?: number;
    lastPersistTs?: number;
  };
  data: StoreDataEntries;
}

export type StoreDataEntries = Record<string, EntryValue>;

export type EntryNumericValue = number;

export type EntryNumericTupleValue = (number | undefined)[];

export type EntryValue = EntryNumericValue | EntryNumericTupleValue | StoredStatistics;

export type Stats = {
  apparentPower: StatsItem,
  instantIntensity: StatsItem,
};

export type StatsItem = {
  min: number,
  minTimestamp: number,
  max: number,
  maxTimestamp: number,
}
