import React from 'react';
import PropTypes from 'prop-types';
import { SHIPPING_ADDRESS_TYPES, CONTENT_SETTING_TYPES } from '../../constants/contentTypeConstants';
import ContentSettingShell from '../shared/ContentSettingShell';
import DefaultTypeSetting from './DefaultTypeSetting';
import PictureRadioTypeSetting from './PictureRadioTypeSetting';
import ShippingAddressAddButton from './ShippingAddressAddButton';
import '../../styles/contentSettings/shippingAddress.css';

const ShippingAddressSetting = (props) => {
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

  const shippingAddress = content.shipping_address;

  const renderTypeBody = () => {
    switch (shippingAddress.type) {
      case SHIPPING_ADDRESS_TYPES.PICTURE_RADIO:
        return <PictureRadioTypeSetting {...props} />;
      case SHIPPING_ADDRESS_TYPES.DEFAULT:
      default:
        return <DefaultTypeSetting {...props} />;
    }
  };

  return (
    <ContentSettingShell
      contentType={CONTENT_SETTING_TYPES.SHIPPING_ADDRESS}
      contentData={shippingAddress}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
      className="ss-shipping-address-setting"
    >
      <div className="ss-user-setting__item-text_input-top">
        <div className="ss-user-setting__item-bottom ss-shipping-address-setting__type-row">
          {renderTypeBody()}
        </div>
        <ShippingAddressAddButton {...props} />
      </div>
    </ContentSettingShell>
  );
};

ShippingAddressSetting.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
  onChangeValueMessageContent: PropTypes.func.isRequired,
  renderRootFaqOption: PropTypes.func,
  dataInputVar: PropTypes.array,
  setIsOpenAddVariable: PropTypes.func.isRequired,
  handleDragEndRadioCheckbox: PropTypes.func.isRequired,
  handleChangeValueRequireZipCode: PropTypes.func.isRequired,
  handleRemoveItemZipCodeAddress: PropTypes.func.isRequired,
  dataPrefectures: PropTypes.array,
};

export default ShippingAddressSetting;
