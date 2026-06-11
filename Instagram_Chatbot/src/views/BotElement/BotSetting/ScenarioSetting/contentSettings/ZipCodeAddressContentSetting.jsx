import React from 'react';
import ZipCodeAddressSetting from '../Settings/ZipCodeAddressSetting';
import { useScenarioContentSettingProps } from '../hooks/useScenarioContentSettingProps';

const ZipCodeAddressContentSetting = ({ indexMessageSelect, indexContent, content }) => {
  const props = useScenarioContentSettingProps(indexMessageSelect, indexContent, content);
  return (
    <ZipCodeAddressSetting
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      contentType={content.type}
      zipCodeAddress={props.zipCodeAddress}
      dataMessages={props.dataMessages}
      setDataMessages={props.setDataMessages}
      dataInputVar={props.dataInputVar}
      dataPrefectures={props.dataPrefectures}
      isUseFukushashiki={props.isUseFukushashiki}
      setIsOpenAddVariable={props.setIsOpenAddVariable}
      onChangeValueMessageContent={props.onChangeValueMessageContent}
      handleRemoveItemZipCodeAddress={props.handleRemoveItemZipCodeAddress}
      renderRootFaqOption={props.renderRootFaqOption}
    />
  );
};

export default ZipCodeAddressContentSetting;
