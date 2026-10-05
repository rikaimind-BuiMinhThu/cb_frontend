import React from 'react';
import SelectCustom from '../../scenarioComon/SelectCustom';
import InputCustom from '../../scenarioComon/InputCustom';
import { PULL_DOWN_LABELS, SETTING_PLACEHOLDERS } from '../../constants/scenarioSettingLabels';
import { buildPullDownSettingContext } from './pullDownSettingContext';

const UpToMunicipalityTypeSetting = (props) => {
  const {
    typeConfig,
    changeTypeField,
    dataPrefectures,
  } = buildPullDownSettingContext(props);

  const renderPrefectureComment = () => (
    <div className="ss-user-setting__item-bottom">
      <InputCustom
        className="ss-pull-down-setting__input--90"
        placeholder={SETTING_PLACEHOLDERS.comment}
        value={typeConfig?.prefecture_comment}
        onChange={changeTypeField('prefecture_comment')}
      />
    </div>
  );

  const renderPrefectureCitySelectors = () => (
    <div className="ss-user-setting__item-bottom">
      <SelectCustom
        className="ss-pull-down-setting__select--42"
        value={typeConfig?.prefecture_test}
        placeholder={PULL_DOWN_LABELS.selectPrefecture}
        data={dataPrefectures}
        keyValue="name"
        nameValue="name"
        onChange={changeTypeField('prefecture_test')}
      />
      <span className="ss-pull-down-setting__range-separator--inline">{PULL_DOWN_LABELS.rangeSeparator}</span>
      <SelectCustom
        className="ss-pull-down-setting__select--42"
        placeholder={PULL_DOWN_LABELS.selectCity}
        value={typeConfig?.city_test}
        data={[]}
        onChange={changeTypeField('city_test')}
      />
    </div>
  );

  const renderCityComment = () => (
    <div className="ss-user-setting__item-bottom">
      <InputCustom
        className="ss-pull-down-setting__input--90"
        placeholder={SETTING_PLACEHOLDERS.comment}
        value={typeConfig?.city_comment}
        onChange={changeTypeField('city_comment')}
      />
    </div>
  );

  return (
    <>
      {renderPrefectureComment()}
      {renderPrefectureCitySelectors()}
      {renderCityComment()}
    </>
  );
};

export default UpToMunicipalityTypeSetting;
