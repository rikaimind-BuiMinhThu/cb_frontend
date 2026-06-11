import React from 'react';
import InputCustom from '../scenarioComon/InputCustom';
import SelectCustom from '../scenarioComon/SelectCustom';

const CreditCardPaymentPreview = ({
  content,
  message,
  indexContent,
}) => {
  const creditCardPayment = content.credit_card_payment;
  return (
    <>
      {
        content.type === 'credit_card_payment' && (
          <div style={{ marginBottom: '10px' }}>
            {(creditCardPayment.title_require || creditCardPayment.require) &&
              <div className="ss-message__content--user-text-input-top" style={{ marginBottom: '0px' }}>
                {creditCardPayment.title_require &&
                  <span className="ss-message__content--user-text-input-title">
                    {creditCardPayment.title}
                  </span>
                }
                {creditCardPayment.require === true &&
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                }
              </div>
            }
            {creditCardPayment.separate_type === false ?
              <div className="ss-user-setting__item-bottom">
                <InputCustom
                  className="ss-user-setting-input-overview"
                  styleLabel={{ width: '100%' }}
                  label="カード番号"
                  inline={false}
                  disabled={true}
                  placeholder={creditCardPayment.card_number_placeholder}
                />
              </div> :
              <div className="ss-user-setting__item-bottom">
                <div style={{ width: '100%' }}>カード番号</div>
                <div style={{ width: '100%' }} className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type">
                  <InputCustom
                    disabled={true}
                    placeholder={creditCardPayment.card_number_placeholder1}
                  />
                  <InputCustom
                    disabled={true}
                    placeholder={creditCardPayment.card_number_placeholder2}
                  />
                  <InputCustom
                    disabled={true}
                    placeholder={creditCardPayment.card_number_placeholder3}
                  />
                  <InputCustom
                    disabled={true}
                    placeholder={creditCardPayment.card_number_placeholder4}
                  />
                </div>
              </div>
            }
            {creditCardPayment.is_hide_card_name === false &&
              <div className="ss-user-setting__item-bottom">
                <InputCustom
                  className="ss-user-setting-input-overview"
                  styleLabel={{ width: '100%' }}
                  label="カード名義"
                  inline={false}
                  disabled={true}
                  placeholder={creditCardPayment.card_number_placeholder}
                />
              </div>
            }
            <div className="ss-user-setting__item-bottom">
              <div style={{ width: '100%' }}>有効期限</div>
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <SelectCustom
                  placeholder="年"
                  style={{ width: '49%' }}
                  value={creditCardPayment.year_placeholder}
                  disabled={true}
                />
                <SelectCustom
                  placeholder="月"
                  style={{ width: '49%' }}
                  value={creditCardPayment.month_placeholder}
                  disabled={true}
                />
              </div>
            </div>
            {creditCardPayment.is_hide_cvc === false &&
              <div className="ss-user-setting__item-bottom">
                <InputCustom
                  className="ss-user-setting-input-overview"
                  styleLabel={{ width: '100%' }}
                  label="CVC非表示"
                  inline={false}
                  disabled={true}
                  placeholder={creditCardPayment.cvc_placeholder}
                />
              </div>
            }
          </div>
        )
      }
    </>
  );
};

export default CreditCardPaymentPreview;
