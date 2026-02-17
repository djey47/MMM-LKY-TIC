import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SummarySection from './SummarySection';
import ConfigurationContext from '../../../contexts/ConfigurationContext';
import type { TeleInfo } from '../../../../shared/domain/teleinfo';
import { InfoSectionCommonProps } from '../../../types/client';

jest.mock('../../../shared/displayHelper', () => ({
  computeWholeSuppliedPower: jest.fn(() => '100'),
  displayPriceWithTwoDecimals: jest.fn(() => '1.23'),
}));

const sampleData: TeleInfo = {
  apparentPower: 1000,
  estimatedPower: 900,
  instantIntensity: 10,
  subscribedPowerOverflowWarning: 2,
  estimatedPrices: { currentDay: 1.23 },
  statistics: {}
};

describe('SummarySection component', () => {
  const CONFIG = { currencySymbol: '€' };

  const renderWithContext = (props: InfoSectionCommonProps) => {
    return render(
      <ConfigurationContext.Provider value={CONFIG}>
        <SummarySection {...props} />
      </ConfigurationContext.Provider>
    );
  };

  it('renders the component when data is provided', () => {
    // given-when
    const {container} = renderWithContext({ data: sampleData });
    
    // then
    const section = container.querySelector('section.summary-section');
    expect(section).toBeInTheDocument();
  });

  it('renders power information', () => {
    // given-when
    renderWithContext({ data: sampleData });

    // then
    expect(screen.getByText(/1000/)).toBeInTheDocument();
    expect(screen.getByText(/^VA$/)).toBeInTheDocument();
    expect(screen.getByText(/900/)).toBeInTheDocument();
    expect(screen.getByText(/^W$/)).toBeInTheDocument();
  });

  it('renders intensity information with warning if provided', () => {
    // given-when
    renderWithContext({ data: sampleData });

    // then
    expect(screen.getByText(/Intensity:/)).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('renders costs section correctly', () => {
    // given-when
    renderWithContext({ data: sampleData });

    // then
    expect(screen.getByText(/Costs/)).toBeInTheDocument();
    expect(screen.getByText('~1.23')).toBeInTheDocument();
    expect(screen.getByText('€')).toBeInTheDocument();
  });

  it('renders supplied section correctly', () => {
    // given-when
    renderWithContext({ data: sampleData });

    // then
    expect(screen.getByText(/Supplied \(today\):/)).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText(/Wh/)).toBeInTheDocument();
  });

  it('does not render anything if no data is provided', () => {
    // given-when
    const { container } = renderWithContext({});

    // then
    expect(container.firstChild).toBeNull();
  });
});
