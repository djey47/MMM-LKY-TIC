import { Log } from '../../utils/mm2_facades';
import { MM2Helper } from '../../types/mm2';
import { start } from './reader';

const HEARTBEAT_INTERVAL_MS = 5000;

export function startProcessing(helperContext: MM2Helper) {
  if (helperContext.config?.debug) {
    Log.log(
      `**** teleinfo-processor::startProcessing with config: ${JSON.stringify(
        helperContext.config
      )}`
    );
  }

  const teleinfoConfig = helperContext.config?.teleinfo;
  if (!teleinfoConfig) {
    Log.error(
      '**** teleinfo-processor::startProcessing: configuration does not include teleinfo settings!'
    );
    return;
  }

  // Heartbeat to keep track of the link status
  helperContext.heartbeatTimerId = setInterval(() => {
    if (helperContext.sendSocketNotification) {
      helperContext.sendSocketNotification('TELEINFO_HEARTBEAT', { ts: new Date().getTime() });
    }
  }, HEARTBEAT_INTERVAL_MS);

  // Actual TIC processing starts there
  start(teleinfoConfig, helperContext);
}
