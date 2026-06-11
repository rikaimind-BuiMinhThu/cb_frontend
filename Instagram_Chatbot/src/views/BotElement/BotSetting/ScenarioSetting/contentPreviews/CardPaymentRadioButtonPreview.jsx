import React from 'react';
import { Radio } from 'antd';
import InputCustom from '../scenarioComon/InputCustom';
import SelectCustom from '../scenarioComon/SelectCustom';

const PreviewTitle = ({ data }) => {
  if (!data.title_require && !data.require) return null;
  return (
    <div className="ss-message__content--user-text-input-top" style={{ marginBottom: '0px' }}>
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
        style={{ width: '100%', fontSize: '14px' }}
        onChange={(value) => console.log(value)}
        value={data.initial_selection}
      >
        {data.radio_contents && data.radio_contents.map((itemPayment, indexPayment) => (
          <Radio
            value={itemPayment.id}
            key={indexPayment}
            style={{ backgroundColor: '#ECF5FA', marginBottom: '5px', padding: '5px', width: '100%' }}
          >
            {itemPayment.text}
          </Radio>
        ))}
      </Radio.Group>
    }
    {data.type === 'customized_style' &&
      <Radio.Group
        style={{ width: '100%', fontSize: '14px' }}
        onChange={(value) => console.log(value)}
        value={data.initial_selection}
        buttonStyle="solid"
      >
        {data.radio_contents && data.radio_contents.map((itemPayment, indexPayment) => (
          <Radio.Button
            value={itemPayment.id}
            key={indexPayment}
            style={{ backgroundColor: '#ECF5FA', marginBottom: '5px', padding: '5px', width: '100%', textAlign: 'center', lineHeight: '22px' }}
          >
            {itemPayment.text}
          </Radio.Button>
        ))}
      </Radio.Group>
    }
    {data.type === 'picture_radio' && data.radio_contents_img &&
      data.radio_contents_img.map((itemPaymentImg, indexPaymentImg) => (
        <div key={indexPaymentImg} style={{ color: '#6789A6' }}>
          <Radio.Group
            style={{ width: '100%', fontSize: '14px', display: 'flex' }}
            className="ss-user-overview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width"
            onChange={(value) => console.log(value)}
            value={data.initial_selection_picture}
          >
            {itemPaymentImg.contents.map((itemPaymentContent, indexContent) => (
              <Radio
                value={`${itemPaymentImg.id}-${itemPaymentContent.id}`}
                key={indexContent}
                style={{ marginRight: '0px' }}
              >
                <img src={itemPaymentContent.file_url}></img>
                <div style={{ textAlign: 'center', fontSize: '14px', color: '#6789A6', fontWeight: '700' }}>
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
      <div style={{ width: '100%' }}>カード番号</div>
      <div style={{ width: '100%' }} className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type">
        <InputCustom disabled={true} placeholder={data.card_number_placeholder1} />
        <InputCustom disabled={true} placeholder={data.card_number_placeholder2} />
        <InputCustom disabled={true} placeholder={data.card_number_placeholder3} />
        <InputCustom disabled={true} placeholder={data.card_number_placeholder4} />
      </div>
    </div>
  )
);

const InstallmentField = ({ data }) => {
  if (!Array.isArray(data.is_use_installment) || data.is_use_installment.length === 0) return null;
  return (
    <div className="ss-user-setting__item-bottom">
      <div style={{ width: '100%' }}>お支払い回数</div>
      <SelectCustom
        style={{ width: '100%' }}
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
      <div style={{ width: '100%' }}>カード名義</div>
      <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
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
    <div style={{ width: '100%' }}>有効期限</div>
    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
      <SelectCustom
        placeholder="年"
        style={{ width: '49%' }}
        value={data.year_placeholder}
        disabled={true}
      />
      <SelectCustom
        placeholder="月"
        style={{ width: '49%' }}
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
    <div style={{ marginBottom: '10px' }}>
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
