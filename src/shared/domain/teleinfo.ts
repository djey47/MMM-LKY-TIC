// TODO use different types 
export interface TeleInfo {
  [key: string]: string | number | object | undefined;
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
    unresolvedGroups: {
      [key: string]: string;
    };
  }
  subscribedIntensity?: string;
  subscribedPowerOverflowWarning?: string;
};
