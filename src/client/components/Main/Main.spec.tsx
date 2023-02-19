import renderer from 'react-test-renderer';
import Main from './Main';

jest.mock('../Teleinfo/Teleinfo', () => (props: object) => (
  <div {...props}>Teleinfo component</div>
));

describe('Main component', () => {
  it('should render correctly with default props', () => {
    const tree = renderer.create(<Main />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
