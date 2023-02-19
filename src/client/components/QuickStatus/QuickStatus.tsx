import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { faBoltLightning, faLeaf, faPlugCircleBolt, faPlugCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import timeDifferenceInSeconds from 'date-fns/differenceInSeconds';
import { FunctionComponent } from 'react';
import { TeleInfo } from '../../../shared/domain/teleinfo';

import './QuickStatus.scss';

export interface QuickStatusProps {
  data?: TeleInfo;
  hearbeatTs?: number;
}

/**
 * Teleinfo quick status bar
 */
const QuickStatus: FunctionComponent<QuickStatusProps> = (props: QuickStatusProps) => {
  function renderItems() {
    return (
      <>
        <li key="qs-link" className="quick-status__link-item">
          {renderLinkItem()}
        </li>
        <li key="qs-supply" className="quick-status__supply-item">
          {renderSupplyItem()}
        </li>
      </>
    );
  }

  function renderLinkItem() {
    const options = {
      color: 'red',
      icon: faPlugCircleExclamation,
      isCritical: false,
    };

    if(props.data) {
      const lastReceivedTime = props.data.meta?.lastUpdateTimestamp || 0;
      const heartbeatTime = props.hearbeatTs || 0;
      const idleDuration = timeDifferenceInSeconds(heartbeatTime, lastReceivedTime);
      
      if (idleDuration > 30) {
        options.color = 'red';
        options.icon = faPlugCircleExclamation;
        options.isCritical = true;
      } else if (idleDuration > 10) {
        options.color = 'orange';
        options.icon = faPlugCircleExclamation;
      } else if (idleDuration > 5) {
        options.color = 'yellow';
        options.icon = faPlugCircleExclamation;
      } else {
        options.color = 'green';
        options.icon = faPlugCircleBolt;  
      }
   }

    const itemClassName = classNames('quick-status__link-picto', {
      'not-connected': options.isCritical,
    });
    return (
      <>
        <FontAwesomeIcon className={itemClassName} color={options.color} icon={options.icon} />
      </>
    );
  }

  function renderSupplyItem() {
    const options = {
      color: 'white',
      icon: faCircleQuestion,
      isCritical: false,
    };

    const instantIntensity = props.data?.instantIntensity || 0;
    const maxIntensity = props.data?.subscribedIntensity || Number.POSITIVE_INFINITY;

    if (props.data?.subscribedPowerOverflowWarning) {
      options.color = 'red';
      options.icon = faBoltLightning;
      options.isCritical = true;
    } else if (instantIntensity > maxIntensity * 5 / 6) {
      options.color = 'red';
      options.icon = faBoltLightning;
    } else if (instantIntensity > maxIntensity * 2 / 3) {
      options.color = 'orange';
      options.icon = faBoltLightning;
    } else if (instantIntensity > maxIntensity / 3) {
      options.color = 'yellow';
      options.icon = faBoltLightning;
    } else if (props.data) {
      options.color = 'green';
      options.icon = faLeaf;
    }

    const itemClassName = classNames('quick-status__supply-picto', { 'supply-critical': options.isCritical });
    return (
      <>
        <FontAwesomeIcon className={itemClassName} color={options.color} icon={options.icon} />
      </>
    );
  }

  return (
    <div className="quick-status">
      <ul className="quick-status__items">
        {renderItems()}
      </ul>
    </div>
  )
};

export default QuickStatus;
