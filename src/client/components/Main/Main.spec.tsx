import renderer from 'react-test-renderer';
import ConfigurationContext from '../../contexts/ConfigurationContext';
import Main from './Main';

jest.mock('../Teleinfo/Teleinfo', () => (props: object) => (
  <div {...props}>Teleinfo component</div>
));

describe('Main component', () => {
  it('should render correctly with default props', () => {
    const tree = renderer.create(<Main />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with custom configuration', () => {
    const tree = renderer
      .create(
        <ConfigurationContext.Provider value={{ currencySymbol: 'S' }}>
          <Main />
        </ConfigurationContext.Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
