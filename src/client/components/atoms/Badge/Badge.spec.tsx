import renderer from 'react-test-renderer';
import Badge, { BadgeProps } from './Badge';

describe('Badge atom component', () => {
  const defaultProps: BadgeProps = {
    text: 'text',
  };

  it('should render correctly', () => {
    // given-when
    const tree = renderer.create(<Badge {...defaultProps} />).toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });
});
