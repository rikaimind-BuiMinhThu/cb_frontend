import '../../styles/contentPreviews/cardPaymentRadioButton.css';
import '../../styles/base/preview-common.css';
import React from 'react';
import { Radio } from 'antd';
import InputCustom from '../../scenarioComon/InputCustom';
import SelectCustom from '../../scenarioComon/SelectCustom';

const PreviewTitle = ({ data }) => {
  if (!data.title_require && !data.require) return null;
  return (
    <div className="ss-message__content--user-text-input-top ss-content-preview__header--no-mb">
      {data.title_require &&
        <span className="ss-message__content--user-text-input-title">
          {data.title}
        </span>
      }
      {data.require === true &&
        <span className="ss-message__content--user-text-input-required">
          ※必須
        </span>
      }
    </div>
  );
};

const RadioOptions = ({ data }) => (
  <>
    {data.type === 'default' &&
      <Radio.Group
        className="ss-content-preview__radio-group"
        onChange={(value) => console.log(value)}
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
    }
    {data.type === 'customized_style' &&
      <Radio.Group
        className="ss-content-preview__radio-group"
        onChange={(value) => console.log(value)}
        value={data.initial_selection}
        buttonStyle="solid"
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
    }
    {data.type === 'picture_radio' && data.radio_contents_img &&
      data.radio_contents_img.map((itemPaymentImg, indexPaymentImg) => (
        <div key={indexPaymentImg} className="ss-content-preview__picture-radio">
          <Radio.Group
            className="ss-content-preview__radio-group--flex ss-user-overview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width"

            onChange={(value) => console.log(value)}
            value={data.initial_selection_picture}
          >
            {itemPaymentImg.contents.map((itemPaymentContent, indexContent) => (
              <Radio
                value={`${itemPaymentImg.id}-${itemPaymentContent.id}`}
                key={indexContent}
                className="ss-content-preview__picture-radio-item"
              >
                <img src={itemPaymentContent.file_url} alt={itemPaymentContent.text || ""}></img>
                <div className="ss-content-preview__picture-radio-caption">
                  {itemPaymentContent.text}
                </div>
              </Radio>
            ))}
          </Radio.Group>
        </div>
      ))
    }
  </>
);

const CardNumberField = ({ data }) => (
  data.separate_type === false ? (
    <div className="ss-user-setting__item-bottom">
      <InputCustom
        className="ss-user-setting-input-overview"
        styleLabel={{ width: '100%' }}
        label="カード番号"
        inline={false}
        disabled={true}
        placeholder={data.card_number_placeholder}
      />
    </div>
  ) : (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-content-preview__field-label--full">カード番号</div>
      <div className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type">
        <InputCustom disabled={true} placeholder={data.card_number_placeholder1} className="ss-user-setting-input-overview" />
        <InputCustom disabled={true} placeholder={data.card_number_placeholder2} className="ss-user-setting-input-overview" />
        <InputCustom disabled={true} placeholder={data.card_number_placeholder3} className="ss-user-setting-input-overview" />
        <InputCustom disabled={true} placeholder={data.card_number_placeholder4} className="ss-user-setting-input-overview" />
      </div>
    </div>
  )
);

const InstallmentField = ({ data }) => {
  if (!Array.isArray(data.is_use_installment) || data.is_use_installment.length === 0) return null;
  return (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-content-preview__field-label--full">お支払い回数</div>
      <SelectCustom
        className="ss-select--full"
        placeholder="--"
        value={data.installment_placeholder}
        disabled={true}
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
        styleLabel={{ width: '100%' }}
        label="カード名義"
        inline={false}
        disabled={true}
        placeholder={data.card_holder_placeholder}
      />
    </div>
  ) : (
    <>
      <div className="ss-content-preview__field-label--full">カード名義</div>
      <div className="ss-content-preview__field-row">
        <InputCustom
          className="ss-user-setting-input-overview"
          inline={false}
          disabled={true}
          value={data.card_holder1}
          placeholder={data.card_holder_placeholder1}
        />
        <InputCustom
          className="ss-user-setting-input-overview"
          styleLabel={{ width: '100%' }}
          inline={false}
          disabled={true}
          value={data.card_holder2}
          placeholder={data.card_holder_placeholder2}
        />
      </div>
    </>
  );
};

const ExpiryField = ({ data }) => (
  <div className="ss-user-setting__item-bottom">
    <div className="ss-content-preview__field-label--full">有効期限</div>
    <div className="ss-content-preview__expiry-row">
      <SelectCustom
        placeholder="年"
        className="ss-select--half"
        value={data.year_placeholder}
        disabled={true}
      />
      <SelectCustom
        placeholder="月"
        className="ss-select--half"
        value={data.month_placeholder}
        disabled={true}
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
        styleLabel={{ width: '100%' }}
        label="CVC非表示"
        inline={false}
        disabled={true}
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
