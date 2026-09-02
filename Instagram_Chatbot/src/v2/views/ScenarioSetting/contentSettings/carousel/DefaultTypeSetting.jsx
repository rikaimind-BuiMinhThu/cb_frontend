import React from 'react';
import { Carousel } from 'antd';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import InputCustom from '../../scenarioCommon/InputCustom';
import { settingsCarousel } from '../../components/scenarioCarouselSettings';
import {
  CAROUSEL_LABELS,
  SETTING_BUTTON_LABELS,
  SETTING_PLACEHOLDERS,
} from '../../constants/scenarioSettingLabels';
import { buildCarouselSettingContext } from './carouselSettingContext';

const DefaultTypeSetting = (props) => {
  const {
    content,
    carousel,
    dataMessages,
    setDataMessages,
    indexMessageSelect,
    indexContent,
    setIsOpenFileReference,
    setVarFileReference,
    carouselUploadFile,
    getBaseUrl,
    indexCarouselSlide,
    setIndexCarouselSlide,
    fileErrorCarousel,
  } = props;
  const { changeContent } = buildCarouselSettingContext(props);

  const addSlide = () => {
    const arrCarousel = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents];
    const idMax = arrCarousel.length !== 0
      ? Math.max(...arrCarousel.map((item) => item.id)) + 1
      : 1;
    dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents.push({
      id: idMax,
      title: '',
      subtitle: '',
      urls: '',
      fileUrl: '',
      buttonTitle: '',
    });
    setDataMessages([...dataMessages]);
  };

  const removeSlide = () => {
    const arrMessage = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents];
    const startArr = arrMessage.slice(0, indexCarouselSlide);
    const lastArr = arrMessage.slice(indexCarouselSlide + 1, arrMessage.length);
    dataMessages[indexMessageSelect].message_content[indexContent][content.type][carousel.type].contents = [...startArr, ...lastArr];
    setDataMessages([...dataMessages]);
  };

  const renderAddButton = () => (
    <div className={`ss-user-setting__item-bottom ss-carousel-setting__add-row ${carousel[carousel.type]?.contents.length > 1 ? 'ss-carousel-setting__add-row--spaced' : ''}`}>
      <div className="ss-setting-width-90">
        <Button className="ss-carousel-setting__upload-btn" onClick={addSlide}>
          {SETTING_BUTTON_LABELS.add}
        </Button>
      </div>
    </div>
  );

  const renderRemoveButton = () => {
    if (carousel[carousel.type]?.contents.length <= 1) return null;
    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-carousel-setting__remove-row">
          <MDBIcon fas icon="times-circle" className="ss-carousel-setting__remove-icon" onClick={removeSlide} />
        </div>
      </div>
    );
  };

  const renderSlide = (itemCarousel, indexCarousel) => (
    <div className="ss-carousel-setting__slide" key={indexCarousel}>
      <InputCustom
        placeholder={SETTING_PLACEHOLDERS.title}
        value={itemCarousel.title}
        onChange={changeContent(carousel.type, 'contents', indexCarousel, 'title')}
      />
      <InputCustom
        className="ss-mg-top-5"
        placeholder={CAROUSEL_LABELS.subtitle}
        value={itemCarousel.subtitle}
        maxLength={90}
        onChange={changeContent(carousel.type, 'contents', indexCarousel, 'subtitle')}
      />
      <InputCustom
        className="ss-mg-top-5"
        placeholder={SETTING_PLACEHOLDERS.urls}
        value={itemCarousel.urls}
        onChange={changeContent(carousel.type, 'contents', indexCarousel, 'urls')}
      />
      <InputCustom
        className="ss-mg-top-5"
        placeholder={CAROUSEL_LABELS.fileUrl}
        value={itemCarousel.fileUrl}
        onChange={changeContent(carousel.type, 'contents', indexCarousel, 'fileUrl')}
      />
    </div>
  );

  const renderCarousel = () => (
    <div className="ss-carousel-setting__slider">
      <Carousel arrows {...settingsCarousel} afterChange={(currentSlide) => setIndexCarouselSlide(currentSlide)}>
        {carousel[carousel.type]?.contents.map((itemCarousel, indexCarousel) => (
          <React.Fragment key={indexCarousel}>
            {renderSlide(itemCarousel, indexCarousel)}
          </React.Fragment>
        ))}
      </Carousel>
    </div>
  );

  const renderImageHint = () => (
    <div className="ss-user-setting__item-bottom">
      <span className="ss-carousel-setting__hint">{CAROUSEL_LABELS.imageHint}</span>
    </div>
  );

  const renderFileUpload = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-file-upload-wrapper ss-setting-file-upload-wrapper">
        <Button
          className="ss-bot-file-reference-btn ss-carousel-setting__file-btn"
          onClick={() => {
            setIsOpenFileReference(true);
            setVarFileReference({
              indexContent,
              contentType: content.type,
              subContentType: carousel.type,
              childSubContentType: 'contents',
              indexSubContent: indexCarouselSlide,
              img: 'fileUrl',
            });
          }}
        >
          {SETTING_BUTTON_LABELS.fileReference}
        </Button>
        <input
          type="file"
          id="ss-carouse-file-upload"
          name="carouse-file-upload"
          hidden
          onChange={(e) => getBaseUrl(e, indexContent)}
        />
        <Button className="ss-bot-file-upload-btn ss-carousel-setting__file-btn" onClick={carouselUploadFile}>
          {SETTING_BUTTON_LABELS.upload}
        </Button>
      </div>
    </div>
  );

  const renderFileError = () => {
    if (!fileErrorCarousel) return null;
    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-carousel-setting__error">{fileErrorCarousel}</div>
      </div>
    );
  };

  const renderDivider = () => (
    <div className="ss-user-setting__item-bottom ss-carousel-setting__divider" />
  );

  const renderButtonTitle = () => (
    <div className="ss-user-setting__item-bottom">
      <InputCustom
        placeholder={CAROUSEL_LABELS.buttonTitle}
        value={carousel[carousel.type].contents[indexCarouselSlide]?.buttonTitle}
        onChange={changeContent(carousel.type, 'contents', indexCarouselSlide, 'buttonTitle')}
      />
    </div>
  );

  const renderJsCode = () => {
    if (!carousel.is_use_js) return null;
    return (
      <>
        <div className="ss-user-setting__item-bottom ss-carousel-setting__js-label">
          {CAROUSEL_LABELS.jsCode}
        </div>
        <div className="ss-user-setting__item-bottom">
          <textarea
            className="ss-user-setting-item-textarea-label ss-input-value ss-carousel-setting__js-textarea"
            placeholder={SETTING_PLACEHOLDERS.text}
            rows="5"
            value={carousel.jscode}
            onChange={(e) => changeContent('jscode')(e.target.value)}
          />
        </div>
      </>
    );
  };

  return (
    <>
      {renderAddButton()}
      {renderRemoveButton()}
      {renderCarousel()}
      {renderImageHint()}
      {renderFileUpload()}
      {renderFileError()}
      {renderDivider()}
      {renderButtonTitle()}
      {renderJsCode()}
    </>
  );
};

export default DefaultTypeSetting;
