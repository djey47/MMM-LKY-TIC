import { useContext } from 'react';
import ConfigurationContext from '../../contexts/ConfigurationContext';
import useWithNotifications from '../../hooks/with-notifications/with-notifications';
import QuickStatus from '../QuickStatus/QuickStatus';
import { InfoCarousel } from '../molecules/InfoCarousel';
import type { TeleInfo, TeleInfoHeartbeat } from '../../../shared/domain/teleinfo';
import './Teleinfo.scss';

export interface NotificationData {
  data_TELEINFO?: TeleInfo;
  data_TELEINFO_HEARTBEAT?: TeleInfoHeartbeat;
}

const Teleinfo = () => {
  const configuration = useContext(ConfigurationContext);
  const { data_TELEINFO, data_TELEINFO_HEARTBEAT } = useWithNotifications(['TELEINFO', 'TELEINFO_HEARTBEAT']) as NotificationData;

  const { debug } = configuration || {};
  if (debug) {
    Log.log(JSON.stringify({ data_TELEINFO }, null, 2));
  }

  return (
    <div className="teleinfo">
      <section className="teleinfo__quick-status">
        <QuickStatus data={data_TELEINFO} hearbeatTs={data_TELEINFO_HEARTBEAT?.ts} />
      </section>
      {!data_TELEINFO && (
        <p className="teleinfo__no-data">No data received yet.</p>
      )}
      {!!data_TELEINFO && (
        <InfoCarousel data={data_TELEINFO} />
      )}
    </div>
  );
};

export default Teleinfo;
