import React from 'react';
import { Radio } from 'antd';
import InputCustom from '../scenarioComon/InputCustom';

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
          <div style={{ marginBottom: '10px' }}>
            {(shippingAddress.title_require || shippingAddress.require) &&
              <div className="ss-message__content--user-text-input-top" style={{ marginBottom: '0px' }}>
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
                style={{ width: "100%", fontSize: '14px' }}
                onChange={(value) => console.log(value)}
                value={shippingAddress.value_initial_selection}
              >
                {shippingAddress.radio_contents && shippingAddress.radio_contents.map((itemPayment, indexPayment) => {

                  return <Radio value={itemPayment.id} key={indexPayment} style={{ backgroundColor: '#ECF5FA', marginBottom: '5px', padding: '5px', width: '100%' }}>
                    {itemPayment.text}
                  </Radio>
                })}
              </Radio.Group>
            }
            {shippingAddress.name !== undefined && (
                <>
                  <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '5px' }}>
                    お名前
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <input
                      className="ss-message__content--user-text-input ss-input-value"
                      readOnly
                      placeholder={shippingAddress[shippingAddress.type]?.name_placeholderLeft}
                      style={{ width: '49%', marginBottom: '0px' }}
                      disabled
                    ></input>
                    <input
                      className="ss-message__content--user-text-input ss-input-value"
                      readOnly
                      placeholder={shippingAddress[shippingAddress.type]?.name_placeholderRight}
                      style={{ width: '49%' }}
                      disabled
                    ></input>
                  </div>
                </>
                )
            }
            {shippingAddress.kana_name !== undefined && (
                <>
                  <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '5px' }}>
                    フリガナ
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <input
                      className="ss-message__content--user-text-input ss-input-value"
                      readOnly
                      placeholder={shippingAddress[shippingAddress.type]?.kana_name_placeholderLeft}
                      style={{ width: '49%', marginBottom: '0px' }}
                      disabled
                    ></input>
                    <input
                      className="ss-message__content--user-text-input ss-input-value"
                      readOnly
                      placeholder={shippingAddress[shippingAddress.type]?.kana_name_placeholderRight}
                      style={{ width: '49%' }}
                      disabled
                    ></input>
                  </div>
                </>
                )
            }
            {
              <div style={{ marginBottom: '10px' }}>
              {(shippingAddress.title_require || shippingAddress.isCheckRequire) &&
                <div className="ss-message__content--user-pull_down-top" style={{ marginBottom: '0px' }}>
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
                  <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '5px', marginTop:'5px' }}>
                    郵便番号
                  </div>
                  {shippingAddress.split_postal_code !== true ?
                    <InputCustom
                      placeholder={shippingAddress.post_code}
                      disabled={true}
                      style={{ width: '100%' }}
                    /> :
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <InputCustom
                        placeholder={shippingAddress.post_code_left}
                        disabled={true}
                        style={{ width: '49%' }}
                      />
                      <InputCustom
                        placeholder={shippingAddress.post_code_right}
                        disabled={true}
                        style={{ width: '49%' }}
                      />
                    </div>
                  }
                </div>
              )}
              {shippingAddress.prefecture !== undefined &&
                <div className="ss-user-setting__item-bottom">
                  <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
                    都道府県
                  </div>
                  <InputCustom
                    placeholder={shippingAddress.prefecture}
                    disabled={true}
                    style={{ width: '100%' }}
                  />
                </div>
              }
              {shippingAddress.municipality !== undefined &&
                <div className="ss-user-setting__item-bottom">
                  <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
                    市区町村
                  </div>
                  <InputCustom
                    placeholder={shippingAddress.municipality}
                    disabled={true}
                    style={{ width: '100%' }}
                  />
                </div>
              }
              {shippingAddress.address !== undefined &&
                <div className="ss-user-setting__item-bottom">
                  <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
                    番地
                  </div>
                  <InputCustom
                    placeholder={shippingAddress.address}
                    disabled={true}
                    style={{ width: '100%' }}
                  />
                </div>
              }
              {shippingAddress.building_name !== undefined &&
                <div className="ss-user-setting__item-bottom">
                  <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
                    建物名
                  </div>
                  <InputCustom
                    placeholder={shippingAddress.building_name}
                    disabled={true}
                    style={{ width: '100%' }}
                  />
                </div>
              }
            </div>
            }
            {shippingAddress.number !== undefined && (
              <React.Fragment>
                {shippingAddress.withHyphen === false ?
                  <>
                    <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
                      電話番号
                    </div>
                    <input
                      className="ss-message__content--user-text-input ss-input-value"
                      readOnly
                      style={{ marginBottom: '0px' }}
                      placeholder={shippingAddress[shippingAddress.type]?.number_placeholder}
                      disabled
                    ></input>
                  </>
                  :
                  <>
                    <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
                      電話番号
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <input
                        className="ss-message__content--user-text-input ss-input-value"
                        readOnly
                        style={{ marginBottom: '0px', width: '32%' }}
                        placeholder={shippingAddress[shippingAddress.type]?.number1_placeholder}
                        disabled
                      ></input>
                      <input
                        className="ss-message__content--user-text-input ss-input-value"
                        readOnly
                        style={{ marginBottom: '0px', width: '32%' }}
                        placeholder={shippingAddress[shippingAddress.type]?.number2_placeholder}
                        disabled
                      ></input>
                      <input
                        className="ss-message__content--user-text-input ss-input-value"
                        readOnly
                        style={{ marginBottom: '0px', width: '32%' }}
                        placeholder={shippingAddress[shippingAddress.type]?.number3_placeholder}
                        disabled
                      ></input>
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
