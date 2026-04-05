import React from 'react';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import SelectCustom from '../scenarioComon/SelectCustom';
import InputCustom from '../scenarioComon/InputCustom';
import { renderFukushashikiSetting } from '../ScenarioUtils';

const ZipCodeAddressSetting = ({
  indexMessageSelect,
  indexContent,
  contentType,
  zipCodeAddress,
  dataMessages,
  setDataMessages,
  dataInputVar,
  dataPrefectures,
  isUseFukushashiki,
  setIsOpenAddVariable,
  onChangeValueMessageContent,
  handleRemoveItemZipCodeAddress,
  renderRootFaqOption,
}) => {
  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[indexContent];

  const handleChangeValueRequireZipCode = (indexMessage, indexContent, type, value, name) => {
    if (value === true && name === 'require') {
      onChangeValueMessageContent(indexMessage, indexContent, type, false, 'all_items_require');
      onChangeValueMessageContent(indexMessage, indexContent, type, value, 'require');
    } else if (value === true && name === 'all_items_require') {
      onChangeValueMessageContent(indexMessage, indexContent, type, false, 'require');
      onChangeValueMessageContent(indexMessage, indexContent, type, value, 'all_items_require');
    } else {
      console.log('value', value);
      console.log('name', name);
      onChangeValueMessageContent(indexMessage, indexContent, type, value, name);
    }
  }

  const renderZipFukushashikiRow = (modeKey, valueKey) => renderFukushashikiSetting({
    variant: 'zipCodeAddress',
    mode: messageContent?.[modeKey],
    inputValue: messageContent?.[valueKey] ?? '',
    onModeChange: value => onChangeValueMessageContent(indexMessageSelect, indexContent, modeKey, value),
    onInputChange: value => onChangeValueMessageContent(indexMessageSelect, indexContent, valueKey, value),
  });

  const renderNotDisplayWhenLoggedInOption = () => (
    <CheckboxCustom
      label="ログイン済み時に表示しない"
      onChange={(value) => {
        dataMessages[indexMessageSelect].not_display_when_logged_in = value;
        setDataMessages([...dataMessages]);
      }}
      value={dataMessages[indexMessageSelect].not_display_when_logged_in}
    />
  );

  const renderNotDisplayWhenHaveErrorOption = () => (
    <CheckboxCustom
      label="エラー発生の時に表示しない"
      onChange={(value) => {
        dataMessages[indexMessageSelect].not_display_when_have_error = value;
        setDataMessages([...dataMessages]);
      }}
      value={dataMessages[indexMessageSelect].not_display_when_have_error}
    />
  );

  const renderSaveInputToVariableOption = () => (
    <>
      <CheckboxCustom
        label="入力された内容を変数に保存する。"
        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'is_save_input_content')}
        value={zipCodeAddress.is_save_input_content}
      />
      {zipCodeAddress.is_save_input_content && (
        <div className="ss-user-setting__item-bottom">
          <div className="ss-user-setting__item-select-bottom-wrapper-flex">
            <SelectCustom
              style={{ width: '100%', marginRight: '10px' }}
              id="title"
              value={zipCodeAddress?.save_input_content}
              data={dataInputVar}
              keyValue="variable_name"
              nameValue="variable_name"
              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'save_input_content')}
            />
            <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>追加</Button>
          </div>
        </div>
      )}
    </>
  );

  const renderUseApiForValidationOption = () => (
    <>
      <div className="ss-user-setting__item-text_input-use-api-wrapper">
        <CheckboxCustom
          label="入力値の検証にAPIを利用する"
          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'use_api_input_value')}
          value={zipCodeAddress.use_api_input_value}
        />
      </div>
      {zipCodeAddress.use_api_input_value && (
        <div className="ss-user-setting__item-bottom">
          <SelectCustom
            style={{ width: '90%' }}
            id="title"
            value={zipCodeAddress?.use_api_input_value}
            data={dataInputVar}
            keyValue="variable_name"
            nameValue="variable_name"
            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'use_api_input_value')}
          />
        </div>
      )}
    </>
  );

  const renderRequireOptionsForEachItem = () => {
    if (zipCodeAddress.isCheckRequire !== 'set_required_for_each_item') return null;

    const fields = {
      postCode: '郵便番号',
      prefecture: '都道府県',
      municipality: '市区町村',
      address: '番地',
      buildingName: '建物名',
    }

    return Object.entries(fields).map(([key, label]) => {
      const attrName = `${key}Required`;
      return (
        <CheckboxCustom
          key={key}
          label={label}
          onChange={value => handleChangeValueRequireZipCode(indexMessageSelect, indexContent, contentType, value, attrName)}
          value={zipCodeAddress[attrName]}
          isOnChange={true}
        />
      )
    })
  }

  const renderRequireOptions = () => (
    <div style={{ width: '100%', gap: '10px' }}>
      <CheckboxCustom
        label="必須"
        onChange={() => handleChangeValueRequireZipCode(indexMessageSelect, indexContent, contentType, zipCodeAddress.isCheckRequire === 'require' ? '' : 'require', 'isCheckRequire')}
        value={zipCodeAddress.isCheckRequire === 'require'}
        isOnChange={false}
      />
      <CheckboxCustom
        label="全項目必須"
        onChange={() => handleChangeValueRequireZipCode(indexMessageSelect, indexContent, contentType, zipCodeAddress.isCheckRequire === 'all_items_require' ? '' : 'all_items_require', 'isCheckRequire')}
        value={zipCodeAddress.isCheckRequire === 'all_items_require'}
        isOnChange={false}
      />
      <CheckboxCustom
        label="項目ごとに必須設定"
        onChange={() => handleChangeValueRequireZipCode(indexMessageSelect, indexContent, contentType, zipCodeAddress.isCheckRequire === 'set_required_for_each_item' ? '' : 'set_required_for_each_item', 'isCheckRequire')}
        value={zipCodeAddress.isCheckRequire === 'set_required_for_each_item'}
        isOnChange={false}
      />
      {zipCodeAddress.isCheckRequire === 'set_required_for_each_item' && renderRequireOptionsForEachItem()}
    </div>
  );

  const renderSplitPostalCodeOption = () => (
    <div className="ss-user-setting__item-text_input-use-api-wrapper">
      <CheckboxCustom
        label="郵便番号を3桁+4桁に分割する"
        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'split_postal_code')}
        value={zipCodeAddress.split_postal_code}
      />
    </div>
  );

  const renderCompactMunicipalityAndAddressOption = () => (
    <div className="ss-user-setting__item-text_input-use-api-wrapper">
      <CheckboxCustom
        label="市区町村と番地を１フィールドで利用"
        onChange={value => {
          onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'compact_municipality_and_address');
          if (value) {
            onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, false, 'compact_municipality_and_address_and_building_name');
          }
        }}
        value={zipCodeAddress.compact_municipality_and_address}
      />
    </div>
  );

  const renderDisplayAddressFieldOption = () => (
    <div className="ss-user-setting__item-text_input-use-api-wrapper">
      <CheckboxCustom
        label="番地入力欄表示"
        onChange={value => {
          onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'is_display_address_field');
        }}
        disabled={!zipCodeAddress.compact_municipality_and_address}
        value={zipCodeAddress.compact_municipality_and_address && zipCodeAddress.is_display_address_field}
      />
    </div>
  );

  const renderCompactMunicipalityAddressBuildingOption = () => (
    <div className="ss-user-setting__item-text_input-use-api-wrapper">
      <CheckboxCustom
        label="市区町村・番地・建物名を１フィールドで利用"
        onChange={value => {
          onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'compact_municipality_and_address_and_building_name');
          if (value) {
            onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, false, 'compact_municipality_and_address');
          }
        }}
        value={zipCodeAddress.compact_municipality_and_address_and_building_name}
      />
    </div>
  );

  const renderZipCodeTopOptions = () => (
    <div className="ss-user-setting__item-text_input-top">
      {renderNotDisplayWhenLoggedInOption()}
      {renderNotDisplayWhenHaveErrorOption()}
      {renderRootFaqOption()}
      {renderSaveInputToVariableOption()}
      {renderUseApiForValidationOption()}
      {renderRequireOptions()}
      {renderSplitPostalCodeOption()}
      {renderCompactMunicipalityAndAddressOption()}
      {renderDisplayAddressFieldOption()}
      {renderCompactMunicipalityAddressBuildingOption()}
    </div>
  );

  const renderPostCodeSingleField = () => (
    <>
      <div className="ss-user-setting__item-bottom" style={{ gap: '1%', marginTop: '10px' }}>
        <InputCustom
          classLabel="ss-custom-label-zip-code"
          containerStyle={{ width: '80%' }}
          labelValue={zipCodeAddress.post_code_label ?? ''}
          onLabelChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'post_code_label')}
          editableLabel={true}
          className="ss-user-setting__item-input-zip-code"
          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'post_code')}
          onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, contentType, 'post_code')}
          value={zipCodeAddress.post_code ?? ''}
          // icon="times-circle"
          placeholder="000 000"
          classIcon="ss-plus-circle-option-icon-times-custom"
        />
      </div>
      {isUseFukushashiki && renderZipFukushashikiRow('post_code_fukushashiki_search_mode', 'post_code_fukushashiki_search_value')}
    </>
  );

  const renderPostCodeSplitFields = () => (
    <>
      <div className="ss-user-setting__item-bottom" style={{ gap: '1%', marginTop: '10px' }}>
        <InputCustom
          classLabel="ss-custom-label-zip-code"
          labelValue={zipCodeAddress.post_code_label ?? ''}
          onLabelChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'post_code_label')}
          editableLabel={true}
          className="ss-user-setting__item-input-zip-code"
          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'post_code_left')}
          value={zipCodeAddress.post_code_left ?? ''}
          placeholder="000"
          style={{ width: '17%', marginRight: '4%' }}
        />
        <InputCustom
          className="ss-user-setting__item-input-zip-code"
          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'post_code_right')}
          value={zipCodeAddress.post_code_right ?? ''}
          placeholder="0000"
          style={{ width: '20%', marginRight: '31%' }}
        />
        {/* <MDBIcon
          style={{ width: '6%' }}
          onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, contentType, 'post_code')}
          fas
          icon="times-circle"
          className="ss-plus-circle-option-icon-times-custom"
        /> */}
      </div>
      {isUseFukushashiki && (
        <>
          {renderZipFukushashikiRow('post_code_left_fukushashiki_search_mode', 'post_code_left_fukushashiki_search_value')}
          {renderZipFukushashikiRow('post_code_right_fukushashiki_search_mode', 'post_code_right_fukushashiki_search_value')}
        </>
      )}
    </>
  );

  const renderPostCodeSection = () => {
    if (zipCodeAddress.post_code === undefined) return null;
    return zipCodeAddress.split_postal_code === false ? renderPostCodeSingleField() : renderPostCodeSplitFields();
  };

  const renderPrefectureSection = () => {
    if (zipCodeAddress.prefecture === undefined) return null;
    return (
      <>
        <div className="ss-user-setting__item-bottom" style={{ flexWrap: 'nowrap', alignItems: 'center', gap: '1%', marginTop: '10px' }}>
          <input
            type="text"
            value={zipCodeAddress.prefecture_label ?? ''}
            onChange={(e) => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, e.target.value, 'prefecture_label')}
            className="ss-editable-label"
            style={{ borderRadius: '5px', border: '1px solid gray', padding: '5px', fontSize: '14px', fontWeight: '400', width: '18.5%' }}
          />
          {zipCodeAddress.is_use_dropdown ? (
            <SelectCustom
              style={{ width: '40%' }}
              id="title"
              value={zipCodeAddress?.prefecture}
              data={dataPrefectures}
              keyValue="name"
              nameValue="name"
              placeholder="プレースホルダ"
              onChange={value => {
                if (value) {
                  onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'prefecture');
                } else {
                  onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, null, 'prefecture');
                }
              }}
            />
          ) : (
            <>
              <InputCustom
                className="ss-user-setting__item-input-zip-code"
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'prefecture')}
                value={zipCodeAddress.prefecture ?? ''}
                placeholder="プレースホルダ"
                style={{ width: '40%' }}
              />
              {/*
              <input
                type="text"
                name="ss-user-setting__item-text_input-use-api"
                className={"ss-input-value ss-user-setting-item ss-user-setting__item-input-zip-code"}
                placeholder={"プレースホルダ"}
                value={zipCodeAddress.prefecture}
                style={{ width: '40%' }}
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'prefecture')}
              />
              */}
            </>
          )}
          <CheckboxCustom
            label="プルダウンを利用"
            className="ss-user-setting-custom-width-checkbox"
            style={{ width: '35%', paddingLeft: '7px', marginBottom: '0px' }}
            onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'is_use_dropdown')}
            value={zipCodeAddress.is_use_dropdown}
          />
          {/* <MDBIcon
            style={{ width: '5%', marginLeft: '3px' }}
            onClick={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, contentType, 'prefecture')}
            fas
            icon="times-circle"
            className="ss-plus-circle-option-icon-times-custom"
          /> */}
        </div>
        {isUseFukushashiki && renderZipFukushashikiRow('prefecture_fukushashiki_search_mode', 'prefecture_fukushashiki_search_value')}
      </>
    );
  };

  const renderMunicipalitySection = () => {
    if (zipCodeAddress.municipality === undefined) return null;
    return (
      <div>
        <div className="ss-user-setting__item-bottom" style={{ gap: '1%', marginTop: '10px' }}>
          <InputCustom
            classLabel="ss-custom-label-zip-code"
            containerStyle={{ width: '80%' }}
            labelValue={zipCodeAddress.municipality_label ?? ''}
            onLabelChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'municipality_label')}
            editableLabel={true}
            className="ss-user-setting__item-input-zip-code"
            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'municipality')}
            onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, contentType, 'municipality')}
            value={zipCodeAddress.municipality ?? ''}
            // icon="times-circle"
            placeholder="プレースホルダ"
            classIcon="ss-plus-circle-option-icon-times-custom"
          />
        </div>
        {isUseFukushashiki && renderZipFukushashikiRow('municipality_fukushashiki_search_mode', 'municipality_fukushashiki_search_value')}
      </div>
    );
  };

  const renderAddressSection = () => {
    if (
      zipCodeAddress.address === undefined
      || zipCodeAddress.compact_municipality_and_address_and_building_name
      || zipCodeAddress.compact_municipality_and_address
    ) {
      return null;
    }
    return (
      <>
        <div className="ss-user-setting__item-bottom" style={{ gap: '1%', marginTop: '10px' }}>
          <InputCustom
            classLabel="ss-custom-label-zip-code"
            containerStyle={{ width: '80%' }}
            labelValue={zipCodeAddress.address_label ?? ''}
            onLabelChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'address_label')}
            editableLabel={true}
            className="ss-user-setting__item-input-zip-code"
            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'address')}
            onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, contentType, 'address')}
            value={zipCodeAddress.address ?? ''}
            // icon="times-circle"
            placeholder="プレースホルダ"
            classIcon="ss-plus-circle-option-icon-times-custom"
          />
        </div>
        {isUseFukushashiki && renderZipFukushashikiRow('address_fukushashiki_search_mode', 'address_fukushashiki_search_value')}
      </>
    );
  };

  const renderBuildingNameSection = () => {
    if (zipCodeAddress.building_name === undefined || zipCodeAddress.compact_municipality_and_address_and_building_name) {
      return null;
    }
    return (
      <>
        <div className="ss-user-setting__item-bottom" style={{ gap: '1%', marginTop: '10px' }}>
          <InputCustom
            classLabel="ss-custom-label-zip-code"
            containerStyle={{ width: '80%' }}
            labelValue={zipCodeAddress.building_name_label ?? ''}
            onLabelChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'building_name_label')}
            editableLabel={true}
            className="ss-user-setting__item-input-zip-code"
            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, 'building_name')}
            value={zipCodeAddress.building_name ?? ''}
            // icon="times-circle"
            onClickIcon={() => handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, contentType, 'building_name')}
            placeholder="プレースホルダ"
            classIcon="ss-plus-circle-option-icon-times-custom"
          />
        </div>
        {isUseFukushashiki && renderZipFukushashikiRow('building_name_fukushashiki_search_mode', 'building_name_fukushashiki_search_value')}
      </>
    );
  };

  return (
    <React.Fragment>
      {renderZipCodeTopOptions()}
      {renderPostCodeSection()}
      {renderPrefectureSection()}
      {renderMunicipalitySection()}
      {renderAddressSection()}
      {renderBuildingNameSection()}
    </React.Fragment>
  );
};

export default ZipCodeAddressSetting;
