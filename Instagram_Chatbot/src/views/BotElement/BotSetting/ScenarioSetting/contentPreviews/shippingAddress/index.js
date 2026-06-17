import '../../styles/contentPreviews/shippingAddress.css';
import '../../styles/base/preview-common.css';
import React from 'react';
import { Radio } from 'antd';
import InputCustom from '../../scenarioComon/InputCustom';

const ShippingAddressPreview = ({
  content,
  message,
  indexContent,
}) => {
  const shippingAddress = content.shipping_address;
  return (
    <>
      {
        content.type === 'shipping_address' && (
          <div className="ss-content-preview">
            {(shippingAddress.title_require || shippingAddress.require) &&
              <div className="ss-message__content--user-text-input-top ss-content-preview__header--no-mb">
                {shippingAddress.title_require &&
                  <span className="ss-message__content--user-text-input-title">
                    {shippingAddress.title}
                  </span>
                }
                {shippingAddress.require === true &&
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                }
              </div>
            }
            {
              <Radio.Group
                className="ss-content-preview__radio-group"
                onChange={(value) => console.log(value)}
                value={shippingAddress.value_initial_selection}
              >
                {shippingAddress.radio_contents && shippingAddress.radio_contents.map((itemPayment, indexPayment) => {

                  return <Radio value={itemPayment.id} key={indexPayment} className="ss-content-preview__radio-option">
                    {itemPayment.text}
                  </Radio>
                })}
              </Radio.Group>
            }
            {shippingAddress.name !== undefined && (
                <>
                  <div className="ss-field-label">
                    お名前
                  </div>
                  <div className="ss-content-preview__row">
                    <input
                      readOnly
                      placeholder={shippingAddress[shippingAddress.type]?.name_placeholderLeft}
                      disabled
                     className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--half"></input>
                    <input
                      readOnly
                      placeholder={shippingAddress[shippingAddress.type]?.name_placeholderRight}
                      disabled
                     className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--half"></input>
                  </div>
                </>
                )
            }
            {shippingAddress.kana_name !== undefined && (
                <>
                  <div className="ss-field-label">
                    フリガナ
                  </div>
                  <div className="ss-content-preview__row">
                    <input
                      readOnly
                      placeholder={shippingAddress[shippingAddress.type]?.kana_name_placeholderLeft}
                      disabled
                      className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--half"
                    />
                    <input
                      readOnly
                      placeholder={shippingAddress[shippingAddress.type]?.kana_name_placeholderRight}
                      disabled
                      className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--half"
                    />
                  </div>
                </>
                )
            }
            {
              <div className="ss-content-preview">
              {(shippingAddress.title_require || shippingAddress.isCheckRequire) &&
                <div className="ss-message__content--user-pull_down-top ss-content-preview__header--no-mb">
                  {shippingAddress.title_require &&
                    <span className="ss-message__content--user-pull_down-title">
                      {shippingAddress.title}
                    </span>
                  }
                  {(shippingAddress.isCheckRequire === 'all_items_require' ||
                    shippingAddress.isCheckRequire === 'require') &&
                    <span className="ss-message__content--user-text-input-required">
                      ※必須
                    </span>
                  }
                </div>
              }
              {shippingAddress.post_code !== undefined && (
                <div className="ss-user-setting__item-bottom">
                  <div className="ss-content-preview__label--post-code">
                    郵便番号
                  </div>
                  {shippingAddress.split_postal_code !== true ?
                    <InputCustom
                      placeholder={shippingAddress.post_code}
                      disabled={true}
                      className="ss-input--full"
                    /> :
                    <div className="ss-content-preview__row--full">
                      <InputCustom
                        placeholder={shippingAddress.post_code_left}
                        disabled={true}
                        className="ss-input--half"
                      />
                      <InputCustom
                        placeholder={shippingAddress.post_code_right}
                        disabled={true}
                        className="ss-input--half"
                      />
                    </div>
                  }
                </div>
              )}
              {shippingAddress.prefecture !== undefined &&
                <div className="ss-user-setting__item-bottom">
                  <div className="ss-field-label">
                    都道府県
                  </div>
                  <InputCustom
                    placeholder={shippingAddress.prefecture}
                    disabled={true}
                    className="ss-input--full"
                  />
                </div>
              }
              {shippingAddress.municipality !== undefined &&
                <div className="ss-user-setting__item-bottom">
                  <div className="ss-field-label">
                    市区町村
                  </div>
                  <InputCustom
                    placeholder={shippingAddress.municipality}
                    disabled={true}
                    className="ss-input--full"
                  />
                </div>
              }
              {shippingAddress.address !== undefined &&
                <div className="ss-user-setting__item-bottom">
                  <div className="ss-field-label">
                    番地
                  </div>
                  <InputCustom
                    placeholder={shippingAddress.address}
                    disabled={true}
                    className="ss-input--full"
                  />
                </div>
              }
              {shippingAddress.building_name !== undefined &&
                <div className="ss-user-setting__item-bottom">
                  <div className="ss-field-label">
                    建物名
                  </div>
                  <InputCustom
                    placeholder={shippingAddress.building_name}
                    disabled={true}
                    className="ss-input--full"
                  />
                </div>
              }
            </div>
            }
            {shippingAddress.number !== undefined && (
              <React.Fragment>
                {shippingAddress.withHyphen === false ?
                  <>
                    <div className="ss-field-label">
                      電話番号
                    </div>
                    <input
                      readOnly
                      placeholder={shippingAddress[shippingAddress.type]?.number_placeholder}
                      disabled
                     className="ss-message__content--user-text-input ss-input-value ss-content-preview__header--no-mb"></input>
                  </>
                  :
                  <>
                    <div className="ss-field-label">
                      電話番号
                    </div>
                    <div className="ss-content-preview__row">
                      <input
                        readOnly
                        placeholder={shippingAddress[shippingAddress.type]?.number1_placeholder}
                        disabled
                       className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--third"></input>
                      <input
                        readOnly
                        placeholder={shippingAddress[shippingAddress.type]?.number2_placeholder}
                        disabled
                       className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--third"></input>
                      <input
                        readOnly
                        placeholder={shippingAddress[shippingAddress.type]?.number3_placeholder}
                        disabled
                       className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--third"></input>
                    </div>
                  </>

                }
              </React.Fragment>
            )
            } </div>
        )
      }
    </>
  );
};

export default ShippingAddressPreview;
