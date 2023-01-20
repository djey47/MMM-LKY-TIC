export enum TeleInfoHistoricalInputCodes {
  ADCO = 'ADCO',
  ADPS = 'ADPS',
  BASE = 'BASE',
  EJPHN = 'EJPHN',
  EJPHPM = 'EJPHPM',
  HCHC = 'HCHC',
  HCHP = 'HCHP',
  HHPHC = 'HHPHC',
  IINST = "IINST",
  IMAX = 'IMAX',
  ISOUSC = 'ISOUSC',
  MOTDETAT = 'MOTDETAT',
  OPTARIF = 'OPTARIF',
  PAPP = 'PAPP',
  PEJP = 'PEJP',
  PTEC = 'PTEC'
}

export enum TeleInfoHistoricalOutputKeys {
  apparentPower = 'apparentPower',
  baseIndex = 'baseIndex',
  chosenFareOption = 'chosenFareOption',
  counterAddress = 'counterAddress',
  counterStateWord = 'counterStateWord',
  currentFarePeriod = 'currentFarePeriod',
  ejpNormalHoursIndex = 'ejpNormalHoursIndex',
  ejpMobilePeakHoursIndex = 'ejpMobilePeakHoursIndex',
  ejpNotice = 'ejpNotice',
  hcHighHoursIndex = 'hcHighHoursIndex',
  hcLowHoursIndex = 'hcLowHoursIndex',
  instantIntensity = 'instantIntensity',
  lowHighHoursSchedule = 'lowHighHoursSchedule',
  maxCalledIntensity = 'maxCalledIntensity',
  subscribedIntensity = 'subscribedIntensity',
  subscribedPowerOverflowWarning = 'subscribedPowerOverflowWarning'
}

export enum FareOptions {
  /**
   * Unique fare
   */
  BASE = 'BASE',
  /** 
   * Normal period fare / Mobile peak period fare  
   */
  EJP = 'EJP',
  /**
   * Low fare hours / High fare hours
   */
  HC = 'HC',
}

/**
 * Collected data
 */
interface OriginTeleInfo {
  [key: string]: string | number | object | undefined;
  apparentPower?: number;
  baseIndex?: number;
  counterAddress?: string;
  counterStateWord?: string;
  chosenFareOption?: string;
  currentFarePeriod?: string;
  ejpNormalHoursIndex?: number;
  ejpMobilePeakHoursIndex?: number;
  ejpNotice?: string;
  hcHighHoursIndex?: number;
  hcLowHoursIndex?: number;
  instantIntensity?: number;
  lowHighHoursSchedule?: string;
  maxCalledIntensity?: number;
  subscribedIntensity?: number;
  subscribedPowerOverflowWarning?: string;
}

/**
 * Computed data
 */
interface ExtendedTeleInfo {
  estimatedPower?: number;
  estimatedPrices?: {
    currentDay?: number;
    total?: number;
  };
  meta: {
    lastUpdateTimestamp?: number;
    unresolvedGroups: {
      [key: string]: string;
    };
  } 
}

/**
 * Whole Teleinfo data (collected and computed)
 */
export interface TeleInfo extends OriginTeleInfo, ExtendedTeleInfo {}
