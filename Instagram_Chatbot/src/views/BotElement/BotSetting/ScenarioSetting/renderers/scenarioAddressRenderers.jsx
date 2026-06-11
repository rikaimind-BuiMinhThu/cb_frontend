import React from 'react';
import InputCustom from '../scenarioComon/InputCustom';

export const createRenderAddressField = () => (address) => {
  if ((address.compact_municipality_and_address && !address.is_display_address_field) || address.compact_municipality_and_address_and_building_name) return;
  if (address.address === undefined) return;
  return (
    <div className="ss-user-setting__item-bottom">
      <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
        {address.address_label || '番地'}
      </div>
      <InputCustom
        placeholder={address.address}
        disabled={true}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export const createRenderBuildingName = () => (address) => {
  if (address.building_name === undefined) return;
  return (
    <div className="ss-user-setting__item-bottom">
      <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
        {address.building_name_label || '建物名'}
      </div>
      <InputCustom
        placeholder={address.building_name}
        disabled={true}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export const createRenderMunicipality = () => (address) => {
  if (address.municipality === undefined) return;
  return (
    <div className="ss-user-setting__item-bottom">
      <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
        {address.municipality_label || '市区町村'}
      </div>
      <InputCustom
        placeholder={address.municipality}
        disabled={true}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export const createRenderSinglePostCode = () => (address) => {
  return (
    <InputCustom
      placeholder={address.post_code}
      disabled={true}
      style={{ width: '100%' }}
    />
  );
};

export const createRenderSplitPostCode = () => (address) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <InputCustom
        placeholder={address.post_code_left}
        disabled={true}
        style={{ width: '49%' }}
      />
      <InputCustom
        placeholder={address.post_code_right}
        disabled={true}
        style={{ width: '49%' }}
      />
    </div>
  );
};

export const createRenderPostCode = ({ renderSinglePostCode, renderSplitPostCode }) => (address) => {
  if (address.post_code === undefined) return;
  return (
    <div className="ss-user-setting__item-bottom">
      <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '5px' }}>
        {address.post_code_label || '郵便番号'}
      </div>
      {address.split_postal_code !== true ? renderSinglePostCode(address) : renderSplitPostCode(address)}
    </div>
  );
};

export const createRenderZipCodeAddressTitle = () => (zipCodeAddress) => {
  if (!(zipCodeAddress.title_require || zipCodeAddress.isCheckRequire)) return;

  const hasRequiredItem = () => {
    if (zipCodeAddress.isCheckRequire !== 'set_required_for_each_item') return false;
    return ['postCode', 'prefecture', 'municipality', 'address', 'buildingName'].some(item => zipCodeAddress[`${item}Required`]);
  };

  const isRequired = zipCodeAddress.isCheckRequire === 'all_items_require' || zipCodeAddress.isCheckRequire === 'require' || hasRequiredItem();
  return (
    <div className="ss-message__content--user-pull_down-top" style={{ marginBottom: '0px' }}>
      {zipCodeAddress.title_require &&
        <span className="ss-message__content--user-pull_down-title">
          {zipCodeAddress.title}
        </span>
      }
      {isRequired &&
        <span className="ss-message__content--user-text-input-required">
          ※必須
        </span>
      }
    </div>
  );
};

export const createRenderPrefecture = () => (address) => {
  if (address.prefecture === undefined) return;
  return (
    <div className="ss-user-setting__item-bottom">
      <div style={{ fontWeight: '400', fontSize: '12px', width: '100%', marginBottom: '3px' }}>
        {address.prefecture_label || '都道府県'}
      </div>
      <InputCustom
        placeholder={address.prefecture}
        disabled={true}
        style={{ width: '100%' }}
      />
    </div>
  );
};
