import { StatisticsValues } from '../../../../shared/domain/teleinfo';


export type StoredIndexes = (number | undefined)[];

export interface StoredStatistics {
  [topic: string]: StatisticsValues | undefined;
  instantPower?: StatisticsValues;
  instantIntensity?: StatisticsValues;
}
