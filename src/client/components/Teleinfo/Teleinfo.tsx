import classNames from 'classnames';
import { FunctionComponent, useContext } from 'react';
import { TeleInfo, TeleInfoHeartbeat } from '../../../shared/domain/teleinfo';
import ConfigurationContext from '../../contexts/ConfigurationContext';
import useWithNotifications from '../../hooks/with-notifications/with-notifications';
import { displayDate, displayPriceWithTwoDecimals, getPeriodLabel } from '../../shared/displayHelper';
import QuickStatus from '../QuickStatus/QuickStatus';

import './Teleinfo.scss';

export interface NotificationData {
  data_TELEINFO?: TeleInfo;
  data_TELEINFO_HEARTBEAT?: TeleInfoHeartbeat;
}

const Teleinfo: FunctionComponent<Record<string, never>> = () => {
  const configuration = useContext(ConfigurationContext);
  const {data_TELEINFO, data_TELEINFO_HEARTBEAT} = useWithNotifications(['TELEINFO', 'TELEINFO_HEARTBEAT']) as NotificationData;

  function computeWholeSuppliedPower(categoryKey: string) {
    if (!data_TELEINFO) {
      return undefined;
    }

    const { suppliedPower } = data_TELEINFO;
    if (!suppliedPower) {
      return undefined;
    }

    const suppliedPowers = suppliedPower[categoryKey] as number[];
    if (!suppliedPowers) {
      return undefined;
    }

    return suppliedPowers.reduce((sum, current) => {
      return sum + current;
    }, 0);
  }

  function renderPower() {
    if (!data_TELEINFO) {
      return undefined;
    }
    
    return (
      <>
        <p className="teleinfo__power">
          <span className="teleinfo__power-value">
            {data_TELEINFO.apparentPower}
          </span>
          <span className="teleinfo__power-unit">VA</span>
          <span className="teleinfo__power-value">
            ~
            {data_TELEINFO.estimatedPower}
          </span>
          <span className="teleinfo__power-unit">W</span>
        </p>
        <p className="teleinfo__power-stats">
          {renderPowerStats('min', 'Min (today/month/overall):')}
          {renderPowerStats('max', 'Max:')}
        </p>
      </>
    );
  }

  function renderPowerStats(statItemKey: string, label: string) {
    if (!data_TELEINFO) {
      return undefined;
    }
  
    return (
      <p className="teleinfo__power-stats-group">
        <span className="teleinfo__power-stats-label">{label}</span>
        <span className="teleinfo__power-stats-value">
          {(data_TELEINFO.statistics.instantPower?.currentDay && data_TELEINFO.statistics.instantPower?.currentDay[statItemKey]) || '...'} 
        </span>
        /
        <span className="teleinfo__power-stats-value">
          {(data_TELEINFO.statistics.instantPower?.currentMonth && data_TELEINFO.statistics.instantPower?.currentMonth[statItemKey]) || '...'} 
        </span>
        /
        <span className="teleinfo__power-stats-value">
          {(data_TELEINFO.statistics.instantPower?.overall && data_TELEINFO.statistics.instantPower?.overall[statItemKey]) || '...'} 
        </span>
        <span className="teleinfo__power-stats-unit">VA</span>
      </p>);
  }

  function renderIntensity() {
    if(!data_TELEINFO) {
      return undefined;
    }

    const isSubscribedPowerOverflowWarning = data_TELEINFO.subscribedPowerOverflowWarning !== undefined;

    const intensityClassName = classNames(
      'teleinfo__intensity',
      { 'with-overflow': isSubscribedPowerOverflowWarning } 
    );

    return (
      <>
        <p className={intensityClassName}>
          <span className="teleinfo__intensity-label">Intensity:</span>
          <span className="teleinfo__intensity-value">
            {data_TELEINFO.instantIntensity}
          </span>
          <span className="teleinfo__intensity-unit">A</span>
        </p>
        { isSubscribedPowerOverflowWarning && (
          <p className="teleinfo__over-intensity">
            <span className="teleinfo__over-intensity-label">Overuse:</span>
            <span className="teleinfo__over-intensity-value">
              {data_TELEINFO.subscribedPowerOverflowWarning}
            </span>
            <span className="teleinfo__over-intensity-unit">A</span>
          </p>
        )}
      </>
    );
  }

  function renderSupplied() {
    return (
      <>
        <p className="teleinfo__supplied">
          <span className="teleinfo__supplied-label">
            Supplied (today/month/total):
          </span>
          {renderSuppliedValue('currentDay')}
          /
          {renderSuppliedValue('currentMonth')}
          /
          {renderSuppliedValue('total')}
          <span className="teleinfo__supplied-unit">Wh</span>
        </p>
        <p className="teleinfo__supplied-detail">
          {renderSuppliedDetails()}
        </p>
      </>
    );
  }

  function renderSuppliedValue(period: string) {
    const wholeSuppliedPower = computeWholeSuppliedPower(period);
    return (
      <span className="teleinfo__supplied-value">
        {wholeSuppliedPower || '...'}
      </span>
    );
  }

  function renderSuppliedDetails() {
    if (!data_TELEINFO) {
      return undefined;
    }

    return (
      <ul className="teleinfo__supplied-detail-items">
        {data_TELEINFO.suppliedPower?.currentDay?.map((pw, rank) => {
          const periodLabel = getPeriodLabel(data_TELEINFO.chosenFareOption, rank);
          return (
            <li
              className="teleinfo__supplied-detail-item"
              key={`supplied-option-${rank}`}
            >
              <span className="teleinfo__supplied-label">{periodLabel}:</span>
              <span className="teleinfo__supplied-value">{pw || '...'}</span>
              /
              <span className="teleinfo__supplied-value">
                {(data_TELEINFO.suppliedPower?.currentMonth &&
                  data_TELEINFO.suppliedPower?.currentMonth[rank]) ||
                  '...'}
              </span>
              /
              <span className="teleinfo__supplied-value">
                {(data_TELEINFO.suppliedPower?.total &&
                  data_TELEINFO.suppliedPower?.total[rank]) ||
                  '...'}
              </span>
              <span className="teleinfo__supplied-unit">Wh</span>
            </li>
          );
        })}
      </ul>
    );
  }

  function renderCostsDetails() {
    if (!data_TELEINFO) {
      return undefined;
    }

    return <ul className="teleinfo__costs-detail-items"></ul>;
  }

  const { currencySymbol, debug } = configuration || {};
  if (debug) {
    Log.log(JSON.stringify({ data_TELEINFO }, null, 2));
  }

  const firstReceivedDataDate = displayDate(
    data_TELEINFO?.meta?.firstDataTimestamp
  );
  const lastReceivedDataDate = displayDate(
    data_TELEINFO?.meta?.lastUpdateTimestamp
  );

  return (
    <div className="teleinfo">
      <section className="teleinfo__quick-status">
        <QuickStatus data={data_TELEINFO} hearbeatTs={data_TELEINFO_HEARTBEAT?.ts}/>
      </section>
      {!data_TELEINFO && (
        <p className="teleinfo__no-data">No data received yet.</p>
      )}
      {!!data_TELEINFO && (
        <>
          <section className="teleinfo__instant-section">
            {renderPower()}
            {renderIntensity()}
            {renderSupplied()}
          </section>
          <section className="teleinfo__costs-section">
            <p className="teleinfo__costs">
              <span className="teleinfo__costs-label">
                Costs (today/month/total):
              </span>
              <span className="teleinfo__costs-value">
                ~{displayPriceWithTwoDecimals(data_TELEINFO.estimatedPrices?.currentDay)}
              </span>
              /
              <span className="teleinfo__costs-value">
                {data_TELEINFO.estimatedPrices?.currentMonth || '...'}
              </span>
              /
              <span className="teleinfo__costs-value">
                {data_TELEINFO.estimatedPrices?.total || '...'}
              </span>
              <span className="teleinfo__costs-unit">
                {currencySymbol}
              </span>
            </p>
            <p className="teleinfo__costs-detail">{renderCostsDetails()}</p>
          </section>
          <section className="teleinfo__dates-section">
            <p className="teleinfo__dates-start-last">
              <span className="teleinfo__dates-start-last-label">First-last data:</span>
              <span className="teleinfo__dates-start-last-value">
                {firstReceivedDataDate}&nbsp;-&nbsp;{lastReceivedDataDate}
              </span>
            </p>
          </section>
        </>
      )}
    </div>
  );
};

export default Teleinfo;
