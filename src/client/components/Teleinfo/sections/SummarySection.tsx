import clsx from 'clsx';
import { useContext } from 'react';
import { computeWholeSuppliedPower, displayPriceWithTwoDecimals } from '../../../shared/displayHelper';
import ConfigurationContext from '../../../contexts/ConfigurationContext';
import type { InfoSectionCommonProps } from '../../../types/client';
import './SummarySection.scss';

const SummarySection = ({ data }: InfoSectionCommonProps) => {
  const configuration = useContext(ConfigurationContext);

  if (!data) {
    return null;
  }

  const { currencySymbol } = configuration || {};

  const renderPower = () => {
    return (
      <>
        <p className="summary-section__power">
          <span className="summary-section__power-value">
            {data.apparentPower}
          </span>
          <span className="summary-section__power-unit">VA</span>
          <span className="summary-section__power-value">
            ~
            {data.estimatedPower}
          </span>
          <span className="summary-section__power-unit">W</span>
        </p>
      </>
    );
  };

  const renderIntensity = () => {
    const isSubscribedPowerOverflowWarning = data.subscribedPowerOverflowWarning !== undefined;

    const intensityClassName = clsx(
      'summary-section__intensity',
      { 'with-overflow': isSubscribedPowerOverflowWarning }
    );

    return (
      <>
        <p className={intensityClassName}>
          <span className="summary-section__intensity-label">Intensity:</span>
          <span className="summary-section__intensity-value">
            {data.instantIntensity}
          </span>
          <span className="summary-section__intensity-unit">A</span>
          {isSubscribedPowerOverflowWarning && (
            <>
              <span className="summary-section__over-intensity-label">(</span>
              <span className="summary-section__over-intensity-value">
                +{data.subscribedPowerOverflowWarning}
              </span>
              <span className="summary-section__over-intensity-unit">A</span>
              <span className="summary-section__over-intensity-label">)</span>
            </>
          )}


        </p>
      </>
    );
  };

  const renderCostsToday = () => {
    return (
      <section className="summary-section__costs-section">
        <p className="summary-section__costs">
          <span className="summary-section__costs-label">
            Costs (today, est.):
          </span>
          <span className="summary-section__costs-value">
            ~{displayPriceWithTwoDecimals(data.estimatedPrices?.currentDay)}
          </span>
          <span className="summary-section__costs-unit">
            {currencySymbol}
          </span>
        </p>
      </section>
    );
  };

  const renderSuppliedToday = () => {
    return (
      <section className="summary-section__supplied-section">
        <p className="summary-section__suppplied">
          <span className="summary-section__supplied-label">
            Supplied (today):
          </span>
          <span className="summary-section__supplied-value">
            {computeWholeSuppliedPower('currentDay', data)}
          </span>
          <span className="teleinfo__supplied-unit">Wh</span>
        </p>
      </section>
    );
  };

  return (
    <section className="summary-section">
      {renderPower()}
      {renderIntensity()}
      {renderCostsToday()}
      {renderSuppliedToday()}
    </section>
  );
};

export default SummarySection;
