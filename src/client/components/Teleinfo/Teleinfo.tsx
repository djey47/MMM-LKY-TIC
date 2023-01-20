import { FunctionComponent } from 'react';
import { withNotifications } from '../../hoc/with-notifications';
import { TeleInfo } from '../../../shared/domain/teleinfo';

import './Teleinfo.scss';

export interface WithNotificationDataProps {
  currencySymbol: string;
  data_TELEINFO?: TeleInfo;
}

const Teleinfo: FunctionComponent<WithNotificationDataProps> = (
  props: WithNotificationDataProps
) => {
  const { currencySymbol, data_TELEINFO } = props;
  console.log({ data_TELEINFO });
  return (
    <div className="teleinfo">
      {!data_TELEINFO && (
        <p className="teleinfo__no-data">
          No data received yet.
        </p>
      )}
      {!!data_TELEINFO && (
        <>
          <section className="teleinfo__instant-section">
            <p className="teleinfo__power">
              <span className="teleinfo__power-label">Instant power:</span>
              <span className="teleinfo__power-value">{data_TELEINFO.apparentPower}</span>
              <span className="teleinfo__power-unit">VA</span>
              - 
              <span className="teleinfo__power-value">{data_TELEINFO.estimatedPower}</span>
              <span className="teleinfo__power-unit">W(est.)</span> 
            </p>
            <p className="teleinfo__intensity">
              <span className="teleinfo__intensity-label">Instant intensity:</span>
              <span className="teleinfo__intensity-value">{data_TELEINFO.instantIntensity}</span>
              <span className="teleinfo__intensity-unit">A</span> 
            </p>
          </section>
          <section className="teleinfo__costs-section">
            <p className="teleinfo__costs">
              <span className="teleinfo__costs-label">Costs (today/total):</span>
              <span className="teleinfo__costs-value">
                {data_TELEINFO.estimatedPrices?.currentDay || '...'}/{data_TELEINFO.estimatedPrices?.total || '...'}
              </span>
              <span className="teleinfo__costs-unit">{currencySymbol}(est.)</span> 
            </p>
          </section>
        </>
      )}
    </div>
  );
};

export default withNotifications(Teleinfo, ['TELEINFO']);
