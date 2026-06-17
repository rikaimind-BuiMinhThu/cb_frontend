import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import SelectCustom from '../../scenarioComon/SelectCustom';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import InputCustom from '../../scenarioComon/InputCustom';
import PaymentDisplayStyleSection from '../../components/paymentDisplayStyle';
import { dropDownTitle } from '../../constants/scenarioFormConstants';
import {
  CARD_PAYMENT_RADIO_TYPE_OPTIONS,
  CARD_PAYMENT_RADIO_SETTING_LABELS,
  SETTING_BUTTON_LABELS,
  SETTING_LABELS,
  SETTING_PLACEHOLDERS,
} from '../../constants/scenarioSettingLabels';
import { buildCardPaymentRadioContext } from './cardPaymentRadioButtonContext';

const CardPaymentCommonHeader = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    onChangeValueMessageContent,
    dataInputVar,
    setIsOpenAddVariable,
  } = props;
  const { cardPaymentRadioButton } = buildCardPaymentRadioContext(props);

  const changeField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, field);

  const renderSaveToVariable = () => (
    <>
      <CheckboxCustom
        label={SETTING_LABELS.saveToVariable}
        onChange={changeField('is_save_input_content')}
        value={cardPaymentRadioButton.is_save_input_content}
      />
      {cardPaymentRadioButton.is_save_input_content && (
        <div className="ss-user-setting__item-bottom">
          <div className="ss-user-setting__item-select-bottom-wrapper-flex">
            <SelectCustom
              className="ss-select--full ss-select--spaced-right"
              value={cardPaymentRadioButton?.save_input_content}
              data={dataInputVar}
              keyValue="variable_name"
              nameValue="variable_name"
              onChange={changeField('save_input_content')}
            />
            <Button className="ss-user-setting__select-btn-add ss-btn--no-margin" onClick={() => setIsOpenAddVariable(true)}>
              {SETTING_BUTTON_LABELS.add}
            </Button>
          </div>
        </div>
      )}
    </>
  );

  const renderLinkedSettingLabel = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-card-payment-radio-setting__linked-title">
        <span>{CARD_PAYMENT_RADIO_SETTING_LABELS.cardLinkedSetting}</span>
      </div>
    </div>
  );

  const renderRequire = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-card-payment-radio-setting__linked-title">
        <CheckboxCustom label={SETTING_LABELS.require} onChange={changeField('require')} value={cardPaymentRadioButton.require} />
      </div>
    </div>
  );

  const renderTitleAndType = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-user-setting__item-select-bottom-wrapper-flex">
        <SelectCustom
          className="ss-setting-row__col-half"
          value={cardPaymentRadioButton.title_require}
          data={dropDownTitle}
          onChange={changeField('title_require')}
        />
        <SelectCustom
          id="type"
          className="ss-setting-row__col-half"
          value={cardPaymentRadioButton.type}
          allowClear={false}
          data={CARD_PAYMENT_RADIO_TYPE_OPTIONS}
          onChange={changeField('type')}
        />
      </div>
    </div>
  );

  const renderDisplayStyle = () => (
    <PaymentDisplayStyleSection
      cardPaymentRadioButton={cardPaymentRadioButton}
      onChange={(value, field) => changeField(field)(value)}
    />
  );

  const renderTitle = () => {
    if (cardPaymentRadioButton?.title_require !== true) return null;
    return (
      <div className="ss-user-setting__item-bottom">
        <InputCustom placeholder={SETTING_PLACEHOLDERS.title} onChange={changeField('title')} value={cardPaymentRadioButton.title} />
      </div>
    );
  };

  return (
    <div className="ss-user-setting__item-text_input-top">
      {renderSaveToVariable()}
      {renderLinkedSettingLabel()}
      {renderRequire()}
      {renderTitleAndType()}
      {renderDisplayStyle()}
      {renderTitle()}
    </div>
  );
};

CardPaymentCommonHeader.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  onChangeValueMessageContent: PropTypes.func.isRequired,
  dataInputVar: PropTypes.array,
  setIsOpenAddVariable: PropTypes.func.isRequired,
};

export default CardPaymentCommonHeader;
