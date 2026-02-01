import '@testing-library/jest-dom';
import { render, fireEvent, screen, act } from '@testing-library/react';
import InfoCarousel from './InfoCarousel';
import ConfigurationContext from '../../../contexts/ConfigurationContext';

jest.mock('../../Teleinfo/sections', () => ({
  SummarySection: () => <div data-testid="summary-section">SummarySection Content</div>,
  StatsSection: () => <div data-testid="stats-section">StatsSection Content</div>,
  HistorySection: () => <div data-testid="history-section">HistorySection Content</div>,
}));

describe('InfoCarousel component', () => {
  const configuration = { pageDurationMs: 5000 };

  const renderWithContext = (props = {}) => {
    return render(
      <ConfigurationContext.Provider value={configuration}>
        <InfoCarousel {...props} />
      </ConfigurationContext.Provider>
    );
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders the initial page and controls, sticking to page 1', () => {
    // given-when
    renderWithContext({ stickyIndex: 0, data: {} });
    
    // then
    expect(screen.getByTestId('summary-section')).toBeInTheDocument();
    expect(screen.queryByTestId('stats-section')).not.toBeInTheDocument();
    expect(screen.queryByTestId('history-section')).not.toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('switches page on badge click', () => {
    // given
    renderWithContext({ stickyIndex: 0, data: {} });

    // when: click on '2' badge to switch to stats section
    fireEvent.click(screen.getByText('2'));

    // then
    expect(screen.getByTestId('stats-section')).toBeInTheDocument();
    expect(screen.queryByTestId('summary-section')).not.toBeInTheDocument();
    expect(screen.queryByTestId('history-section')).not.toBeInTheDocument();
  });

  it('rotates pages automatically when stickyIndex is not provided', () => {
    // given
    renderWithContext({ data: {} });
    expect(screen.getByTestId('summary-section')).toBeInTheDocument();

    // when: timer advances to trigger the first rotation
    act(() => jest.advanceTimersByTime(configuration.pageDurationMs));
    expect(screen.getByTestId('stats-section')).toBeInTheDocument();

    // when: timer advances to trigger the second rotation
    act(() => jest.advanceTimersByTime(configuration.pageDurationMs));
    expect(screen.getByTestId('history-section')).toBeInTheDocument();

    // advances again to back to first page (full cycle)
    act(() => jest.advanceTimersByTime(configuration.pageDurationMs));

    // then
    expect(screen.getByTestId('summary-section')).toBeInTheDocument();
  });

  it('does not auto rotate if stickyIndex is provided', () => {
    // given
    renderWithContext({ stickyIndex: 1, data: {} });
    expect(screen.getByTestId('stats-section')).toBeInTheDocument();

    // when
    act(() => jest.advanceTimersByTime(configuration.pageDurationMs));

    // then
    expect(screen.getByTestId('stats-section')).toBeInTheDocument();
  });

  it('toggles lock state on lock click', () => {
    // given
    renderWithContext({ data: {} });
    expect(screen.getByTestId('summary-section')).toBeInTheDocument();

    // when: timer advances to trigger the first rotation
    act(() => jest.advanceTimersByTime(configuration.pageDurationMs));
    expect(screen.getByTestId('stats-section')).toBeInTheDocument();
    expect(screen.getByText('"className":"info-carousel__lock-icon"', { exact: false })).toBeInTheDocument();

    // when: click on lock
    fireEvent.click(screen.getByTestId('lock-cta'));

    // when: timer advances again
    act(() => jest.advanceTimersByTime(configuration.pageDurationMs));
    
    // then
    expect(screen.getByTestId('stats-section')).toBeInTheDocument();
    expect(screen.getByText('"className":"info-carousel__lock-icon is-locked"', { exact: false })).toBeInTheDocument();
  });
});
