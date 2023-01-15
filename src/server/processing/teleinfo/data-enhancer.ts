/**
 * Extrapolates Teleinfo data
 */

import { TeleInfo } from '../../../shared/domain/teleinfo';
import { TeleinfoConfiguration } from './domain/teleinfo-config';

export function computeAdditionalTeleinfoData(data: TeleInfo, config: TeleinfoConfiguration): TeleInfo {
  const { apparentPower } = data;
  const { powerFactor } = config;
  return {
    ...data,
    estimatedPower: apparentPower === undefined ? undefined : Math.round(apparentPower * powerFactor)
  };
}
