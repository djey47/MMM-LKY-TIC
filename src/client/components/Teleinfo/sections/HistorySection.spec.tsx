import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import HistorySection from './HistorySection';
import type { TeleInfo } from '../../../../shared/domain/teleinfo';

describe('HistorySection', () => {
  const defaultData: TeleInfo = {
    statistics: {},
  };

  it('should render without crashing', () => {
    const { container } = render(<HistorySection data={defaultData} />);
    expect(container).toBeInTheDocument();
  });
});
