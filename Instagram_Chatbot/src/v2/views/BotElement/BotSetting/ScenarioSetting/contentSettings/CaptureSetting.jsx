import React from 'react';
import SelectCustom from '../scenarioComon/SelectCustom';
import InputNum from '../scenarioComon/InputNum';
import { dropDownTitle } from '../constants/scenarioFormConstants';
import {
  CAPTURE_COLOUR_OPTIONS,
  CAPTURE_TYPE_OPTIONS,
  SETTING_LABELS,
  SETTING_PLACEHOLDERS,
} from '../constants/scenarioSettingLabels';
import { ContentTitleInput } from './shared/ContentTypeSelector';
import '../styles/contentSettings/capture.css';

const CaptureSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  onChangeValueMessageContent,
}) => {
  const capture = content.capture;

  const changeField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, field);

  const renderTitleRequire = () => (
    <div className="ss-user-setting__item-bottom">
      <SelectCustom
        className="ss-select--full"
        value={capture.title_require}
        data={dropDownTitle}
        onChange={changeField('title_require')}
      />
    </div>
  );

  const renderTitle = () => {
    if (capture?.title_require !== true) return null;
    return (
      <ContentTitleInput
        title={capture.title}
        onChange={changeField('title')}
      />
    );
  };

  const renderTypeSelect = () => (
    <div className="ss-setting-row__col-third">
      <div className="ss-field-label--section">{SETTING_LABELS.type}</div>
      <SelectCustom
        placeholder={SETTING_PLACEHOLDERS.type}
        className="ss-select--full"
        value={capture.type}
        data={CAPTURE_TYPE_OPTIONS}
        onChange={changeField('type')}
      />
    </div>
  );

  const renderLengthInput = () => (
    <div className="ss-setting-row__col-third">
      <div className="ss-field-label--section">{SETTING_LABELS.length}</div>
      <InputNum
        className="ss-user-setting-input-limit-character ss-input-num--full"
        min={1}
        max={9999}
        value={capture.length}
        onChange={changeField('length')}
      />
    </div>
  );

  const renderColourSelect = () => (
    <div className="ss-setting-row__col-third">
      <div className="ss-field-label--section">{SETTING_LABELS.colour}</div>
      <SelectCustom
        placeholder={SETTING_PLACEHOLDERS.colour}
        className="ss-select--full"
        value={capture.colour}
        data={CAPTURE_COLOUR_OPTIONS}
        onChange={changeField('colour')}
      />
    </div>
  );

  const renderOptionsRow = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-setting-row">
        {renderTypeSelect()}
        {renderLengthInput()}
        {renderColourSelect()}
      </div>
    </div>
  );

  const renderPreview = () => {
    const previewUrl = `https://svg-captcha-nodejs.vercel.app/captchapreview?size=${capture.length}${capture.colour ? '&color=true' : ''}&charPreset=${capture.type}`;
    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-setting-width-90">
          <img className="ss-captcha-preview" src={previewUrl} alt="" />
        </div>
      </div>
    );
  };

  return (
    <>
      {renderTitleRequire()}
      {renderTitle()}
      {renderOptionsRow()}
      {renderPreview()}
    </>
  );
};

export default CaptureSetting;
