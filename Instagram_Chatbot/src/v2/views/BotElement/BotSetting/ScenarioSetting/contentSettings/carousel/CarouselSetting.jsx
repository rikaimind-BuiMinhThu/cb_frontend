import React from 'react';
import { Button } from 'reactstrap';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import SelectCustom from '../../scenarioComon/SelectCustom';
import ContentSettingShell from '../shared/ContentSettingShell';
import ContentTypeSelector, { ContentTitleInput } from '../shared/ContentTypeSelector';
import { CAROUSEL_TYPES } from '../../constants/contentTypeConstants';
import { carouselType } from '../../constants/scenarioFormConstants';
import {
  CAROUSEL_LABELS,
  SETTING_BUTTON_LABELS,
  SETTING_LABELS,
} from '../../constants/scenarioSettingLabels';
import { buildCarouselSettingContext } from './carouselSettingContext';
import DefaultTypeSetting from './DefaultTypeSetting';
import '../../styles/contentSettings/carousel.css';

const CarouselSetting = (props) => {
  const {
    content,
    indexMessageSelect,
    indexContent,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    dataInputVar,
    setIsOpenAddVariable,
    setIsOpenFileReference,
    setVarFileReference,
    carouselUploadFile,
    getBaseUrl,
    setIndexCarouselSlide,
    indexCarouselSlide,
    fileErrorCarousel,
  } = props;

  if (content.type !== 'carousel') return null;

  const carousel = content.carousel;
  const { changeContent } = buildCarouselSettingContext(props);

  const renderSaveVariable = () => (
    <>
      <CheckboxCustom
        label={SETTING_LABELS.saveToVariable}
        onChange={changeContent('is_save_input_content')}
        value={carousel.is_save_input_content}
        isOnChange={false}
      />
      {carousel.is_save_input_content && (
        <div className="ss-user-setting__item-bottom">
          <div className="ss-user-setting__item-select-bottom-wrapper-flex">
            <SelectCustom
              className="ss-select--full-mr"
              id="title"
              value={carousel?.save_input_content}
              data={dataInputVar}
              keyValue="variable_name"
              nameValue="variable_name"
              onChange={changeContent('save_input_content')}
            />
            <Button
              className="ss-user-setting__select-btn-add ss-drag-add-btn"
              onClick={() => setIsOpenAddVariable(true)}
            >
              {SETTING_BUTTON_LABELS.add}
            </Button>
          </div>
        </div>
      )}
    </>
  );

  const renderCarouselOptions = () => (
    <div className="ss-user-setting__item-text_input-top">
      {renderSaveVariable()}
      <div className="ss-user-setting__item-text_input-use-api-wrapper ss-carousel-setting__api-wrapper">
        <div>
          <CheckboxCustom
            label={CAROUSEL_LABELS.useShortenedUrls}
            onChange={changeContent('use_shortened_urls')}
            value={carousel.use_shortened_urls}
          />
        </div>
        <div className="ss-user-setting__item-text_input-use-api-required">
          <CheckboxCustom
            label={SETTING_LABELS.require}
            onChange={changeContent('require')}
            value={carousel.require}
          />
        </div>
      </div>
      <CheckboxCustom
        label={CAROUSEL_LABELS.useJs}
        onChange={changeContent('is_use_js')}
        value={carousel.is_use_js}
      />
    </div>
  );

  const renderTypeSelector = () => (
    <ContentTypeSelector
      titleRequire={carousel.title_require}
      typeValue={carousel.type}
      typeOptions={carouselType}
      onTitleRequireChange={changeContent('title_require')}
      onTypeChange={changeContent('type')}
    />
  );

  const renderTitle = () => {
    if (carousel?.title_require !== true) return null;
    return (
      <ContentTitleInput
        title={carousel.title}
        onChange={changeContent('title')}
      />
    );
  };

  const renderTypeBody = () => {
    switch (carousel.type) {
      case CAROUSEL_TYPES.DEFAULT:
        return (
          <DefaultTypeSetting
            {...props}
            carousel={carousel}
            setIsOpenFileReference={setIsOpenFileReference}
            setVarFileReference={setVarFileReference}
            carouselUploadFile={carouselUploadFile}
            getBaseUrl={getBaseUrl}
            setIndexCarouselSlide={setIndexCarouselSlide}
            indexCarouselSlide={indexCarouselSlide}
            fileErrorCarousel={fileErrorCarousel}
          />
        );
      case CAROUSEL_TYPES.CONSUME_API_RESPONSE:
        return null;
      default:
        return null;
    }
  };

  return (
    <ContentSettingShell
      contentType="carousel"
      contentData={carousel}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
    >
      {renderCarouselOptions()}
      {renderTypeSelector()}
      {renderTitle()}
      {renderTypeBody()}
    </ContentSettingShell>
  );
};

export default CarouselSetting;
