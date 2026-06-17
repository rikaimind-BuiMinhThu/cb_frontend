import React from 'react';
import { SETTING_PLACEHOLDERS } from '../../constants/scenarioSettingLabels';
import { buildAgreeTermSettingContext } from './agreeTermSettingContext';

const DetailContentTypeSetting = (props) => {
  const { agreeTerm, changeContent } = buildAgreeTermSettingContext(props);

  const renderContentTextarea = () => (
    <div className="ss-user-setting__item-bottom">
      <textarea
        className="ss-user-setting-item-textarea-label ss-input-value ss-agree-term-setting__textarea"
        placeholder={SETTING_PLACEHOLDERS.text}
        rows="5"
        value={agreeTerm.detail_content.content}
        onChange={(e) => changeContent('detail_content', 'content')(e.target.value)}
      />
    </div>
  );

  return <>{renderContentTextarea()}</>;
};

export default DetailContentTypeSetting;
