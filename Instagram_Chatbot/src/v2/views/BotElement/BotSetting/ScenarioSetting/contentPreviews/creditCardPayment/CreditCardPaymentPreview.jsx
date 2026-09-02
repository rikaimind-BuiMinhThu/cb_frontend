import React from 'react';
import PropTypes from 'prop-types';
import InputCustom from '../../scenarioCommon/InputCustom';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import { CREDIT_CARD_SETTING_LABELS, PREVIEW_LABELS } from '../../constants/scenarioSettingLabels';
import { CONTENT_SETTING_TYPES } from '../../constants/contentTypeConstants';
import '../../styles/contentPreviews/creditCardPayment.css';

const CreditCardPaymentPreview = ({ content }) => {
  const creditCardPayment = content.credit_card_payment;

  const renderHeader = () => {
    if (!creditCardPayment.title_require && !creditCardPayment.require) return null;
    return (
      <div className="ss-message__content--user-text-input-top ss-credit-card-preview__header">
        {creditCardPayment.title_require && (
          <span className="ss-message__content--user-text-input-title">{creditCardPayment.title}</span>
        )}
        {creditCardPayment.require === true && (
          <span className="ss-message__content--user-text-input-required">{PREVIEW_LABELS.requiredMark}</span>
        )}
      </div>
    );
  };

  const renderCardNumber = () => {
    if (creditCardPayment.separate_type === false) {
      return (
        <div className="ss-user-setting__item-bottom">
          <InputCustom
            className="ss-user-setting-input-overview"
            labelClassName="ss-input-custom-label--full"
            label={CREDIT_CARD_SETTING_LABELS.cardNumber}
            inline={false}
            disabled
            placeholder={creditCardPayment.card_number_placeholder}
          />
        </div>
      );
    }

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-credit-card-preview__card-number-label">{CREDIT_CARD_SETTING_LABELS.cardNumber}</div>
        <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type ss-credit-card-preview__card-number-label">
          <InputCustom disabled placeholder={creditCardPayment.card_number_placeholder1} />
          <InputCustom disabled placeholder={creditCardPayment.card_number_placeholder2} />
          <InputCustom disabled placeholder={creditCardPayment.card_number_placeholder3} />
          <InputCustom disabled placeholder={creditCardPayment.card_number_placeholder4} />
        </div>
      </div>
    );
  };

  const renderCardHolder = () => {
    if (creditCardPayment.is_hide_card_name !== false) return null;
    return (
      <div className="ss-user-setting__item-bottom">
        <InputCustom
          className="ss-user-setting-input-overview"
          labelClassName="ss-input-custom-label--full"
          label={CREDIT_CARD_SETTING_LABELS.cardHolder}
          inline={false}
          disabled
          placeholder={creditCardPayment.card_number_placeholder}
        />
      </div>
    );
  };

  const renderExpiry = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-credit-card-preview__card-number-label">{CREDIT_CARD_SETTING_LABELS.expiry}</div>
      <div className="ss-credit-card-preview__expiry-row">
        <SelectCustom
          placeholder={CREDIT_CARD_SETTING_LABELS.year}
          className="ss-credit-card-preview__expiry-select"
          value={creditCardPayment.year_placeholder}
          disabled
        />
        <SelectCustom
          placeholder={CREDIT_CARD_SETTING_LABELS.month}
          className="ss-credit-card-preview__expiry-select"
          value={creditCardPayment.month_placeholder}
          disabled
        />
      </div>
    </div>
  );

  const renderCvc = () => {
    if (creditCardPayment.is_hide_cvc !== false) return null;
    return (
      <div className="ss-user-setting__item-bottom">
        <InputCustom
          className="ss-user-setting-input-overview"
          labelClassName="ss-input-custom-label--full"
          label={CREDIT_CARD_SETTING_LABELS.cvc}
          inline={false}
          disabled
          placeholder={creditCardPayment.cvc_placeholder}
        />
      </div>
    );
  };

  if (content.type !== CONTENT_SETTING_TYPES.CREDIT_CARD_PAYMENT) return null;

  return (
    <div className="ss-credit-card-preview__wrapper">
      {renderHeader()}
      {renderCardNumber()}
      {renderCardHolder()}
      {renderExpiry()}
      {renderCvc()}
    </div>
  );
};

CreditCardPaymentPreview.propTypes = {
  content: PropTypes.object.isRequired,
};

export default CreditCardPaymentPreview;
