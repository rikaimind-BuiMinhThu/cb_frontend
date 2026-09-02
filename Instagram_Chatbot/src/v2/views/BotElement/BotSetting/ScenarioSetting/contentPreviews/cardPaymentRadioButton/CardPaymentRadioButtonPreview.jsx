import React from 'react';
import { Radio } from 'antd';
import InputCustom from '../../scenarioComon/InputCustom';
import SelectCustom from '../../scenarioComon/SelectCustom';
import {
  PREVIEW_LABELS,
  CREDIT_CARD_SETTING_LABELS,
} from '../../constants/scenarioSettingLabels';
import { CARD_PAYMENT_RADIO_TYPES } from '../../constants/contentTypeConstants';
import '../../styles/contentPreviews/cardPaymentRadioButton.css';
import '../../styles/base/preview-common.css';

const ANTD_BUTTON_STYLE_SOLID = 'solid';

const PreviewTitle = ({ data }) => {
  if (!data.title_require && !data.require) return null;
  return (
    <div className="ss-message__content--user-text-input-top ss-content-preview__header--no-mb">
      {data.title_require && (
        <span className="ss-message__content--user-text-input-title">
          {data.title}
        </span>
      )}
      {data.require === true && (
        <span className="ss-message__content--user-text-input-required">
          {PREVIEW_LABELS.requiredMark}
        </span>
      )}
    </div>
  );
};

const RadioOptions = ({ data }) => (
  <>
    {data.type === CARD_PAYMENT_RADIO_TYPES.DEFAULT && (
      <Radio.Group
        className="ss-content-preview__radio-group"
        value={data.initial_selection}
      >
        {data.radio_contents && data.radio_contents.map((itemPayment, indexPayment) => (
          <Radio
            value={itemPayment.id}
            key={indexPayment}
            className="ss-content-preview__radio-option"
          >
            {itemPayment.text}
          </Radio>
        ))}
      </Radio.Group>
    )}
    {data.type === CARD_PAYMENT_RADIO_TYPES.CUSTOMIZED_STYLE && (
      <Radio.Group
        className="ss-content-preview__radio-group"
        value={data.initial_selection}
        buttonStyle={ANTD_BUTTON_STYLE_SOLID}
      >
        {data.radio_contents && data.radio_contents.map((itemPayment, indexPayment) => (
          <Radio.Button
            value={itemPayment.id}
            key={indexPayment}
            className="ss-content-preview__radio-option--centered"
          >
            {itemPayment.text}
          </Radio.Button>
        ))}
      </Radio.Group>
    )}
    {data.type === CARD_PAYMENT_RADIO_TYPES.PICTURE_RADIO && data.radio_contents_img && (
      data.radio_contents_img.map((itemPaymentImg, indexPaymentImg) => (
        <div key={indexPaymentImg} className="ss-content-preview__picture-radio">
          <Radio.Group
            className="ss-content-preview__radio-group--flex ss-user-overview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width"
            value={data.initial_selection_picture}
          >
            {itemPaymentImg.contents.map((itemPaymentContent, indexContent) => (
              <Radio
                value={`${itemPaymentImg.id}-${itemPaymentContent.id}`}
                key={indexContent}
                className="ss-content-preview__picture-radio-item"
              >
                <img src={itemPaymentContent.file_url} alt={itemPaymentContent.text} />
                <div className="ss-content-preview__picture-radio-caption">
                  {itemPaymentContent.text}
                </div>
              </Radio>
            ))}
          </Radio.Group>
        </div>
      ))
    )}
  </>
);

const CardNumberField = ({ data }) => (
  data.separate_type === false ? (
    <div className="ss-user-setting__item-bottom">
      <InputCustom
        className="ss-user-setting-input-overview"
        labelClassName="ss-input-custom-label--full"
        label={CREDIT_CARD_SETTING_LABELS.cardNumber}
        inline={false}
        disabled
        placeholder={data.card_number_placeholder}
      />
    </div>
  ) : (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-content-preview__field-label--full">{CREDIT_CARD_SETTING_LABELS.cardNumber}</div>
      <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type">
        <InputCustom disabled placeholder={data.card_number_placeholder1} className="ss-user-setting-input-overview" />
        <InputCustom disabled placeholder={data.card_number_placeholder2} className="ss-user-setting-input-overview" />
        <InputCustom disabled placeholder={data.card_number_placeholder3} className="ss-user-setting-input-overview" />
        <InputCustom disabled placeholder={data.card_number_placeholder4} className="ss-user-setting-input-overview" />
      </div>
    </div>
  )
);

const InstallmentField = ({ data }) => {
  if (!Array.isArray(data.is_use_installment) || data.is_use_installment.length === 0) return null;
  return (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-content-preview__field-label--full">{CREDIT_CARD_SETTING_LABELS.installmentCount}</div>
      <SelectCustom
        className="ss-select--full"
        placeholder={PREVIEW_LABELS.dashPlaceholder}
        value={data.installment_placeholder}
        disabled
      />
    </div>
  );
};

const CardHolderField = ({ data }) => {
  if (data.is_hide_card_name !== false) return null;
  return data.separate_name === false ? (
    <div className="ss-user-setting__item-bottom">
      <InputCustom
        className="ss-user-setting-input-overview"
        labelClassName="ss-input-custom-label--full"
        label={CREDIT_CARD_SETTING_LABELS.cardHolder}
        inline={false}
        disabled
        placeholder={data.card_holder_placeholder}
      />
    </div>
  ) : (
    <>
      <div className="ss-content-preview__field-label--full">{CREDIT_CARD_SETTING_LABELS.cardHolder}</div>
      <div className="ss-content-preview__field-row">
        <InputCustom
          className="ss-user-setting-input-overview"
          inline={false}
          disabled
          value={data.card_holder1}
          placeholder={data.card_holder_placeholder1}
        />
        <InputCustom
          className="ss-user-setting-input-overview"
          labelClassName="ss-input-custom-label--full"
          inline={false}
          disabled
          value={data.card_holder2}
          placeholder={data.card_holder_placeholder2}
        />
      </div>
    </>
  );
};

const ExpiryField = ({ data }) => (
  <div className="ss-user-setting__item-bottom">
    <div className="ss-content-preview__field-label--full">{CREDIT_CARD_SETTING_LABELS.expiry}</div>
    <div className="ss-content-preview__expiry-row">
      <SelectCustom
        placeholder={CREDIT_CARD_SETTING_LABELS.year}
        className="ss-select--half"
        value={data.year_placeholder}
        disabled
      />
      <SelectCustom
        placeholder={CREDIT_CARD_SETTING_LABELS.month}
        className="ss-select--half"
        value={data.month_placeholder}
        disabled
      />
    </div>
  </div>
);

const CvcField = ({ data }) => {
  if (data.is_hide_cvc !== false) return null;
  return (
    <div className="ss-user-setting__item-bottom">
      <InputCustom
        className="ss-user-setting-input-overview"
        labelClassName="ss-input-custom-label--full"
        label={CREDIT_CARD_SETTING_LABELS.cvc}
        inline={false}
        disabled
        placeholder={data.cvc_placeholder}
      />
    </div>
  );
};

const CardPaymentRadioButtonPreview = ({ content }) => {
  const data = content.card_payment_radio_button;
  return (
    <div className="ss-content-preview">
      <PreviewTitle data={data} />
      <RadioOptions data={data} />
      <CardNumberField data={data} />
      <InstallmentField data={data} />
      <CardHolderField data={data} />
      <ExpiryField data={data} />
      <CvcField data={data} />
    </div>
  );
};

export default CardPaymentRadioButtonPreview;
