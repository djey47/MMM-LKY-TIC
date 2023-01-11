import { ComponentType } from 'react';
import { withNotifications } from '../../hoc/with-notifications';

interface OwnProps {
  prop1: string;
}

interface WithNotificationDataProps extends OwnProps {
  data_TELEINFO?: object;
}

const SubscribedSample: ComponentType<WithNotificationDataProps> = (
  props: WithNotificationDataProps
) => {
  return (
    <div className="subscribed">
      <p className="subscribed__text">Subscribed component to 'TELEINFO' event</p>
      <p className="subscribed__value">
        Last received value: {JSON.stringify(props.data_TELEINFO)}
      </p>
    </div>
  );
};

export default withNotifications(SubscribedSample, ['TELEINFO']);
