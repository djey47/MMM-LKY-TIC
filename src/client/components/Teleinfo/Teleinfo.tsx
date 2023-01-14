import { FunctionComponent } from 'react';
import { withNotifications } from '../../hoc/with-notifications';
import { TeleInfo } from '../../../shared/domain/teleinfo';

import './Teleinfo.scss';

export interface WithNotificationDataProps {
  data_TELEINFO?: TeleInfo;
}

const Teleinfo: FunctionComponent<WithNotificationDataProps> = (
  props: WithNotificationDataProps
) => {
  const { data_TELEINFO } = props;
  console.log({ data_TELEINFO });
  return (
    <div className="teleinfo">
      {!!data_TELEINFO && (
        <>
          <p className="teleinfo__power">
            <span className="teleinfo__powerLabel">Instant power:</span>
            <span className="teleinfo__powerValue">{data_TELEINFO.apparentPower}</span>
            <span className="teleinfo__powerUnit">VA</span> 
          </p>
          <p className="teleinfo__instant">
            <span className="teleinfo__instantLabel">Instant intensity:</span>
            <span className="teleinfo__instantValue">{data_TELEINFO.instantIntensity}</span>
            <span className="teleinfo__instantUnit">A</span> 
          </p>
        </>
      )}
    </div>
  );
};

export default withNotifications(Teleinfo, ['TELEINFO']);
