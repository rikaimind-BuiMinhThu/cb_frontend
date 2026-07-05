import React from 'react';
import { SETTING_PLACEHOLDERS } from '../constants/scenarioSettingLabels';
import '../styles/contentSettings/label.css';

const LABEL_NO_TRANSITION_NOTICE = '* You cannot add other user input components together with "Label (no transition record)".';

const LabelNoTransitionSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  onChangeValueMessageContent,
}) => {
  const labelNoTransition = content.label_no_transition;

  const renderNotice = () => (
    <div className="ss-label-no-transition__notice">{LABEL_NO_TRANSITION_NOTICE}</div>
  );

  const renderTextarea = () => (
    <div className="ss-user-setting__item-bottom">
      <textarea
        className="ss-label-no-transition__textarea"
        placeholder={SETTING_PLACEHOLDERS.text}
        rows="5"
        value={labelNoTransition.value}
        onChange={(e) => onChangeValueMessageContent(
          indexMessageSelect,
          indexContent,
          content.type,
          e.target.value,
          'value',
        )}
      />
    </div>
  );

  return (
    <>
      {renderNotice()}
      {renderTextarea()}
    </>
  );
};

export default LabelNoTransitionSetting;
