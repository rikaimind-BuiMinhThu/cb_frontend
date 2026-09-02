import React from 'react';
import PropTypes from 'prop-types';
import ContentSettingShell from '../shared/ContentSettingShell';
import {
  AddressFieldSettingsModal,
  AddressFieldsGroup,
} from '../shared/addressFields';
import '../../styles/contentSettings/zipCodeAddress.css';
import '../../styles/contentSettings/addressFields.css';

const ZipCodeAddressSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    zipCodeAddress,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    renderRootFaqOption,
    dataInputVar,
    setIsOpenAddVariable,
  } = props;

  return (
    <ContentSettingShell
      contentType="zip_code_address"
      contentData={zipCodeAddress}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
      className="ss-zip-code-address-setting"
    >
      <AddressFieldSettingsModal {...props} showDisplayAddressField />
      <div className="ss-zip-code-address-setting__fields">
        <AddressFieldsGroup {...props} labelMode="editable" showRemoveIcon={false} />
      </div>
    </ContentSettingShell>
  );
};

ZipCodeAddressSetting.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  zipCodeAddress: PropTypes.object,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
  onChangeValueMessageContent: PropTypes.func.isRequired,
  renderRootFaqOption: PropTypes.func,
  dataInputVar: PropTypes.array,
  setIsOpenAddVariable: PropTypes.func.isRequired,
  handleRemoveItemZipCodeAddress: PropTypes.func.isRequired,
  dataPrefectures: PropTypes.array,
  isUseFukushashiki: PropTypes.bool,
};

export default ZipCodeAddressSetting;
