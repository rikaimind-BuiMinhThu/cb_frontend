import React from 'react';
import { PULL_DOWN_TYPES } from '../../constants/contentTypeConstants';
import PullDownPreviewHeader from './PullDownPreviewHeader';
import CustomizationPreview from './CustomizationPreview';
import TimeHmPreview from './TimeHmPreview';
import DateYmdPreview from './DateYmdPreview';
import DateMdPreview from './DateMdPreview';
import DateYmPreview from './DateYmPreview';
import DateYmdHmPreview from './DateYmdHmPreview';
import DobYmdPreview from './DobYmdPreview';
import TimezoneFromToPreview from './TimezoneFromToPreview';
import PeriodFromToPreview from './PeriodFromToPreview';
import PrefecturesPreview from './PrefecturesPreview';
import UpToMunicipalityPreview from './UpToMunicipalityPreview';
import '../../styles/contentSettings/pullDown.css';

const renderTypePreview = (pullDownType, props) => {
  switch (pullDownType) {
    case PULL_DOWN_TYPES.CUSTOMIZATION:
      return <CustomizationPreview {...props} />;
    case PULL_DOWN_TYPES.TIME_HM:
      return <TimeHmPreview {...props} />;
    case PULL_DOWN_TYPES.DATE_YMD:
      return <DateYmdPreview {...props} />;
    case PULL_DOWN_TYPES.DATE_MD:
      return <DateMdPreview {...props} />;
    case PULL_DOWN_TYPES.DATE_YM:
    case PULL_DOWN_TYPES.DOB_YM:
      return <DateYmPreview {...props} />;
    case PULL_DOWN_TYPES.DATE_YMD_HM:
      return <DateYmdHmPreview {...props} />;
    case PULL_DOWN_TYPES.DOB_YMD:
      return <DobYmdPreview {...props} />;
    case PULL_DOWN_TYPES.TIMEZONE_FROM_TO:
      return <TimezoneFromToPreview {...props} />;
    case PULL_DOWN_TYPES.PERIOD_FROM_TO:
      return <PeriodFromToPreview {...props} />;
    case PULL_DOWN_TYPES.PREFECTURES:
      return <PrefecturesPreview {...props} />;
    case PULL_DOWN_TYPES.UP_TO_MUNICIPALITY:
      return <UpToMunicipalityPreview {...props} />;
    case PULL_DOWN_TYPES.LP_INTEGRATION_OPTION:
      return props.renderLPIntegrationOptionPreview(props.pullDown);
    case PULL_DOWN_TYPES.FROM_JS_RESULT:
      return props.renderPreviewPulldownfromJs(props.pullDown);
    default:
      return null;
  }
};

const PullDownPreview = (props) => {
  const { pullDown } = props;

  const renderHeader = () => <PullDownPreviewHeader pullDown={pullDown} />;

  const renderBody = () => renderTypePreview(pullDown.type, props);

  return (
    <div className="ss-pull-down-preview">
      {renderHeader()}
      <div className="ss-message__content--user-pull_down-wrapper">
        {renderBody()}
      </div>
    </div>
  );
};

export default PullDownPreview;
