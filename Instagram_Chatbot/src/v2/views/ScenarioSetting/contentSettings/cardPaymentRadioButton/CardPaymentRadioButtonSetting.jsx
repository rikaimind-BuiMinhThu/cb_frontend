import React from 'react';
import PropTypes from 'prop-types';
import { CARD_PAYMENT_RADIO_TYPES, CONTENT_SETTING_TYPES } from '../../constants/contentTypeConstants';
import ContentSettingShell from '../shared/ContentSettingShell';
import CardPaymentCommonHeader from './CardPaymentCommonHeader';
import DefaultTypeSetting from './DefaultTypeSetting';
import CustomizedStyleTypeSetting from './CustomizedStyleTypeSetting';
import PictureRadioTypeSetting from './PictureRadioTypeSetting';
import CardPaymentAddButton from './CardPaymentAddButton';
import '../../styles/contentSettings/cardPaymentRadioButton.css';

const CardPaymentRadioButtonSetting = (props) => {
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

  const cardPaymentRadioButton = content.card_payment_radio_button;

  const renderTypeBody = () => {
    switch (cardPaymentRadioButton.type) {
      case CARD_PAYMENT_RADIO_TYPES.DEFAULT:
        return <DefaultTypeSetting {...props} />;
      case CARD_PAYMENT_RADIO_TYPES.CUSTOMIZED_STYLE:
        return <CustomizedStyleTypeSetting {...props} />;
      case CARD_PAYMENT_RADIO_TYPES.PICTURE_RADIO:
        return <PictureRadioTypeSetting {...props} />;
      default:
        return null;
    }
  };

  return (
    <ContentSettingShell
      contentType={CONTENT_SETTING_TYPES.CARD_PAYMENT_RADIO_BUTTON}
      contentData={cardPaymentRadioButton}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
      className="ss-card-payment-radio-setting"
    >
      <CardPaymentCommonHeader {...props} />
      <div className="ss-user-setting__item-bottom ss-card-payment-radio-setting__type-row">
        {renderTypeBody()}
      </div>
      <CardPaymentAddButton {...props} />
    </ContentSettingShell>
  );
};

CardPaymentRadioButtonSetting.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
  onChangeValueMessageContent: PropTypes.func.isRequired,
  renderRootFaqOption: PropTypes.func,
  dataInputVar: PropTypes.array,
  setIsOpenAddVariable: PropTypes.func.isRequired,
};

export default CardPaymentRadioButtonSetting;
