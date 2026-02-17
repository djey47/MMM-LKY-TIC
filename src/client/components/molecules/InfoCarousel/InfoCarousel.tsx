import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useBoolean } from 'usehooks-ts'
import { HistorySection, StatsSection, SummarySection } from '../../Teleinfo/sections';
import Badge from '../../atoms/Badge/Badge';
import ConfigurationContext from '../../../contexts/ConfigurationContext';
import type { TeleInfo } from '../../../../shared/domain/teleinfo';
import type { InfoSectionCommonProps } from '../../../types/client';
import './InfoCarousel.scss';

export interface InfoCarouselProps {
  data?: TeleInfo;
  stickyIndex?: number;
}

const PAGES = [SummarySection, StatsSection, HistorySection];

const InfoCarousel = ({ data, stickyIndex }: InfoCarouselProps) => {
  const configuration = useContext(ConfigurationContext);
  const [currentPage, setCurrentPage] = useState(stickyIndex ?? 0);
  const { value: isLocked, toggle: toggleLocked,  } = useBoolean(false);

  useEffect(() => {
    if (stickyIndex !== undefined || isLocked) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % PAGES.length);
    }, configuration?.pageDurationMs);
    return () => clearInterval(interval);
  }, [isLocked, configuration?.pageDurationMs]);

  const onLockClick = useCallback(() => {
    toggleLocked();
  }, [toggleLocked]);

  const CurrentPageComponent = PAGES[currentPage] as React.FC<InfoSectionCommonProps>;

  const lockIcon = isLocked ? faLock : faLockOpen;
  const lockIconClassname = clsx('info-carousel__lock-icon', { 'is-locked': isLocked })

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
        <span
          data-testid = "lock-cta"
          role="button"
          aria-hidden="true"
          className="info-carousel__lock" 
          onClick={onLockClick}>
          <FontAwesomeIcon icon={lockIcon} size="sm" className={lockIconClassname} />
        </span>
      </div>
    </div>
  );
};

export default InfoCarousel;
