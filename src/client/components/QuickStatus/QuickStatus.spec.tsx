import renderer from 'react-test-renderer';
import QuickStatus, { QuickStatusProps } from '../QuickStatus/QuickStatus';

describe('QuickStatus component', () => {
  const defaultProps: QuickStatusProps = {};
  const propsWithData: QuickStatusProps = {
    ...defaultProps,
    data: {
      ...defaultProps.data,
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

  it('should render correctly without data: no teleinfo data after more than 30 seconds', () => {
    // given-when
    const tree = renderer.create(<QuickStatus {...defaultProps} />).toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with data', () => {
    // given-when
    const tree = renderer
      .create(<QuickStatus {...propsWithData} />)
      .toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });
});
