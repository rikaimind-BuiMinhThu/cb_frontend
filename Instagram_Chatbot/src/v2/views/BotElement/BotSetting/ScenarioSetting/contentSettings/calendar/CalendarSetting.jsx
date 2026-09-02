import React from 'react';
import PropTypes from 'prop-types';
import { CALENDAR_TYPES, CONTENT_SETTING_TYPES } from '../../constants/contentTypeConstants';
import ContentSettingShell from '../shared/ContentSettingShell';
import CalendarCommonSections from './CalendarCommonSections';
import DateSelectionTypeSetting from './DateSelectionTypeSetting';
import EmbeddedTypeSetting from './EmbeddedTypeSetting';
import StartEndDateTypeSetting from './StartEndDateTypeSetting';
import '../../styles/contentSettings/calendar.css';

const CalendarSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    renderRootFaqOption,
    dataInputVar,
    setIsOpenAddVariable,
  } = props;

  const calendar = content.calendar;

  const renderTypeBody = () => {
    switch (calendar.type) {
      case CALENDAR_TYPES.DATE_SELECTION:
        return <DateSelectionTypeSetting {...props} />;
      case CALENDAR_TYPES.EMBEDDED:
        return <EmbeddedTypeSetting {...props} />;
      case CALENDAR_TYPES.START_END_DATE:
        return <StartEndDateTypeSetting {...props} />;
      default:
        return null;
    }
  };

  return (
    <ContentSettingShell
      contentType={CONTENT_SETTING_TYPES.CALENDAR}
      contentData={calendar}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
      className="ss-calendar-setting-shell"
    >
      <CalendarCommonSections {...props} />
      {renderTypeBody()}
    </ContentSettingShell>
  );
};

CalendarSetting.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
  onChangeValueMessageContent: PropTypes.func.isRequired,
  renderRootFaqOption: PropTypes.func,
  dataInputVar: PropTypes.array,
  setIsOpenAddVariable: PropTypes.func.isRequired,
  onChangeFixedDate: PropTypes.func.isRequired,
};

export default CalendarSetting;
