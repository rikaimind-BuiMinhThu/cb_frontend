import React from 'react';
import { Radio } from 'antd';
import InputCustom from '../../scenarioComon/InputCustom';
import {
  PREVIEW_LABELS,
  SHIPPING_ADDRESS_SETTING_LABELS,
} from '../../constants/scenarioSettingLabels';
import { CONTENT_SETTING_TYPES } from '../../constants/contentTypeConstants';
import '../../styles/contentPreviews/shippingAddress.css';
import '../../styles/base/preview-common.css';

const REQUIRE_ALL_ITEMS = 'all_items_require';
const REQUIRE_SINGLE = 'require';

const ShippingAddressPreview = ({ content }) => {
  const shippingAddress = content.shipping_address;
  if (content.type !== CONTENT_SETTING_TYPES.SHIPPING_ADDRESS || !shippingAddress) {
    return null;
  }

  const showRequiredMark = (
    shippingAddress.isCheckRequire === REQUIRE_ALL_ITEMS
    || shippingAddress.isCheckRequire === REQUIRE_SINGLE
  );

  return (
    <div className="ss-content-preview">
      {(shippingAddress.title_require || shippingAddress.require) && (
        <div className="ss-message__content--user-text-input-top ss-content-preview__header--no-mb">
          {shippingAddress.title_require && (
            <span className="ss-message__content--user-text-input-title">
              {shippingAddress.title}
            </span>
          )}
          {shippingAddress.require === true && (
            <span className="ss-message__content--user-text-input-required">
              {PREVIEW_LABELS.requiredMark}
            </span>
          )}
        </div>
      )}
      <Radio.Group
        className="ss-content-preview__radio-group"
        value={shippingAddress.value_initial_selection}
      >
        {shippingAddress.radio_contents && shippingAddress.radio_contents.map((itemPayment, indexPayment) => (
          <Radio value={itemPayment.id} key={indexPayment} className="ss-content-preview__radio-option">
            {itemPayment.text}
          </Radio>
        ))}
      </Radio.Group>
      {shippingAddress.name !== undefined && (
        <>
          <div className="ss-field-label">
            {SHIPPING_ADDRESS_SETTING_LABELS.name}
          </div>
          <div className="ss-content-preview__row">
            <input
              readOnly
              placeholder={shippingAddress[shippingAddress.type]?.name_placeholderLeft}
              disabled
              className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--half"
            />
            <input
              readOnly
              placeholder={shippingAddress[shippingAddress.type]?.name_placeholderRight}
              disabled
              className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--half"
            />
          </div>
        </>
      )}
      {shippingAddress.kana_name !== undefined && (
        <>
          <div className="ss-field-label">
            {SHIPPING_ADDRESS_SETTING_LABELS.kanaName}
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
      )}
      <div className="ss-content-preview">
        {(shippingAddress.title_require || shippingAddress.isCheckRequire) && (
          <div className="ss-message__content--user-pull_down-top ss-content-preview__header--no-mb">
            {shippingAddress.title_require && (
              <span className="ss-message__content--user-pull_down-title">
                {shippingAddress.title}
              </span>
            )}
            {showRequiredMark && (
              <span className="ss-message__content--user-text-input-required">
                {PREVIEW_LABELS.requiredMark}
              </span>
            )}
          </div>
        )}
        {shippingAddress.post_code !== undefined && (
          <div className="ss-user-setting__item-bottom">
            <div className="ss-content-preview__label--post-code">
              {SHIPPING_ADDRESS_SETTING_LABELS.postalCode}
            </div>
            {shippingAddress.split_postal_code !== true ? (
              <InputCustom
                placeholder={shippingAddress.post_code}
                disabled
                className="ss-input--full"
              />
            ) : (
              <div className="ss-content-preview__row--full">
                <InputCustom
                  placeholder={shippingAddress.post_code_left}
                  disabled
                  className="ss-input--half"
                />
                <InputCustom
                  placeholder={shippingAddress.post_code_right}
                  disabled
                  className="ss-input--half"
                />
              </div>
            )}
          </div>
        )}
        {shippingAddress.prefecture !== undefined && (
          <div className="ss-user-setting__item-bottom">
            <div className="ss-field-label">
              {SHIPPING_ADDRESS_SETTING_LABELS.prefecture}
            </div>
            <InputCustom
              placeholder={shippingAddress.prefecture}
              disabled
              className="ss-input--full"
            />
          </div>
        )}
        {shippingAddress.municipality !== undefined && (
          <div className="ss-user-setting__item-bottom">
            <div className="ss-field-label">
              {SHIPPING_ADDRESS_SETTING_LABELS.municipality}
            </div>
            <InputCustom
              placeholder={shippingAddress.municipality}
              disabled
              className="ss-input--full"
            />
          </div>
        )}
        {shippingAddress.address !== undefined && (
          <div className="ss-user-setting__item-bottom">
            <div className="ss-field-label">
              {SHIPPING_ADDRESS_SETTING_LABELS.address}
            </div>
            <InputCustom
              placeholder={shippingAddress.address}
              disabled
              className="ss-input--full"
            />
          </div>
        )}
        {shippingAddress.building_name !== undefined && (
          <div className="ss-user-setting__item-bottom">
            <div className="ss-field-label">
              {SHIPPING_ADDRESS_SETTING_LABELS.buildingName}
            </div>
            <InputCustom
              placeholder={shippingAddress.building_name}
              disabled
              className="ss-input--full"
            />
          </div>
        )}
      </div>
      {shippingAddress.number !== undefined && (
        shippingAddress.withHyphen === false ? (
          <>
            <div className="ss-field-label">
              {SHIPPING_ADDRESS_SETTING_LABELS.phoneNumber}
            </div>
            <input
              readOnly
              placeholder={shippingAddress[shippingAddress.type]?.number_placeholder}
              disabled
              className="ss-message__content--user-text-input ss-input-value ss-content-preview__header--no-mb"
            />
          </>
        ) : (
          <>
            <div className="ss-field-label">
              {SHIPPING_ADDRESS_SETTING_LABELS.phoneNumber}
            </div>
            <div className="ss-content-preview__row">
              <input
                readOnly
                placeholder={shippingAddress[shippingAddress.type]?.number1_placeholder}
                disabled
                className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--third"
              />
              <input
                readOnly
                placeholder={shippingAddress[shippingAddress.type]?.number2_placeholder}
                disabled
                className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--third"
              />
              <input
                readOnly
                placeholder={shippingAddress[shippingAddress.type]?.number3_placeholder}
                disabled
                className="ss-message__content--user-text-input ss-input-value ss-content-preview__input--third"
              />
            </div>
          </>
        )
      )}
    </div>
  );
};

export default ShippingAddressPreview;
