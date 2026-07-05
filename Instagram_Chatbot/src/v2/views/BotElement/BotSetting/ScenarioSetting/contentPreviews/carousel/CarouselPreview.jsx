import React from 'react';
import { Carousel } from 'antd';
import ContentPreviewShell from '../shared/ContentPreviewShell';
import { CAROUSEL_TYPES } from '../../constants/contentTypeConstants';
import { PREVIEW_LABELS } from '../../constants/scenarioSettingLabels';
import { settingsCarousel } from '../../components/scenarioCarouselSettings';
import '../../styles/contentPreviews/carousel.css';

const CarouselPreview = ({ content, setIndexCarouselSlide }) => {
  const carousel = content.carousel;

  if (content.type !== 'carousel') return null;

  const renderHeader = () => {
    if (!carousel.title_require && !carousel.require) return null;
    return (
      <div className="ss-message__content--user-checkbox-top ss-carousel-preview__header">
        {carousel.title_require && (
          <span className="ss-message__content--user-checkbox-title">
            {carousel.title}
          </span>
        )}
        {carousel.require === true && (
          <span className="ss-message__content--user-text-input-required">
            {PREVIEW_LABELS.requiredMark}
          </span>
        )}
      </div>
    );
  };

  const renderDefaultType = () => (
    <Carousel arrows {...settingsCarousel} afterChange={(currentSlide) => setIndexCarouselSlide(currentSlide)}>
      {carousel[carousel?.type]?.contents && carousel[carousel.type].contents.map((itemCarousel, indexCarousel) => (
        <React.Fragment key={indexCarousel}>
          <div className="ss-carousel-preview__slide">
            <img src={itemCarousel.fileUrl} alt="" />
            {itemCarousel.title && <div className="ss-carousel-preview__title">{itemCarousel.title}</div>}
            {itemCarousel.subtitle && <div>{itemCarousel.subtitle}</div>}
          </div>
          {itemCarousel.buttonTitle && (
            <div className="ss-carousel-preview__button-row">
              <span className="ss-carousel-preview__button">{itemCarousel.buttonTitle}</span>
            </div>
          )}
        </React.Fragment>
      ))}
    </Carousel>
  );

  const renderTypeBody = () => {
    switch (carousel.type) {
      case CAROUSEL_TYPES.DEFAULT:
        return renderDefaultType();
      case CAROUSEL_TYPES.CONSUME_API_RESPONSE:
        return null;
      default:
        return null;
    }
  };

  return (
    <ContentPreviewShell className="ss-carousel-preview">
      {renderHeader()}
      <div className="ss-message__content--user-checkbox-wrapper">
        {renderTypeBody()}
      </div>
    </ContentPreviewShell>
  );
};

export default CarouselPreview;
