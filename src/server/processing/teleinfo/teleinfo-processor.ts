import { Log } from '../../utils/mm2_facades';
import { MM2Helper } from '../../types/mm2';
import { start } from './reader';

export function startProcessing(helperContext: MM2Helper) {
  if (helperContext.config?.debug) {
    Log.log(
      `**** teleinfo-processor::startProcessing with config: ${JSON.stringify(
        helperContext.config
      )}`
    );
  }

  const teleinfoConfig = helperContext.config?.teleinfo;
  if(!teleinfoConfig) {
    Log.error('**** teleinfo-processor::startProcessing: configuration does not include teleinfo settings!');
    return;
  }

  start(teleinfoConfig);
}
