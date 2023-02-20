
export const PERIOD_LABELS_PER_FARE_OPTION: {
  [key: string]: string[];
} = {
  BASE: ['base'],
  EJP: ['EJP:normal', 'EJP:peak'],
  HC: ['HC:low', 'HC:high'],
};

export const LABELS_PER_FARE_PERIOD: {
  [key: string]: string;
} = {
  // TODO: Check keys
  BASE: PERIOD_LABELS_PER_FARE_OPTION.BASE[0],
  EJPN: PERIOD_LABELS_PER_FARE_OPTION.EJP[0],
  EJPP: PERIOD_LABELS_PER_FARE_OPTION.EJP[1],
  HC: PERIOD_LABELS_PER_FARE_OPTION.HC[0],
  HP: PERIOD_LABELS_PER_FARE_OPTION.HC[1],
};

export const DATE_FORMAT = 'yyyy/MM/dd';

export const TIME_FORMAT = 'HH:mm:ss';
