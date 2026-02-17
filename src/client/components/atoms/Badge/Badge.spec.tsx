import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import Badge, { type BadgeProps } from './Badge';

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

  it('should render correctly with active prop', () => {
    // given-when
    const tree = renderer.create(<Badge {...defaultProps} active />).toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with onClick prop', () => {
    // given-when
    const tree = renderer.create(<Badge {...defaultProps} onClick={jest.fn()} />).toJSON();

    // then
    expect(tree).toMatchSnapshot();
  });

  describe('user interaction', () => {
    const onClickMock = jest.fn();
    const propsWithClickHandler: BadgeProps = {
      ...defaultProps,
      onClick: onClickMock,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call onClick when span is clicked', () => {
      // given
      const { getByText } = render(<Badge {...propsWithClickHandler} />);
      const spanItem = getByText('text');

      // when
      fireEvent.click(spanItem);

      // then
      expect(onClickMock).toHaveBeenCalled();
    });

    it('should call onClick when Enter key is pressed', () => {
      // given
      const { getByText } = render(<Badge {...propsWithClickHandler} />);
      const spanItem = getByText('text');

      // when
      fireEvent.keyDown(spanItem, { key: 'Enter' });

      // then
      expect(onClickMock).toHaveBeenCalled();
    });
  });
});
