import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import SelectCustom from '../../scenarioComon/SelectCustom';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import InputCustom from '../../scenarioComon/InputCustom';
import CheckboxGroupCustom from '../../scenarioComon/CheckboxGroupCustom';
import { dropDownTitle, dataPaymentMethod, dataYearFixed, dataMonthFixed, installmentOptions } from '../../constants/scenarioFormConstants';
import {
  CREDIT_CARD_EXPIRY_TYPE_OPTIONS,
  CREDIT_CARD_SETTING_LABELS,
  SETTING_BUTTON_LABELS,
  SETTING_LABELS,
  SETTING_PLACEHOLDERS,
} from '../../constants/scenarioSettingLabels';
import { CONTENT_SETTING_TYPES } from '../../constants/contentTypeConstants';
import ContentSettingShell from '../shared/ContentSettingShell';
import CreditCardFukushashikiField from './shared/CreditCardFukushashikiField';
import { buildCreditCardPaymentContext } from './creditCardPaymentContext';
import '../../styles/contentSettings/creditCardPayment.css';

const CreditCardPaymentSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    renderRootFaqOption,
    dataInputVar,
    setIsOpenAddVariable,
    isUseFukushashiki,
  } = props;

  const {
    creditCardPayment,
    changeField,
    changeMessageContentField,
    getMessageContentField,
  } = buildCreditCardPaymentContext(props);

  const renderSaveToVariable = () => (
    <>
      <CheckboxCustom
        label={SETTING_LABELS.saveToVariable}
        onChange={changeField('is_save_input_content')}
        value={creditCardPayment.is_save_input_content}
      />
      {creditCardPayment.is_save_input_content && (
        <div className="ss-user-setting__item-bottom">
          <div className="ss-user-setting__item-select-bottom-wrapper-flex">
            <SelectCustom
              className="ss-select--full ss-select--spaced-right"
              value={creditCardPayment?.save_input_content}
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

  const renderRequire = () => (
    <CheckboxCustom
      label={SETTING_LABELS.require}
      onChange={changeField('require')}
      value={creditCardPayment.require}
    />
  );

  const renderOptionToggles = () => (
    <>
      <div className="ss-user-setting__item-text_input-use-api-wrapper">
        <div>
          <CheckboxCustom
            label={CREDIT_CARD_SETTING_LABELS.hideCvc}
            onChange={changeField('is_hide_cvc')}
            value={creditCardPayment.is_hide_cvc}
          />
        </div>
        <div className="ss-user-setting__item-text_input-use-api-required">
          <CheckboxCustom
            label={CREDIT_CARD_SETTING_LABELS.hideCardName}
            onChange={changeField('is_hide_card_name')}
            value={creditCardPayment.is_hide_card_name}
          />
        </div>
        <div className="ss-user-setting__item-text_input-use-api-required">
          <CheckboxCustom
            label={CREDIT_CARD_SETTING_LABELS.installment}
            onChange={changeField('is_use_installment')}
            value={creditCardPayment.is_use_installment}
          />
        </div>
      </div>
      <div className="ss-user-setting__item-text_input-use-api-wrapper">
        <div>
          <CheckboxCustom
            label={CREDIT_CARD_SETTING_LABELS.separateType}
            onChange={changeField('separate_type')}
            value={creditCardPayment.separate_type}
          />
        </div>
        <div className="ss-user-setting__item-text_input-use-api-required ss-credit-card-setting__separate-name-offset">
          <CheckboxCustom
            label={CREDIT_CARD_SETTING_LABELS.validityCheck}
            onChange={changeField('validity_check')}
            value={creditCardPayment.validity_check}
          />
        </div>
        <div className="ss-user-setting__item-text_input-use-api-required ss-credit-card-setting__expiry-row">
          <span className="ss-credit-card-setting__expiry-label">{CREDIT_CARD_SETTING_LABELS.expiryFormat}</span>
          <SelectCustom
            className="ss-credit-card-setting__expiry-select"
            allowClear={false}
            value={creditCardPayment.type_date_of_expiry}
            data={CREDIT_CARD_EXPIRY_TYPE_OPTIONS}
            onChange={changeField('type_date_of_expiry')}
          />
        </div>
      </div>
    </>
  );

  const renderTitleRequire = () => (
    <div className="ss-user-setting__item-bottom">
      <SelectCustom
        value={creditCardPayment.title_require}
        data={dropDownTitle}
        onChange={changeField('title_require')}
      />
    </div>
  );

  const renderTitle = () => {
    if (creditCardPayment?.title_require !== true) return null;
    return (
      <div className="ss-user-setting__item-bottom">
        <InputCustom
          placeholder={SETTING_PLACEHOLDERS.title}
          onChange={changeField('title')}
          value={creditCardPayment.title}
        />
      </div>
    );
  };

  const renderPaymentMethods = () => (
    <div className="ss-user-setting__item-bottom">
      <CheckboxGroupCustom
        className="ss-credit-card-setting__payment-method"
        value={creditCardPayment.payment_method}
        onChange={changeField('payment_method')}
        data={dataPaymentMethod}
      />
    </div>
  );

  const renderCardNumber = () => {
    if (creditCardPayment.separate_type === false) {
      return (
        <div className="ss-user-setting__item-bottom">
          <InputCustom
            styleLabel={{ width: '90%' }}
            label={CREDIT_CARD_SETTING_LABELS.cardNumber}
            inline={false}
            placeholder={CREDIT_CARD_SETTING_LABELS.placeholder}
            value={creditCardPayment.card_number_placeholder}
            onChange={changeField('card_number_placeholder')}
          />
          <CreditCardFukushashikiField
            prefix="card_number"
            isUseFukushashiki={isUseFukushashiki}
            getMessageContentField={getMessageContentField}
            changeMessageContentField={changeMessageContentField}
          />
        </div>
      );
    }

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-credit-card-setting__field-block">{CREDIT_CARD_SETTING_LABELS.cardNumber}</div>
        <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type">
          <InputCustom
            placeholder={CREDIT_CARD_SETTING_LABELS.placeholder}
            value={creditCardPayment.card_number_placeholder1}
            onChange={changeField('card_number_placeholder1')}
          />
          <InputCustom
            placeholder={CREDIT_CARD_SETTING_LABELS.placeholder}
            value={creditCardPayment.card_number_placeholder2}
            onChange={changeField('card_number_placeholder2')}
          />
          <InputCustom
            placeholder={CREDIT_CARD_SETTING_LABELS.placeholder}
            value={creditCardPayment.card_number_placeholder3}
            onChange={changeField('card_number_placeholder3')}
          />
          <InputCustom
            placeholder={CREDIT_CARD_SETTING_LABELS.placeholder}
            value={creditCardPayment.card_number_placeholder4}
            onChange={changeField('card_number_placeholder4')}
          />
        </div>
      </div>
    );
  };

  const renderCardHolder = () => (
    <div className="ss-user-setting__item-bottom">
      <InputCustom
        styleLabel={{ width: '90%' }}
        label={CREDIT_CARD_SETTING_LABELS.cardHolder}
        inline={false}
        placeholder={CREDIT_CARD_SETTING_LABELS.placeholder}
        value={creditCardPayment.card_holder_placeholder}
        onChange={changeField('card_holder_placeholder')}
      />
      <CreditCardFukushashikiField
        prefix="card_holder"
        isUseFukushashiki={isUseFukushashiki}
        getMessageContentField={getMessageContentField}
        changeMessageContentField={changeMessageContentField}
      />
    </div>
  );

  const renderExpiry = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-credit-card-setting__field-block">{CREDIT_CARD_SETTING_LABELS.expiry}</div>
      <div className="ss-credit-card-setting__year-block">
        <SelectCustom
          placeholder={CREDIT_CARD_SETTING_LABELS.year}
          className="ss-select--full"
          value={creditCardPayment.year_placeholder}
          data={dataYearFixed.filter((item) => item.key >= new Date().getFullYear() && item.key <= (new Date().getFullYear() + 10))}
          onChange={changeField('year_placeholder')}
        />
        <CreditCardFukushashikiField
          prefix="year"
          isUseFukushashiki={isUseFukushashiki}
          getMessageContentField={getMessageContentField}
          changeMessageContentField={changeMessageContentField}
        />
      </div>
      <div className="ss-credit-card-setting__month-block">
        <SelectCustom
          placeholder={CREDIT_CARD_SETTING_LABELS.month}
          className="ss-select--full"
          value={creditCardPayment.month_placeholder}
          data={dataMonthFixed}
          onChange={changeField('month_placeholder')}
        />
        <CreditCardFukushashikiField
          prefix="month"
          isUseFukushashiki={isUseFukushashiki}
          getMessageContentField={getMessageContentField}
          changeMessageContentField={changeMessageContentField}
        />
      </div>
    </div>
  );

  const renderCvc = () => (
    <div className="ss-user-setting__item-bottom">
      <InputCustom
        styleLabel={{ width: '90%' }}
        label={CREDIT_CARD_SETTING_LABELS.cvc}
        inline={false}
        placeholder={CREDIT_CARD_SETTING_LABELS.placeholder}
        value={creditCardPayment.cvc_placeholder}
        onChange={changeField('cvc_placeholder')}
      />
      <CreditCardFukushashikiField
        prefix="cvc"
        isUseFukushashiki={isUseFukushashiki}
        getMessageContentField={getMessageContentField}
        changeMessageContentField={changeMessageContentField}
      />
    </div>
  );

  const renderInstallment = () => {
    if (!creditCardPayment.is_use_installment) return null;
    return (
      <div className="ss-user-setting__item-bottom">
        <SelectCustom
          styleLabel={{ width: '90%' }}
          label={CREDIT_CARD_SETTING_LABELS.installmentCount}
          inline={false}
          placeholder={CREDIT_CARD_SETTING_LABELS.placeholder}
          data={installmentOptions}
          value={creditCardPayment.installment_placeholder}
          onChange={changeField('installment_placeholder')}
        />
        <CreditCardFukushashikiField
          prefix="installment"
          isUseFukushashiki={isUseFukushashiki}
          getMessageContentField={getMessageContentField}
          changeMessageContentField={changeMessageContentField}
        />
      </div>
    );
  };

  return (
    <ContentSettingShell
      contentType={CONTENT_SETTING_TYPES.CREDIT_CARD_PAYMENT}
      contentData={creditCardPayment}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
      className="ss-credit-card-setting"
    >
      <div className="ss-user-setting__item-text_input-top">
        {renderSaveToVariable()}
        {renderRequire()}
        {renderOptionToggles()}
      </div>
      {renderTitleRequire()}
      {renderTitle()}
      {renderPaymentMethods()}
      {renderCardNumber()}
      {renderCardHolder()}
      {renderExpiry()}
      {renderCvc()}
      {renderInstallment()}
    </ContentSettingShell>
  );
};

CreditCardPaymentSetting.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
  onChangeValueMessageContent: PropTypes.func.isRequired,
  renderRootFaqOption: PropTypes.func,
  dataInputVar: PropTypes.array,
  setIsOpenAddVariable: PropTypes.func.isRequired,
  isUseFukushashiki: PropTypes.bool,
};

export default CreditCardPaymentSetting;
