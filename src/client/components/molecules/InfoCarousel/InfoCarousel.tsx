import React, { useContext, useEffect, useState } from 'react';
import { StatsSection, SummarySection } from '../../Teleinfo/sections';
import Badge from '../../atoms/Badge/Badge';
import ConfigurationContext from '../../../contexts/ConfigurationContext';
import type { TeleInfo } from '../../../../shared/domain/teleinfo';
import type { InfoSectionCommonProps } from '../../../types/client';
import './InfoCarousel.scss';

export interface InfoCarouselProps {
  data?: TeleInfo;
  stickyIndex?: number;
}

const PAGES = [SummarySection, StatsSection/*, HistorySection*/];

const InfoCarousel = ({ data, stickyIndex }: InfoCarouselProps) => {
  const configuration = useContext(ConfigurationContext);
  const [currentPage, setCurrentPage] = useState(stickyIndex ?? 0);

  useEffect(() => {
    if (stickyIndex !== undefined) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % PAGES.length); // Assuming 3 pages
    }, configuration?.pageDurationMs);
    return () => clearInterval(interval);
  }, []);

  const CurrentPageComponent = PAGES[currentPage] as React.FC<InfoSectionCommonProps>;

  return (
    <div className="info-carousel">
      <div className="info-carousel__page">
        {<CurrentPageComponent data={data} />}
      </div>
      <div className="info-carousel__controls">
        {PAGES.map((_, index) => (
          <Badge
            active={currentPage === index}
            key={index}
            onClick={() => setCurrentPage(index)}
            text={String(index + 1)} />
        ))}
      </div>
    </div>
  );
};

export default InfoCarousel;
