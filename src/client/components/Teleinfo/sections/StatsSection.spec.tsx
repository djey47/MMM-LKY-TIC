import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import StatsSection from './StatsSection';
import type { InfoSectionCommonProps } from '../../../types/client';
import type { TeleInfo } from '../../../../shared/domain/teleinfo';

describe('StatsSection component', () => {
  it('should render correctly with data', () => {
    // given
    const data: TeleInfo = {
      statistics: {
        instantEstimatedPower: {
          currentDay: { min: 100, max: 200, average: 150 },
          currentMonth: { min: 50, max: 250, average: 175 },
          currentYear: { min: 40, max: 260, average: 200 },
          overall: { min: 30, max: 270, average: 210 },
        },
        instantIntensity: {
          currentDay: { min: 1, max: 10, average: 5 },
          currentMonth: { min: 0, max: 15, average: 6 },
          currentYear: { min: .1, max: 20, average: 7 },
          overall: { min: .2, max: 17, average: 8 },
        },
      },
      suppliedPower: {
        currentDay: [1000, 2000],
        currentMonth: [30000, 40000],
        currentYear: [500000, 600000],
        overall: [7000000, 8000000],
      },
      estimatedPrices: {
        currentDay: 1,
        currentMonth: 15,
        currentYear: 250,
        total: 500,
      },
      chosenFareOption: 'HC',
    };
    const props: InfoSectionCommonProps = {
      data,
    };

    // when
   const {queryByText} = render(<StatsSection {...props} />);

    // then
    expect(queryByText('Statistics')).toBeInTheDocument();
    expect(queryByText('pwr (est.)')).toBeInTheDocument();
    expect(queryByText('intensity')).toBeInTheDocument();
    expect(queryByText('First-last data:')).toBeInTheDocument();
  });

  it('should not render anything if no data is provided', () => {
    // given
    const props = {
      data: undefined,
    };

    // when
    const {queryByText} = render(<StatsSection {...props} />);

    // then
    expect(queryByText('Statistics')).not.toBeInTheDocument();
  });
});
