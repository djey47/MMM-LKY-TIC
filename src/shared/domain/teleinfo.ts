// TODO use different types 

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
  hcHigHoursIndex = 'hcHighoursIndex',
  hcLowHoursIndex = 'lowHighHoursSchedule',
  instantIntensity = 'instantIntensity',
  lowHighHoursSchedule = 'lowHighHoursSchedule',
  maxCalledIntensity = 'maxCalledIntensity',
  subscribedIntensity = 'subscribedIntensity',
  subscribedPowerOverflowWarning = 'subscribedPowerOverflowWarning'
}

export interface TeleInfo {
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
  estimatedPower?: number;
  hcHigHoursIndex?: number;
  hcLowHoursIndex?: number;
  instantIntensity?: number;
  lowHighHoursSchedule?: string;
  maxCalledIntensity?: number;
  meta: {
    lastUpdateTimestamp?: number;
    unresolvedGroups: {
      [key: string]: string;
    };
  }
  subscribedIntensity?: number;
  subscribedPowerOverflowWarning?: string;
};
