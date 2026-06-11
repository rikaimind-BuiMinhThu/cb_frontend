import React from 'react';
import { Carousel } from 'antd';
import { settingsCarousel } from '../components/scenarioCarouselSettings';

const CarouselPreview = ({
  content,
  message,
  indexContent,
  setIndexCarouselSlide,
}) => {
  const carousel = content.carousel;
  return (
    <>
      {
        content.type === 'carousel' && (
          <div style={{ marginBottom: '10px' }}>
            {(carousel.title_require || carousel.require) &&
              <div className="ss-message__content--user-checkbox-top" style={{ marginBottom: '0px' }}>
                {carousel.title_require &&
                  <span className="ss-message__content--user-checkbox-title">
                    {carousel.title}
                  </span>
                }
                {carousel.require === true &&
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                }
              </div>
            }
            <div className="ss-message__content--user-checkbox-wrapper">
              {carousel.type === 'default' && (
                <Carousel arrows {...settingsCarousel} afterChange={(currentSlide) => setIndexCarouselSlide(currentSlide)}>
                  {carousel[carousel?.type]?.contents &&
                    carousel[carousel?.type]?.contents.map((itemCarousel, indexCarousel) => {
                      return <React.Fragment key={indexCarousel}>
                        <div style={{ width: '100%', minHeight: '298px' }}>
                          <img src={itemCarousel.fileUrl} />
                          {itemCarousel.title && <div style={{ fontWeight: '800' }}>{itemCarousel.title}</div>}
                          {itemCarousel.subtitle && <div>{itemCarousel.subtitle}</div>}
                        </div>
                        {itemCarousel.buttonTitle &&
                          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                            <span style={{ minWidth: '10%', height: '10%', backgroundColor: '#088C43', padding: '7px', color: 'white', fontWeight: '400', borderRadius: '5px' }}>
                              {itemCarousel.buttonTitle}
                            </span>
                          </div>
                        }
                      </React.Fragment>
                    })}
                </Carousel>
              )}
              {carousel.type === 'consume_api_response' && (
                <>
                </>
              )}
            </div>
          </div>
        )
      }
    </>
  );
};

export default CarouselPreview;
