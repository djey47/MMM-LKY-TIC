// Must be located BEFORE the imports
const mockFormatDate = jest.fn((ts: number, format: string) => `${format}(${ts})`);
const mockUseWithNotifications = jest.fn();

import React from 'react';
import renderer from 'react-test-renderer';
import Teleinfo, { type NotificationData } from '.';
import type { QuickStatusProps } from '../QuickStatus/QuickStatus';
import type { InfoCarouselProps } from '../molecules/InfoCarousel';

jest.mock('date-fns/format', () => mockFormatDate);

const mockUseContext = jest.spyOn(React, 'useContext');

jest.mock('../../hooks/with-notifications/with-notifications', () => mockUseWithNotifications);

jest.mock('../QuickStatus', () => (props: QuickStatusProps) => <div {...props}>QuickStatus component</div>);

jest.mock('../molecules/InfoCarousel', () => (props: InfoCarouselProps) => <div {...props}>InfoCarousel component</div>);

describe('Teleinfo component', () => {
  const defaultProps = {};
  const fullNotifData: NotificationData = {
    data_TELEINFO: {
      meta: {
        firstDataTimestamp: 1674565891995,
        lastUpdateTimestamp: 1674818126026,
        unresolvedGroups: {},
      },
      apparentPower: 250,
      chosenFareOption: 'BASE',
      estimatedPower: 225,
      estimatedPrices:{
        currentDay: 5.567,
        currentMonth: 55,
        currentYear: 475,
        total: 500
      },
      instantIntensity: 1,
      statistics: {
        instantIntensity: {},
        instantPower: {},
      },
      suppliedPower: {
        currentDay: [1, 2],
        currentMonth: [10, 20],
        currentYear: [90, 150],
        total: [100, 200],
      },
    },
    data_TELEINFO_HEARTBEAT: {
      ts: 1674818126028
    },
  };

  beforeEach(() => {
    jest.resetAllMocks
    mockUseContext.mockReturnValue({
      currencySymbol: '€',
    });
  });

  it('should render correctly without notif data', () => {
    // given
    mockUseWithNotifications.mockReturnValue({});

    // when
    const tree = renderer.create(<Teleinfo {...defaultProps} />).toJSON();

    // then
    expect(tree).toMatchSnapshot();
    expect(mockUseWithNotifications).toHaveBeenCalledWith(['TELEINFO', 'TELEINFO_HEARTBEAT']);
  });

  it('should render correctly with notif data', () => {
    // given
    mockUseWithNotifications.mockReturnValue(fullNotifData)

    // when
    const tree = renderer
      .create(<Teleinfo {...defaultProps} />)
      .toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });
});
