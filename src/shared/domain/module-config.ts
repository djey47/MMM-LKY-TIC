import { TeleinfoConfiguration } from "./teleinfo-config";

/**
 * Describes whole configuration structure of this MM2 module
 */
export interface ModuleConfiguration {
  debug?: boolean;
  currencySymbol?: string;
  teleinfo?: TeleinfoConfiguration;
};
