// Must be located BEFORE the imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockWithNotifications = jest.fn((c, s) => c);

import renderer from 'react-test-renderer';
import Teleinfo, { WithNotificationDataProps } from './Teleinfo';

jest.mock('../../hoc/with-notifications', () => ({
  withNotifications: mockWithNotifications,
}));

describe('Teleinfo component', () => {
  const defaultProps = {
    currencySymbol: '€',
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
    // given
    const props: WithNotificationDataProps = {
      ...defaultProps,
      data_TELEINFO: {
        meta: {
          unresolvedGroups: {},
        },
        apparentPower: 250,
        estimatedPower: 225,
        estimatedPrice: 55,
        instantIntensity: 1,
      }
    };

    // when
    const tree = renderer
      .create(<Teleinfo {...props} />)
      .toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });
});
