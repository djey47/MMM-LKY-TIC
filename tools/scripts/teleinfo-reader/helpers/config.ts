import * as AppRootDir from 'app-root-dir';
import {readFile} from 'fs/promises';
import * as Path from 'path';
import { TeleinfoConfiguration } from '../../../../src/server/processing/tele-info/domain/teleinfo-config';

/**
 * @returns Promise to configuration read from json file
 */
export async function read(): Promise<TeleinfoConfiguration> {
  const appRootDir = AppRootDir.get();

  const configFilePath = Path.join(appRootDir, 'tools', 'scripts', 'teleinfo-reader', 'config', 'teleinfo-reader.json');
  const configContents = await readFile(configFilePath, { encoding: 'utf-8' });
  return JSON.parse(configContents);
}
