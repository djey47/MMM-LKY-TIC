/**
 * Extrapolates Teleinfo data
 */

import { TeleInfo } from '../../../shared/domain/teleinfo';
import { TeleinfoConfiguration } from '../../../shared/domain/teleinfo-config';
import { computeEstimatedPrice } from './fare-manager';

export function computeAdditionalTeleinfoData(data: TeleInfo, config: TeleinfoConfiguration): TeleInfo {
  const { apparentPower } = data;
  const { fareDetails, powerFactor } = config;

  return {
    ...data,
    estimatedPower: computeEstimatedPower(powerFactor, apparentPower),
    estimatedPrice: computeEstimatedPrice(data, fareDetails),
  };
}

function computeEstimatedPower(powerFactor: number, apparentPower?: number): number | undefined {
  if (apparentPower === undefined) {
    return undefined;
  }

  return Math.round(apparentPower * powerFactor);
}
