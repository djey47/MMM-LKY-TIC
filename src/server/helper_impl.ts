import { NOTIF_INIT, NOTIF_SET_CONFIG } from '../support/notifications';
import { MM2Helper } from './types/mm2';
import { startProcessing } from './processing/teleinfo/teleinfo-processor';
import { InstanceStore } from './processing/teleinfo/helpers/instance-store';

/**
 * Magic Mirror 2
 * Custom NodeHelper implementation
 */
const mm2Helper: MM2Helper = {
  start: function () {
    this.started = false;
  },

  socketNotificationReceived: function (notification: string, payload: object) {
    if (notification === NOTIF_SET_CONFIG && !this.started) {
      this.config = payload;
      this.started = true;

      InstanceStore.setConfiguration(this.config);

      // Calling inherited method
      if (this.sendSocketNotification) {
        this.sendSocketNotification(NOTIF_INIT);
      }

      startProcessing(this);
    }
  },

  stop: async function (): Promise<void> {
    // Stops heartbeat
    clearInterval(this.heartbeatTimerId);

    // Saving data store before exiting
    await InstanceStore.getInstance().persist();
  },
};

module.exports = mm2Helper;
