import React from 'react';
import { Radio } from 'antd';
import InputCustom from '../scenarioComon/InputCustom';
import SelectCustom from '../scenarioComon/SelectCustom';

const CardPaymentRadioButtonPreview = ({
  content,
  message,
  indexContent,
}) => {
  const cardPaymentRadioButton = content.card_payment_radio_button;
  return (
    <>
      {
        content.type === 'card_payment_radio_button' && (
          <div style={{ marginBottom: '10px' }}>
            {(cardPaymentRadioButton.title_require || cardPaymentRadioButton.require) &&
              <div className="ss-message__content--user-text-input-top" style={{ marginBottom: '0px' }}>
                {cardPaymentRadioButton.title_require &&
                  <span className="ss-message__content--user-text-input-title">
                    {cardPaymentRadioButton.title}
                  </span>
                }
                {cardPaymentRadioButton.require === true &&
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                }
              </div>
            }
            {cardPaymentRadioButton.type === 'default' &&
              <Radio.Group
                style={{ width: "100%", fontSize: '14px' }}
                onChange={(value) => console.log(value)}
                value={cardPaymentRadioButton.initial_selection}
              >
                {cardPaymentRadioButton.radio_contents && cardPaymentRadioButton.radio_contents.map((itemPayment, indexPayment) => {
             
                  return <Radio value={itemPayment.id} key={indexPayment} style={{ backgroundColor: '#ECF5FA', marginBottom: '5px', padding: '5px', width: '100%' }}>
                    {itemPayment.text}
                  </Radio>
                })}
              </Radio.Group>
            }
            {cardPaymentRadioButton.type === 'customized_style' &&
              <Radio.Group
                style={{ width: "100%", fontSize: '14px' }}
                onChange={(value) => console.log(value)}
                value={cardPaymentRadioButton.initial_selection}
                buttonStyle="solid"
              >
                {cardPaymentRadioButton.radio_contents && cardPaymentRadioButton.radio_contents.map((itemPayment, indexPayment) => {
               
                  return <Radio.Button value={itemPayment.id} key={indexPayment} style={{ backgroundColor: '#ECF5FA', marginBottom: '5px', padding: '5px', width: '100%', textAlign: 'center', lineHeight: '22px' }}>
                    {itemPayment.text}
                  </Radio.Button>
                })}
              </Radio.Group>
            }
            {cardPaymentRadioButton.type === 'picture_radio' && cardPaymentRadioButton.radio_contents_img &&
              cardPaymentRadioButton.radio_contents_img.map((itemPaymentImg, indexPaymentImg) => {
                return <div key={indexPaymentImg} style={{ color: '#6789A6' }}>
                  <Radio.Group
                    style={{ width: "100%", fontSize: '14px', display: 'flex' }}
                    className="ss-user-overview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width"
                    onChange={(value) => console.log(value)}
                    value={cardPaymentRadioButton.initial_selection_picture}
                  >
                    {itemPaymentImg.contents.map((itemPaymentContent, indexContent) => {
                      return <Radio value={`${itemPaymentImg.id}-${itemPaymentContent.id}`} key={indexContent} style={{ marginRight: '0px' }}>
                        <img src={itemPaymentContent.file_url}></img>
                        <div style={{ textAlign: 'center', fontSize: '14px', color: '#6789A6', fontWeight: '700' }}>{itemPaymentContent.text}</div>
                      </Radio>
                    })}
                  </Radio.Group>
                </div>
              })
            }

            {cardPaymentRadioButton.separate_type === false ?
              <div className="ss-user-setting__item-bottom">
                <InputCustom
                  className="ss-user-setting-input-overview"
                  styleLabel={{ width: '100%' }}
                  label="カード番号"
                  inline={false}
                  disabled={true}
                  placeholder={cardPaymentRadioButton.card_number_placeholder}
                />
              </div> :
              <div className="ss-user-setting__item-bottom">
                <div style={{ width: '100%' }}>カード番号</div>
                <div style={{ width: '100%' }} className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type">
                  <InputCustom
                    disabled={true}
                    placeholder={cardPaymentRadioButton.card_number_placeholder1}
                  />
                  <InputCustom
                    disabled={true}
                    placeholder={cardPaymentRadioButton.card_number_placeholder2}
                  />
                  <InputCustom
                    disabled={true}
                    placeholder={cardPaymentRadioButton.card_number_placeholder3}
                  />
                  <InputCustom
                    disabled={true}
                    placeholder={cardPaymentRadioButton.card_number_placeholder4}
                  />
                </div>
              </div>
            }
            {Array.isArray(cardPaymentRadioButton.is_use_installment) && cardPaymentRadioButton.is_use_installment.length > 0 &&
              <div className="ss-user-setting__item-bottom">
                <div style={{ width: '100%' }}>お支払い回数</div>
                  <SelectCustom
                    style={{ width: '100%' }}
                    placeholder="--"
                    value={cardPaymentRadioButton.installment_placeholder}
                    disabled={true}
                  />
              </div>
            }
            
            {cardPaymentRadioButton.is_hide_card_name === false && 
              (cardPaymentRadioButton.separate_name === false ?
                <div className="ss-user-setting__item-bottom">
                <InputCustom
                  className="ss-user-setting-input-overview"
                  styleLabel={{ width: '100%' }}
                  label="カード名義"
                  inline={false}
                  disabled={true}
                  placeholder={cardPaymentRadioButton.card_holder_placeholder}
                />
              </div>
              :
              <>
                <div style={{ width: "100%" }}>カード名義</div>
                <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
                  <InputCustom
                    className="ss-user-setting-input-overview"
                    inline={false}
                    disabled={true}
                    value={cardPaymentRadioButton.card_holder1}
                    placeholder={
                      cardPaymentRadioButton.card_holder_placeholder1
                    }
                  />
                  <InputCustom
                    className="ss-user-setting-input-overview"
                    styleLabel={{ width: "100%" }}
                    inline={false}
                    disabled={true}
                    value={cardPaymentRadioButton.card_holder2}
                    placeholder={
                      cardPaymentRadioButton.card_holder_placeholder2
                    }
                  />
                </div>
              </>
              )
              
            }
            <div className="ss-user-setting__item-bottom">
              <div style={{ width: '100%' }}>有効期限</div>
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <SelectCustom
                  placeholder="年"
                  style={{ width: '49%' }}
                  value={cardPaymentRadioButton.year_placeholder}
                  disabled={true}
                />
                <SelectCustom
                  placeholder="月"
                  style={{ width: '49%' }}
                  value={cardPaymentRadioButton.month_placeholder}
                  disabled={true}
                />
              </div>
            </div>
            {cardPaymentRadioButton.is_hide_cvc === false &&
              <div className="ss-user-setting__item-bottom">
                <InputCustom
                  className="ss-user-setting-input-overview"
                  styleLabel={{ width: '100%' }}
                  label="CVC非表示"
                  inline={false}
                  disabled={true}
                  placeholder={cardPaymentRadioButton.cvc_placeholder}
                />
              </div>
            }
          </div>
        )
      }
    </>
  );
};

export default CardPaymentRadioButtonPreview;
