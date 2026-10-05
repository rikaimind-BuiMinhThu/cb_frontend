import React from 'react';
import ContentSettingShell from '../shared/ContentSettingShell';
import ContentTypeSelector, { ContentTitleInput } from '../shared/ContentTypeSelector';
import { PULL_DOWN_TYPES } from '../../constants/contentTypeConstants';
import { dataTypePullDown } from '../../constants/scenarioFormConstants';
import { buildPullDownSettingContext } from './pullDownSettingContext';
import CustomizationTypeSetting from './CustomizationTypeSetting';
import TimeHmTypeSetting from './TimeHmTypeSetting';
import DateYmdTypeSetting from './DateYmdTypeSetting';
import DateMdTypeSetting from './DateMdTypeSetting';
import DateYmTypeSetting from './DateYmTypeSetting';
import DateYmdHmTypeSetting from './DateYmdHmTypeSetting';
import DobYmdTypeSetting from './DobYmdTypeSetting';
import DobYmTypeSetting from './DobYmTypeSetting';
import TimezoneFromToTypeSetting from './TimezoneFromToTypeSetting';
import PeriodFromToTypeSetting from './PeriodFromToTypeSetting';
import PrefecturesTypeSetting from './PrefecturesTypeSetting';
import UpToMunicipalityTypeSetting from './UpToMunicipalityTypeSetting';
import ConsumeApiResponseTypeSetting from './ConsumeApiResponseTypeSetting';
import LpIntegrationOptionTypeSetting from './LpIntegrationOptionTypeSetting';
import FromJsResultTypeSetting from './FromJsResultTypeSetting';
import '../../styles/contentSettings/pullDown.css';

const renderTypeSetting = (pullDownType, props) => {
  switch (pullDownType) {
    case PULL_DOWN_TYPES.CUSTOMIZATION:
      return <CustomizationTypeSetting {...props} />;
    case PULL_DOWN_TYPES.TIME_HM:
      return <TimeHmTypeSetting {...props} />;
    case PULL_DOWN_TYPES.DATE_YMD:
      return <DateYmdTypeSetting {...props} />;
    case PULL_DOWN_TYPES.DATE_MD:
      return <DateMdTypeSetting {...props} />;
    case PULL_DOWN_TYPES.DATE_YM:
      return <DateYmTypeSetting {...props} />;
    case PULL_DOWN_TYPES.DATE_YMD_HM:
      return <DateYmdHmTypeSetting {...props} />;
    case PULL_DOWN_TYPES.DOB_YMD:
      return <DobYmdTypeSetting {...props} />;
    case PULL_DOWN_TYPES.DOB_YM:
      return <DobYmTypeSetting {...props} />;
    case PULL_DOWN_TYPES.TIMEZONE_FROM_TO:
      return <TimezoneFromToTypeSetting {...props} />;
    case PULL_DOWN_TYPES.PERIOD_FROM_TO:
      return <PeriodFromToTypeSetting {...props} />;
    case PULL_DOWN_TYPES.PREFECTURES:
      return <PrefecturesTypeSetting {...props} />;
    case PULL_DOWN_TYPES.UP_TO_MUNICIPALITY:
      return <UpToMunicipalityTypeSetting {...props} />;
    case PULL_DOWN_TYPES.COMSUME_API_RESPONSE:
      return <ConsumeApiResponseTypeSetting {...props} />;
    case PULL_DOWN_TYPES.LP_INTEGRATION_OPTION:
      return <LpIntegrationOptionTypeSetting {...props} />;
    case PULL_DOWN_TYPES.FROM_JS_RESULT:
      return <FromJsResultTypeSetting {...props} />;
    default:
      return null;
  }
};

const PullDownSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    pullDown,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    renderRootFaqOption,
    dataInputVar,
    setIsOpenAddVariable,
  } = props;

  const { changeContent } = buildPullDownSettingContext(props);

  const renderTypeSelectors = () => (
    <ContentTypeSelector
      titleRequire={pullDown?.title_require}
      typeValue={pullDown?.type}
      typeOptions={dataTypePullDown}
      onTitleRequireChange={changeContent('title_require')}
      onTypeChange={changeContent('type')}
    />
  );

  const renderTitle = () => {
    if (pullDown?.title_require !== true) return null;
    return (
      <ContentTitleInput
        title={pullDown.title}
        onChange={changeContent('title')}
      />
    );
  };

  const renderTypeBody = () => renderTypeSetting(pullDown?.type, props);

  return (
    <ContentSettingShell
      contentType="pull_down"
      contentData={pullDown}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
      className="ss-pull-down-setting"
    >
      {renderTypeSelectors()}
      {renderTitle()}
      {renderTypeBody()}
    </ContentSettingShell>
  );
};

export default PullDownSetting;
