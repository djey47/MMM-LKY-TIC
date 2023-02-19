// Must be located BEFORE the imports
const mockFormatDate = jest.fn((ts: number, format: string) => `${format}(${ts})`);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockUseWithNotifications = jest.fn();

import renderer from 'react-test-renderer';
import { QuickStatusProps } from '../QuickStatus/QuickStatus';
import Teleinfo, { NotificationData, TeleinfoProps } from './Teleinfo';

jest.mock('date-fns/format', () => mockFormatDate);

jest.mock('../../hooks/with-notifications/with-notifications', () => mockUseWithNotifications);

jest.mock('../QuickStatus/QuickStatus', () => (props: QuickStatusProps) => <div {...props}>QuickStatus component</div>);

describe('Teleinfo component', () => {
  const defaultProps: TeleinfoProps = {
    currencySymbol: '€',
  };
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
        total: 500
      },
      instantIntensity: 1,
      suppliedPower: {
        currentDay: [1, 2],
        currentMonth: [10, 20],
        total: [100, 200],
      },
    },
    data_TELEINFO_HEARTBEAT: {
      ts: 1674818126028
    },
  };

  beforeEach(() => {
    mockUseWithNotifications.mockReset();
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

  it('should render correctly with notif data and power overuse', () => {
    // given
    const dataWithPowerOveruse: NotificationData = {
      ...fullNotifData,
      data_TELEINFO: {
        ...fullNotifData.data_TELEINFO,
        subscribedPowerOverflowWarning: 1,
      },
    };
    mockUseWithNotifications.mockReturnValue(dataWithPowerOveruse)

    // when
    const tree = renderer
      .create(<Teleinfo {...defaultProps} />)
      .toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with notif data but without supplied power information', () => {
    // given
    const dataWithoutSuppliedPowerInfo: NotificationData = {
      ...fullNotifData,
      data_TELEINFO: {
        ...fullNotifData.data_TELEINFO,
        suppliedPower: {},
      },
    };
    mockUseWithNotifications.mockReturnValue(dataWithoutSuppliedPowerInfo)

    // when
    const tree = renderer.create(<Teleinfo {...defaultProps} />).toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });
});
