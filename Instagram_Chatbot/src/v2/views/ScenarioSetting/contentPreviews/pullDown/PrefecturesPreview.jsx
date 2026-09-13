import React from 'react';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import { PULL_DOWN_LABELS } from '../../constants/scenarioSettingLabels';

const PrefecturesPreview = ({ dataPrefectures }) => (
  <SelectCustom
    data={dataPrefectures}
    placeholder={PULL_DOWN_LABELS.selectPlaceholder}
    className="ss-pull-down-preview__select--full"
    keyValue="prefecture_jis_code"
    nameValue="name"
  />
);

export default PrefecturesPreview;
