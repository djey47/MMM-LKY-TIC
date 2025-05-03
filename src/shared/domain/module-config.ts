import { TeleinfoConfiguration } from './teleinfo-config';

/**
 * Describes whole configuration structure of this MM2 module
 */
export interface ModuleConfiguration {
  debug?: boolean;
  currencySymbol?: string;
  pageDurationMs?: number;
  teleinfo?: TeleinfoConfiguration;
}
