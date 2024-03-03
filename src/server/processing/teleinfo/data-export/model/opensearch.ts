export type DocStatsItem = {
  min: number,
  minDate: Date,
  max: number,
  maxDate: Date,
};

export type DocPeriodicInfo = {
  period1: number,
  period2: number,
};

export type Document = {
  costs?: number,
  date: Date,
  indexes?: DocPeriodicInfo,
  options: {
    fareOption: string,
    period1Label: string,
    period2Label: string,
  },
  statistics?: {
    apparentPower: DocStatsItem,
    instantIntensity: DocStatsItem,
  },
  supplied?: DocPeriodicInfo,
}

export type DocumentByDate = Record<string, Document>;
