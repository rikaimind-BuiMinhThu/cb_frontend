import React from 'react';
import InputDouble from '../../scenarioComon/InputDouble';
import { buildPullDownSettingContext } from './pullDownSettingContext';

const PrefecturesTypeSetting = (props) => {
  const { dataPrefectures } = buildPullDownSettingContext(props);

  const renderPrefectureList = () => (
    <div className="ss-user-setting__item-bottom">
      {dataPrefectures && dataPrefectures.map((item, index) => (
        <InputDouble
          key={item.prefecture_jis_code || item.name || index}
          classCustom="ss-user-setting-double-input-custom"
          disabled
          valueLeft={item.name}
          valueRight={index < 9 ? `0${index + 1}` : `${index + 1}`}
          rightWidth={{ width: '50%' }}
        />
      ))}
    </div>
  );

  return <>{renderPrefectureList()}</>;
};

export default PrefecturesTypeSetting;
