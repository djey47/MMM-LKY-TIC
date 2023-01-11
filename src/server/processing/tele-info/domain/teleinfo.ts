// TODO use different types 
export interface TeleInfo {
  apparentPower?: string;
  baseIndex?: string;
  counterAddress?: string;
  counterStateWord?: string;
  chosenFareOption?: string;
  currentFarePeriod?: string;
  ejpNormalHoursIndex?: string;
  ejpMobilePeakHoursIndex?: string;
  ejpNotice?: string;
  hcHighoursIndex?: string;
  hcLowHoursIndex?: string;
  instantIntensity?: string;
  lowHighHoursSchedule?: string;
  maxCalledIntensity?: string;
  meta: {
    lastUpdateTimestamp?: number;
    unresolvedGroups: object;
  }
  subscribedIntensity?: string;
  subscribedPowerOverflowWarning?: string;
};
