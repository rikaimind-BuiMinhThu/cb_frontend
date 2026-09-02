import React from 'react';
import SelectCustom from '../scenarioComon/SelectCustom';
import InputCustom from '../scenarioComon/InputCustom';
import ContentSettingShell from './shared/ContentSettingShell';
import { ContentTitleInput } from './shared/ContentTypeSelector';
import FukushashikiSearchRow from './shared/FukushashikiSearchRow';
import { dropDownTitle, dataMaxRangSlider } from '../constants/scenarioFormConstants';
import { FUKUSHASHIKI_VARIANTS } from '../constants/scenarioSettingLabels';
import '../styles/contentSettings/slider.css';

const SLIDER_TYPE_OPTIONS = [
  { key: 'continuous_type', value: '連続タイプ' },
  { key: 'discrete_type', value: '離散タイプ' },
];

const SLIDER_MIN_VALUE_OPTIONS = [
  { key: '0', value: '0' },
  { key: '1', value: '1' },
];

const SliderSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  renderRootFaqOption,
  dataInputVar,
  setIsOpenAddVariable,
  isUseFukushashiki,
  isColor,
}) => {
  const slider = content.slider;
  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[indexContent];

  const changeField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, field);

  const changeMessageField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  const renderTypeSelectors = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-user-setting__item-select-bottom-wrapper-flex">
        <SelectCustom
          id="title"
          className="ss-select--half"
          value={slider.title_require}
          data={dropDownTitle}
          onChange={changeField('title_require')}
        />
        <SelectCustom
          id="type"
          allowClear={false}
          className="ss-select--half"
          value={slider.type}
          data={SLIDER_TYPE_OPTIONS}
          onChange={changeField('type')}
        />
      </div>
    </div>
  );

  const renderTitle = () => {
    if (slider?.title_require !== true) return null;
    return (
      <ContentTitleInput
        title={slider.title}
        onChange={changeField('title')}
      />
    );
  };

  const renderDiscreteOptions = () => {
    if (slider.type !== 'discrete_type') return null;
    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-slider-setting__discrete-row">
          <SelectCustom
            label="最小値"
            className="ss-slider-setting__discrete-select"
            value={slider.min_value}
            data={SLIDER_MIN_VALUE_OPTIONS}
            onChange={changeField('min_value')}
          />
          <SelectCustom
            label="最大値のラベル"
            className="ss-slider-setting__discrete-select-max"
            value={slider.max_value}
            data={dataMaxRangSlider}
            onChange={changeField('max_value')}
          />
        </div>
      </div>
    );
  };

  const renderLabelField = (field, labelText) => {
    const value = slider[field];
    const isValid = !!value;
    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-setting-width-90 ss-slider-type-options">
          <InputCustom
            label={labelText}
            placeholder=""
            className={`ss-slider-setting__label-input ${isValid ? 'ss-slider-setting__label-input--valid' : 'ss-slider-setting__label-input--invalid'}`}
            onChange={changeField(field)}
            value={value}
          />
        </div>
        {!isValid && (
          <div className="ss-slider-setting__error">必ず指定してください。</div>
        )}
      </div>
    );
  };

  const renderMinLabel = () => renderLabelField('min_label', '最小値のラベル');
  const renderMaxLabel = () => renderLabelField('max_label', '最大値のラベル');

  const renderColorField = () => {
    const colorValid = !slider.color || isColor(slider.color);
    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-slider-setting__color-row">
          <InputCustom
            label="カラー"
            className={`ss-slider-setting__color-input ${colorValid ? 'ss-slider-setting__label-input--valid' : 'ss-slider-setting__label-input--invalid'}`}
            placeholder="#2c75f0"
            onChange={changeField('color')}
            value={slider.color}
          />
          <div
            className="ss-slider-setting__color-swatch"
            style={{ '--swatch-color': slider.color || '#2C75F0' }}
          />
        </div>
        {slider.color && !isColor(slider.color) && (
          <div className="ss-slider-setting__error">カラーには、有効な正規表現を指定してください。</div>
        )}
      </div>
    );
  };

  const renderFukushashiki = () => {
    if (!isUseFukushashiki) return null;
    return (
      <FukushashikiSearchRow
        mode={messageContent?.fukushashiki_search_mode}
        inputValue={messageContent?.fukushashiki_search_value ?? ''}
        onModeChange={changeMessageField('fukushashiki_search_mode')}
        onInputChange={changeMessageField('fukushashiki_search_value')}
        variant={FUKUSHASHIKI_VARIANTS.DEFAULT}
        rowClassName="ss-slider-setting__fukushashiki-row"
      />
    );
  };

  return (
    <ContentSettingShell
      contentType="slider"
      contentData={slider}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
    >
      {renderTypeSelectors()}
      {renderTitle()}
      {renderDiscreteOptions()}
      {renderMinLabel()}
      {renderMaxLabel()}
      {renderColorField()}
      {renderFukushashiki()}
    </ContentSettingShell>
  );
};

export default SliderSetting;
