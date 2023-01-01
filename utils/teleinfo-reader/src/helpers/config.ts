import * as AppRootDir from 'app-root-dir';
import {readFile} from 'fs/promises';
import * as Path from 'path';

export interface Configuration {
  baudRate: number;
  developer: {
    mockRefreshRate: number;
    serialPortMockEnabled: boolean;
  },
  serialDevice: string;
}

export async function read(): Promise<Configuration> {
  const appRootDir = AppRootDir.get();

  const configFilePath = Path.join(appRootDir, 'config', 'teleinfo-reader.json');
  // @ts-ignore
  const configContents = await readFile(configFilePath, 'UTF-8');
  return JSON.parse(configContents);
}