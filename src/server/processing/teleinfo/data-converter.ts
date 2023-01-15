import { TeleInfoHistoricalOutputKeys } from '../../../shared/domain/teleinfo';

export function convertTeleinfoRawData(dataKey: string, rawValue?: string): string | number | undefined {
  if (rawValue === undefined) {
    return undefined;
  }

  switch(dataKey) {
    case TeleInfoHistoricalOutputKeys.apparentPower.toString():
    case TeleInfoHistoricalOutputKeys.baseIndex.toString():
    case TeleInfoHistoricalOutputKeys.ejpMobilePeakHoursIndex.toString():
    case TeleInfoHistoricalOutputKeys.ejpNormalHoursIndex.toString():
    case TeleInfoHistoricalOutputKeys.hcHigHoursIndex.toString():
    case TeleInfoHistoricalOutputKeys.hcLowHoursIndex.toString():
    case TeleInfoHistoricalOutputKeys.instantIntensity.toString():
    case TeleInfoHistoricalOutputKeys.maxCalledIntensity.toString():
    case TeleInfoHistoricalOutputKeys.subscribedIntensity.toString():
      return Number(rawValue);
    case TeleInfoHistoricalOutputKeys.chosenFareOption.toString():
    case TeleInfoHistoricalOutputKeys.counterAddress.toString():
    case TeleInfoHistoricalOutputKeys.counterStateWord.toString():
    case TeleInfoHistoricalOutputKeys.currentFarePeriod.toString():
    case TeleInfoHistoricalOutputKeys.ejpNotice.toString():
    case TeleInfoHistoricalOutputKeys.lowHighHoursSchedule.toString():
    case TeleInfoHistoricalOutputKeys.subscribedPowerOverflowWarning.toString():
      return rawValue;
    default:
      return undefined;
  }
}
