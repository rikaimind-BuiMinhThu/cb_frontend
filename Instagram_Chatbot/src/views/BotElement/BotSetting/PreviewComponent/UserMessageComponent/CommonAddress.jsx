import React from "react";
import "assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES, NUMBER_REGEX } from "views/BotElement/BotSetting/PreviewComponent/Constants";
import { getAddressFromZipCode, moveToNext } from "views/BotElement/BotSetting/PreviewComponent/Utils";

import InputCustom from "views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputCustom";
import SelectCustom from "views/BotElement/BotSetting/ScenarioSetting/scenarioComon/SelectCustom";

export default function CommonAddress({ content, prefecturesList, indexMessageRender, indexMessage, indexContent, messageContent, onChangeValue, onChangeErrors, errors, disabled, onOpen }) {
  
  if (content.type !== MESSAGE_CONTENT_TYPES.ZIP_CODE_ADDRESS && content.type !== MESSAGE_CONTENT_TYPES.SHIPPING_ADDRESS) return <></>;
  
  const addressContent = content.type === MESSAGE_CONTENT_TYPES.ZIP_CODE_ADDRESS ? content.zip_code_address : content.shipping_address;
  if (!addressContent) return <></>;

  const getPrefectureIdCodeFromName = (name) => {
    return prefecturesList.find((prefecture) => prefecture.name === name)?.id;
  }

  const renderTitle = () => {
    const title = addressContent.title_require && (
      <span className="ss-message__content--user-pull_down-title">
        {addressContent.title}
      </span>
    );

    const isRequired = addressContent.isCheckRequire === "all_items_require" || addressContent.isCheckRequire === "require";

    const requiredLabel = isRequired && (
      <span className="ss-message__content--user-text-input-required">
        ※必須
      </span>
    );

    return (
      <div className="ss-message__content--user-pull_down-top m-b-0">
        {title}
        {requiredLabel}
      </div>
    );
  };

  const renderSearchLink = () => {
    const linkColor = disabled ? "gray" : "#2c76f0";
    const cursor = disabled ? "default" : "pointer";
    return (
      <div className="ss-message__content--user-zip-code-address-search-link"
        style={{ color: linkColor }}
      >
        <span style={{ cursor }}
          onClick={() => {
            if (disabled !== true) onOpen(true, indexContent);
          }}
        >
          〒検索はこちら
        </span>
      </div>
    )
  };

  const changeInvalidZipCodeError = () => {
    const errorKey = `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`;
    onChangeErrors(errorKey, "無効な郵便番号です。");
  };

  const clearZipCodeError = () => {
    const errorKey = `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`;
    onChangeErrors(errorKey, "");
  };

  const retrieveAddressFromZipCode = (zipCode) => {
    getAddressFromZipCode(zipCode).then((res) => {
      if (!res.data || res.data.code !== 1) {
        return changeInvalidZipCodeError();
      }

      const {town_name, city_name, prefecture_name, building_name} = res.data.data;
      let newZipCodeAddress = {
        value_prefecture: addressContent.is_use_dropdown ? getPrefectureIdCodeFromName(prefecture_name) : prefecture_name,
      };

      if (addressContent.compact_municipality_and_address) {
        newZipCodeAddress.value_municipality = `${city_name}${town_name}`;
      } else if (addressContent.compact_municipality_and_address_and_building_name) {
        newZipCodeAddress.value_municipality = `${city_name}${town_name}${building_name}`.replace('undefined', '');
      } else {
        newZipCodeAddress.value_municipality = city_name;
        newZipCodeAddress.value_address = town_name;
      }

      onChangeValue(indexContent, content.type, newZipCodeAddress.value_prefecture, "value_prefecture");
      onChangeValue(indexContent, content.type, newZipCodeAddress.value_municipality, "value_municipality");
      onChangeValue(indexContent, content.type, newZipCodeAddress.value_address, "value_address");
      onChangeValue(indexContent, content.type, newZipCodeAddress.value_building_name, "value_building_name");

      moveToNext(`ss-user-input-address${indexContent}`);
      clearZipCodeError();

    }).catch((error) => {
      changeInvalidZipCodeError();
    });
  };

  const renderSinglePostCode = () => {
    return (
      <InputCustom
        type="tel"
        inputMode="numeric"
        placeholder={addressContent.post_code}
        disabled={disabled}
        maxLength={7}
        onKeyPress={(e) => {
          if (String(e.target.value).length >= 7) e.preventDefault();
        }}
        style={{ width: "100%", marginLeft: "0px" }}
        onChange={async (value) => {
          onChangeValue(
            indexContent,
            content.type,
            value,
            "value_post_code"
          );
          if (String(value).length === 7) {
            retrieveAddressFromZipCode(value);
          } else if (String(value).length !== 0) {
            changeInvalidZipCodeError();
          } else {
            clearZipCodeError();
          }
        }}
        value={addressContent.value_post_code}
        clearable={true}
      />
    );
  };

  const renderSplitPostCode = () => {
    return (
      <div className="ss-message__content--user-chat-container w-100-percent">
        <InputCustom
          type="tel"
          inputMode="numeric"
          placeholder={addressContent.post_code_left}
          disabled={disabled}
          className="w-49-percent"
          onKeyPress={(e) => {
            if (String(e.target.value).length >= 3) e.preventDefault();
          }}
          onChange={async (value) => {
            if (value && !NUMBER_REGEX.test(value)) return;

            onChangeValue(
              indexContent,
              content.type,
              value,
              "value_post_code_left"
            );
            if ((value + "").length === 3) {
              moveToNext(`ss-user-post-code-right-input${indexContent}`);
            }

            const zipCode = value + addressContent.value_post_code_right;
            
            if (String(zipCode).length === 7) {
              retrieveAddressFromZipCode(zipCode);
            } else if (String(zipCode).length !== 0) {
              changeInvalidZipCodeError();
            } else {
              clearZipCodeError();
            }
          }}
          value={addressContent.value_post_code_left}
          clearable={true}
        />
        <InputCustom
          type="tel"
          inputMode="numeric"
          placeholder={addressContent.post_code_right}
          disabled={disabled}
          id={`ss-user-post-code-right-input${indexContent}`}
          className="w-49-percent"
          onKeyPress={(e) => {
            if (String(e.target.value).length >= 4) e.preventDefault();
          }}
          onChange={async (value) => {
            if (value && !NUMBER_REGEX.test(value)) return;
            onChangeValue(
              indexContent,
              content.type,
              value,
              "value_post_code_right"
            );
            const zipCode = addressContent.value_post_code_left + value;
            
            if (String(zipCode).length === 7) {
              retrieveAddressFromZipCode(zipCode);
            } else if (String(zipCode).length !== 0) {
              changeInvalidZipCodeError();
            } else {
              clearZipCodeError();
            }
          }}
          value={addressContent.value_post_code_right}
          clearable={true}
        />
      </div>
    );
  };

  const renderPostCode = () => {
    if (addressContent.post_code === undefined) return;
    const postCodeLabel = addressContent.post_code_label?.trim() !== "" ? addressContent.post_code_label : "郵便番号";

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-message__content--user-zip-code-address-post-code-label">
          {postCodeLabel}
        </div>
        {addressContent.split_postal_code !== true ? renderSinglePostCode() : renderSplitPostCode()}
      </div>
    );
  };

  const renderPrefecture = () => {
    if (addressContent.prefecture === undefined) return;

    const prefectureLabel = addressContent.prefecture_label?.trim() !== "" ? addressContent.prefecture_label : "都道府県";
    let prefectureInput = null;

    if (addressContent.is_use_dropdown) {
      prefectureInput = (
        <SelectCustom
          className="w-100-percent"
          value={addressContent?.value_prefecture}
          data={prefecturesList}
          keyValue="id"
          nameValue="name"
          placeholder={addressContent.prefecture}
          onChange={(value) =>
            onChangeValue(indexContent, content.type, value, "value_prefecture")
          }
        />
      );
    } else {
      prefectureInput = (
        <InputCustom
          placeholder={addressContent.prefecture}
          disabled={disabled}
          className="w-100-percent"
          onChange={(value) =>
            onChangeValue(indexContent, content.type, value, "value_prefecture")
          }
          value={addressContent.value_prefecture}
          clearable={true}
        />
      );
    }

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-message__content--user-zip-code-address-label">{prefectureLabel}</div>
        {prefectureInput}
      </div>
    );
  };

  const renderMunicipality = () => {
    if (addressContent.municipality === undefined) return;

    const municipalityLabel = addressContent.municipality_label?.trim() !== "" ? addressContent.municipality_label : "市区町村";
    
    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-message__content--user-zip-code-address-label">{municipalityLabel}</div>
        <InputCustom
          placeholder={addressContent.municipality}
          disabled={disabled}
          className="w-100-percent"
          onChange={(value) =>
            onChangeValue(indexContent, content.type, value, "value_municipality")
          }
          value={addressContent.value_municipality}
          clearable={true}
        />
      </div>
    );
  };

  const renderAddress = () => {
    if (addressContent.compact_municipality_and_address || addressContent.compact_municipality_and_address_and_building_name) return;
    if (addressContent.address === undefined) return;

    const addressLabel = addressContent.address_label?.trim() !== "" ? addressContent.address_label : "番地";

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-message__content--user-zip-code-address-label">{addressLabel}</div>
        <InputCustom
          id={`ss-user-input-address${indexContent}`}
          placeholder={addressContent.address}
          disabled={disabled}
          className="w-100-percent"
          onChange={(value) =>
            onChangeValue(indexContent, content.type, value, "value_address")
          }
          value={addressContent.value_address}
          clearable={true}
        />
      </div>
    );
  }

  const renderBuildingName = () => {
    if (addressContent.building_name === undefined) return;
    const buildingNameLabel = addressContent.building_name_label?.trim() !== "" ? addressContent.building_name_label : "建物名";

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-message__content--user-zip-code-address-label">{buildingNameLabel}</div>
        <InputCustom
          id={`ss-user-input-building${indexContent}`}
          placeholder={addressContent.building_name}
          disabled={disabled}
          className="w-100-percent"
          onChange={(value) =>
            onChangeValue(indexContent, content.type, value, "value_building_name")
          }
          value={addressContent.value_building_name}
          clearable={true}
        />
      </div>
    );
  };

  const renderErrorMessage = () => {
    return (
      <div className="validation-error-message">
        {errors?.[`message${indexMessage}_content${indexContent}_${content.type}`]}
      </div>
    );
  };

  return (
    <div className="m-b-10">
      {renderSearchLink()}
      {renderTitle()}
      {renderPostCode()}
      {renderPrefecture()}
      {renderMunicipality()}
      {renderAddress()}
      {renderBuildingName()}
      {renderErrorMessage()}
    </div>
  );
};