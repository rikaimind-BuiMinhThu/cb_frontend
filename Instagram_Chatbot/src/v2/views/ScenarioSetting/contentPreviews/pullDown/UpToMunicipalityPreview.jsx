import React from 'react';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import { PULL_DOWN_LABELS } from '../../constants/scenarioSettingLabels';

const UpToMunicipalityPreview = ({ pullDown, dataPrefectures, dataCity }) => {
  const typeConfig = pullDown[pullDown.type];

  const renderPrefectureComment = () => (
    <div className="ss-pull-down-preview__municipality-comment">{typeConfig.prefecture_comment}</div>
  );

  const renderSelectors = () => (
    <div className="ss-pull-down-preview__municipality-row">
      <SelectCustom
        data={dataPrefectures}
        placeholder={PULL_DOWN_LABELS.selectPrefecture}
        className="ss-pull-down-preview__municipality-select"
        keyValue="prefecture_jis_code"
        nameValue="name"
      />
      <span>{PULL_DOWN_LABELS.rangeSeparator}</span>
      <SelectCustom
        data={dataCity}
        placeholder={PULL_DOWN_LABELS.selectCity}
        className="ss-pull-down-preview__municipality-select"
        keyValue="id"
        nameValue="name"
      />
    </div>
  );

  const renderCityComment = () => (
    <div className="ss-pull-down-preview__municipality-comment">{typeConfig.city_comment}</div>
  );

  return (
    <div>
      {renderPrefectureComment()}
      {renderSelectors()}
      {renderCityComment()}
    </div>
  );
};

export default UpToMunicipalityPreview;
