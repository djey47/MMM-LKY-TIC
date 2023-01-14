// Must be located BEFORE the imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockWithNotifications = jest.fn((c, s) => c);

import renderer from 'react-test-renderer';
import Teleinfo, { WithNotificationDataProps } from './Teleinfo';

jest.mock('../../hoc/with-notifications', () => ({
  withNotifications: mockWithNotifications,
}));

describe('Teleinfo component', () => {
  it('should render correctly without notif data', () => {
    // given-when
    const tree = renderer.create(<Teleinfo />).toJSON();

    // then
    expect(tree).toMatchSnapshot();
    expect(mockWithNotifications).toHaveBeenCalled();
    expect(mockWithNotifications.mock.calls[0][1]).toEqual(['TELEINFO']);
  });

  it('should render correctly with notif data', () => {
    // given
    const props: WithNotificationDataProps = {
      data_TELEINFO: {
        meta: {
          unresolvedGroups: {},
        },
        apparentPower: '000250',
        instantIntensity: '01',
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
