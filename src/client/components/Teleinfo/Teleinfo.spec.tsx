// Must be located BEFORE the imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockWithNotifications = jest.fn((c, s) => c);

import renderer from 'react-test-renderer';
import Teleinfo, { WithNotificationDataProps } from './Teleinfo';

jest.mock('../../hoc/with-notifications', () => ({
  withNotifications: mockWithNotifications,
}));

describe('Teleinfo component', () => {
  const defaultProps: WithNotificationDataProps = {
    currencySymbol: '€',
  };
  const propsWithFullNotifData: WithNotificationDataProps = {
    ...defaultProps,
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
        currentDay: 5.5,
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
  };

  it('should render correctly without notif data', () => {
    // given-when
    const tree = renderer.create(<Teleinfo {...defaultProps} />).toJSON();

    // then
    expect(tree).toMatchSnapshot();
    expect(mockWithNotifications).toHaveBeenCalled();
    expect(mockWithNotifications.mock.calls[0][1]).toEqual(['TELEINFO']);
  });

  it('should render correctly with notif data', () => {
    // given-when
    const tree = renderer
      .create(<Teleinfo {...propsWithFullNotifData} />)
      .toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with notif data but without supplied power information', () => {
    // given
    const props: WithNotificationDataProps = {
      ...propsWithFullNotifData,
      data_TELEINFO: {
        ...propsWithFullNotifData.data_TELEINFO,
        suppliedPower: {},
      },
    };

    // when
    const tree = renderer.create(<Teleinfo {...props} />).toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });
});
