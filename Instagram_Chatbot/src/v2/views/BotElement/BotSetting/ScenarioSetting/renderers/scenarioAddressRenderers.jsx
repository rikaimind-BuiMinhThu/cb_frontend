import React from 'react';
import InputCustom from '../scenarioComon/InputCustom';
import { SETTING_LABELS, PREVIEW_LABELS } from '../constants/scenarioSettingLabels';

const renderLabeledAddressInput = (label, placeholder) => (
  <div className="ss-user-setting__item-bottom">
    <div className="ss-field-label">{label}</div>
    <InputCustom
      placeholder={placeholder}
      disabled={true}
      className="ss-input--full"
    />
  </div>
);

export const createRenderAddressField = () => {
  const renderAddressField = (address) => {
    if ((address.compact_municipality_and_address && !address.is_display_address_field) || address.compact_municipality_and_address_and_building_name) return;
    if (address.address === undefined) return;
    return renderLabeledAddressInput(
      address.address_label || SETTING_LABELS.address,
      address.address,
    );
  };
  return renderAddressField;
};

export const createRenderBuildingName = () => {
  const renderBuildingName = (address) => {
    if (address.building_name === undefined) return;
    return renderLabeledAddressInput(
      address.building_name_label || SETTING_LABELS.buildingName,
      address.building_name,
    );
  };
  return renderBuildingName;
};

export const createRenderMunicipality = () => {
  const renderMunicipality = (address) => {
    if (address.municipality === undefined) return;
    return renderLabeledAddressInput(
      address.municipality_label || SETTING_LABELS.municipality,
      address.municipality,
    );
  };
  return renderMunicipality;
};

export const createRenderSinglePostCode = () => {
  const renderSinglePostCode = (address) => (
    <InputCustom
      placeholder={address.post_code}
      disabled={true}
      className="ss-input--full"
    />
  );
  return renderSinglePostCode;
};

export const createRenderSplitPostCode = () => {
  const renderSplitPostCode = (address) => (
    <div className="ss-address-post-code-row">
      <InputCustom
        placeholder={address.post_code_left}
        disabled={true}
        className="ss-input--half"
      />
      <InputCustom
        placeholder={address.post_code_right}
        disabled={true}
        className="ss-input--half"
      />
    </div>
  );
  return renderSplitPostCode;
};

export const createRenderPostCode = ({ renderSinglePostCode, renderSplitPostCode }) => {
  const renderPostCode = (address) => {
    if (address.post_code === undefined) return;
    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-field-label ss-field-label--post-code">
          {address.post_code_label || SETTING_LABELS.postCode}
        </div>
        {address.split_postal_code !== true ? renderSinglePostCode(address) : renderSplitPostCode(address)}
      </div>
    );
  };
  return renderPostCode;
};

export const createRenderZipCodeAddressTitle = () => {
  const renderZipCodeAddressTitle = (zipCodeAddress) => {
    if (!(zipCodeAddress.title_require || zipCodeAddress.isCheckRequire)) return;

    const hasRequiredItem = () => {
      if (zipCodeAddress.isCheckRequire !== 'set_required_for_each_item') return false;
      return ['postCode', 'prefecture', 'municipality', 'address', 'buildingName'].some(
        (item) => zipCodeAddress[`${item}Required`],
      );
    };

    const isRequired = zipCodeAddress.isCheckRequire === 'all_items_require'
      || zipCodeAddress.isCheckRequire === 'require'
      || hasRequiredItem();

    return (
      <div className="ss-message__content--user-pull_down-top ss-address-zip-title">
        {zipCodeAddress.title_require && (
          <span className="ss-message__content--user-pull_down-title">
            {zipCodeAddress.title}
          </span>
        )}
        {isRequired && (
          <span className="ss-message__content--user-text-input-required">
            {PREVIEW_LABELS.requiredMark}
          </span>
        )}
      </div>
    );
  };
  return renderZipCodeAddressTitle;
};

export const createRenderPrefecture = () => {
  const renderPrefecture = (address) => {
    if (address.prefecture === undefined) return;
    return renderLabeledAddressInput(
      address.prefecture_label || SETTING_LABELS.prefecture,
      address.prefecture,
    );
  };
  return renderPrefecture;
};
