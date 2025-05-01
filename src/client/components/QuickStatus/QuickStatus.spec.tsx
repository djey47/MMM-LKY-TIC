import renderer from 'react-test-renderer';
import { BadgeProps } from '../atoms/Badge/Badge';
import QuickStatus, { QuickStatusProps } from '../QuickStatus/QuickStatus';

jest.mock('../atoms/Badge/Badge', () => (props: BadgeProps) => <span {...props}>Badge atom component</span>);

describe('QuickStatus component', () => {
  const defaultProps: QuickStatusProps = {
    hearbeatTs: 1674818126026, // +0s
  };
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
      currentFarePeriod: 'BASE',
      estimatedPower: 225,
      estimatedPrices:{
        currentDay: 5.5,
        currentMonth: 55,
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
        total: [100, 200],
      },
    },
  };

  it('should render correctly without data', () => {
    // given
    const propsWithDelayedData: QuickStatusProps = {
      ...defaultProps,
    };

    // when
    const tree = renderer.create(<QuickStatus {...propsWithDelayedData} />).toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });  
  
  it('should render correctly with data: no teleinfo data after more than 30 seconds', () => {
    // given
    const propsWithDelayedData: QuickStatusProps = {
      ...propsWithData,
      hearbeatTs: 1674818158056, // +32s
    };

    // when
    const tree = renderer.create(<QuickStatus {...propsWithDelayedData} />).toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with data: no teleinfo data after more than 10 seconds', () => {
    // given
    const propsWithDelayedData: QuickStatusProps = {
      ...propsWithData,
      hearbeatTs: 1674818137057, // +11s
    };

    // when
    const tree = renderer.create(<QuickStatus {...propsWithDelayedData} />).toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with data: no teleinfo data after more than 5 seconds', () => {
    // given
    const propsWithDelayedData: QuickStatusProps = {
      ...propsWithData,
      hearbeatTs: 1674818132026, // +6s
    };

    // when
    const tree = renderer.create(<QuickStatus {...propsWithDelayedData} />).toJSON();

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

  it('should render correctly with data and power overuse of 2A', () => {
    // given
    const propsWithPowerOveruseData: QuickStatusProps = {
      ...propsWithData,
      data: {
        ...propsWithData.data,
        statistics: {
          ...propsWithData.data?.statistics,
        },
        subscribedPowerOverflowWarning: 2,
      },
    };

    // when
    const tree = renderer
      .create(<QuickStatus {...propsWithPowerOveruseData} />)
      .toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with data and intensity more than 5/6 of maximum', () => {
    // given
    const propsWithIntensityData: QuickStatusProps = {
      ...propsWithData,
      data: {
        ...propsWithData.data,
        instantIntensity: 5.5,
        subscribedIntensity: 6,
        statistics: {},
      },
    };

    // when
    const tree = renderer
      .create(<QuickStatus {...propsWithIntensityData} />)
      .toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with data and intensity more than 2/3 of maximum', () => {
    // given
    const propsWithIntensityData: QuickStatusProps = {
      ...propsWithData,
      data: {
        ...propsWithData.data,
        instantIntensity: 2.5,
        subscribedIntensity: 3,
        statistics: {},
      },
    };

    // when
    const tree = renderer
      .create(<QuickStatus {...propsWithIntensityData} />)
      .toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with data and intensity more than 1/3 of maximum', () => {
    // given
    const propsWithIntensityData: QuickStatusProps = {
      ...propsWithData,
      data: {
        ...propsWithData.data,
        instantIntensity: 1.5,
        subscribedIntensity: 3,
        statistics: {},
      },
    };

    // when
    const tree = renderer
      .create(<QuickStatus {...propsWithIntensityData} />)
      .toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });
});
