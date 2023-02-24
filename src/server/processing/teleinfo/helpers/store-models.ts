import { StatisticsValues } from '../../../../shared/domain/teleinfo';

export interface StoredStatistics {
  [topic: string]: StatisticsValues | undefined;
  instantPower?: StatisticsValues;
  instantIntensity?: StatisticsValues;
}
