export type StatsItem = {
  average?: number;
  min: number,
  minTimestamp: number,
  max: number,
  maxTimestamp: number,
}

export type Stats = {
  apparentPower: StatsItem,
  instantIntensity: StatsItem,
};

export type EntryValue = number | number[] | Stats;

export type StoreEntries = Record<string, EntryValue>;

export type Store = {
  meta: unknown,
  data: StoreEntries,
};
