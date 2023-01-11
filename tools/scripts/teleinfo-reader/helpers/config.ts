import * as AppRootDir from 'app-root-dir';
import {readFile} from 'fs/promises';
import * as Path from 'path';
import { TeleinfoConfiguration } from '../../../../src/server/processing/tele-info/domain/teleinfo-config';

export async function read(): Promise<TeleinfoConfiguration> {
  const appRootDir = AppRootDir.get();

  const configFilePath = Path.join(appRootDir, 'tools', 'scripts', 'teleinfo-reader', 'config', 'teleinfo-reader.json');
  // @ts-ignore
  const configContents = await readFile(configFilePath, 'UTF-8');
  return JSON.parse(configContents);
}
