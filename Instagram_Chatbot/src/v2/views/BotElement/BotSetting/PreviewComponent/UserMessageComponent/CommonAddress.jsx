import React from 'react';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import "v2/assets/css/bot/preview-chat-bot.css";
import { EMPTY_INPUT_VALUE, MESSAGE_CONTENT_TYPES, NUMBER_REGEX, REQUIRED_FIELD_LABEL } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";
import { getAddressFromZipCode, moveToNext } from "v2/views/BotElement/BotSetting/PreviewComponent/Utils";

import InputCustom from "v2/components/BotMessages/InputCustom";
import SelectCustom from "v2/components/BotMessages/SelectCustom";

const REQUIRE_CHECK_EACH_ITEM = "set_required_for_each_item";
const REQUIRE_CHECK_ALL_ITEMS = "all_items_require";
const REQUIRE_CHECK_REQUIRE = "require";
const INVALID_ZIP_CODE_ERROR = "無効な郵便番号です。";
const ZIP_SEARCH_LINK_LABEL = "〒検索はこちら";
const DEFAULT_POST_CODE_LABEL = "郵便番号";
const DEFAULT_PREFECTURE_LABEL = "都道府県";
const DEFAULT_MUNICIPALITY_LABEL = "市区町村";
const DEFAULT_ADDRESS_LABEL = "番地";
const DEFAULT_BUILDING_NAME_LABEL = "建物名";
const REQUIRED_ITEM_KEYS = ["postCode", "prefecture", "municipality", "address", "buildingName"];

const CommonAddress = ({ content, prefecturesList, messageIndexRender, messageIndex, contentIndex, messageContent, onChangeValue, onChangeErrors, errors, disabled, onOpen, isDisplayError = true }) => {
  if (content.type !== MESSAGE_CONTENT_TYPES.ZIP_CODE_ADDRESS && content.type !== MESSAGE_CONTENT_TYPES.SHIPPING_ADDRESS) return <></>;

  const addressContent = content.type === MESSAGE_CONTENT_TYPES.ZIP_CODE_ADDRESS ? content.zip_code_address : content.shipping_address;
  if (!addressContent) return <></>;

  const getPrefectureIdCodeFromName = (name) => {
    return prefecturesList.find((prefecture) => prefecture.name === name)?.id;
  };

  const renderTitle = () => {
    const title = addressContent.title_require && (
      <span className="ss-message__content--user-pull_down-title">
        {addressContent.title}
      </span>
    );

    const hasRequiredItem = () => {
      if (addressContent.isCheckRequire !== REQUIRE_CHECK_EACH_ITEM) return false;
      return REQUIRED_ITEM_KEYS.some((item) => addressContent[`${item}Required`]);
    };

    const isRequired = addressContent.isCheckRequire === REQUIRE_CHECK_ALL_ITEMS || addressContent.isCheckRequire === REQUIRE_CHECK_REQUIRE || hasRequiredItem();

    const requiredLabel = isRequired && (
      <span className="ss-message__content--user-text-input-required">
        {REQUIRED_FIELD_LABEL}
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
    return (
      <div className={`ss-message__content--user-zip-code-address-search-link${disabled ? " is-disabled" : ""}`}
      >
        <span
          onClick={() => {
            if (disabled !== true) onOpen(true, contentIndex);
          }}
        >
          {ZIP_SEARCH_LINK_LABEL}
        </span>
      </div>
    );
  };

  const changeInvalidZipCodeError = () => {
    const errorKey = `message${messageIndexRender}_content${contentIndex}_${messageContent[contentIndex].type}`;
    onChangeErrors(errorKey, INVALID_ZIP_CODE_ERROR);
  };

  const clearZipCodeError = () => {
    const errorKey = `message${messageIndexRender}_content${contentIndex}_${messageContent[contentIndex].type}`;
    onChangeErrors(errorKey, EMPTY_INPUT_VALUE);
  };

  const retrieveAddressFromZipCode = (zipCode) => {
    getAddressFromZipCode(zipCode).then((res) => {
      if (!res.data || res.data.code !== 1) {
        return changeInvalidZipCodeError();
      }

      const {town_name, city_name, prefecture_name, building_name} = res.data.data;
      const prefectureValue = addressContent.is_use_dropdown ? getPrefectureIdCodeFromName(prefecture_name) : prefecture_name;

      const newZipCodeAddress = addressContent.compact_municipality_and_address
        ? {
          value_prefecture: prefectureValue,
          value_municipality: `${city_name}${town_name}`,
        }
        : addressContent.compact_municipality_and_address_and_building_name
          ? {
            value_prefecture: prefectureValue,
            value_municipality: `${city_name}${town_name}${building_name}`.replace('undefined', EMPTY_INPUT_VALUE),
          }
          : {
            value_prefecture: prefectureValue,
            value_municipality: city_name,
            value_address: town_name,
          };

      onChangeValue(contentIndex, content.type, newZipCodeAddress.value_prefecture, "value_prefecture");
      onChangeValue(contentIndex, content.type, newZipCodeAddress.value_municipality, "value_municipality");
      onChangeValue(contentIndex, content.type, newZipCodeAddress.value_address, "value_address");
      onChangeValue(contentIndex, content.type, newZipCodeAddress.value_building_name, "value_building_name");

      moveToNext(`ss-user-input-address${contentIndex}`);
      clearZipCodeError();

    }).catch(() => {
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
        className="w-100-flush"
        onChange={async (value) => {
          onChangeValue(
            contentIndex,
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
        value={addressContent.value_post_code || EMPTY_INPUT_VALUE}
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
          containerClassName="w-39-percent"
          onKeyPress={(e) => {
            if (String(e.target.value).length >= 3) e.preventDefault();
          }}
          onChange={async (value) => {
            if (value && !NUMBER_REGEX.test(value)) return;

            onChangeValue(
              contentIndex,
              content.type,
              value,
              "value_post_code_left"
            );
            if ((value + "").length === 3) {
              moveToNext(`ss-user-post-code-right-input${contentIndex}`);
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
          value={addressContent.value_post_code_left || EMPTY_INPUT_VALUE}
          clearable={true}
        />
        <InputCustom
          type="tel"
          inputMode="numeric"
          placeholder={addressContent.post_code_right}
          disabled={disabled}
          id={`ss-user-post-code-right-input${contentIndex}`}
          containerClassName="w-59-percent"
          onKeyPress={(e) => {
            if (String(e.target.value).length >= 4) e.preventDefault();
          }}
          onChange={async (value) => {
            if (value && !NUMBER_REGEX.test(value)) return;
            onChangeValue(
              contentIndex,
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
          value={addressContent.value_post_code_right || EMPTY_INPUT_VALUE}
          clearable={true}
        />
      </div>
    );
  };

  const renderPostCode = () => {
    if (addressContent.post_code === undefined) return;
    const postCodeLabel = addressContent.post_code_label?.trim() !== EMPTY_INPUT_VALUE ? addressContent.post_code_label : DEFAULT_POST_CODE_LABEL;

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

    const prefectureLabel = addressContent.prefecture_label?.trim() !== EMPTY_INPUT_VALUE ? addressContent.prefecture_label : DEFAULT_PREFECTURE_LABEL;

    const prefectureInput = addressContent.is_use_dropdown ? (
      <SelectCustom
        className="w-100-percent"
        value={addressContent?.value_prefecture || EMPTY_INPUT_VALUE}
        data={prefecturesList}
        keyValue="id"
        nameValue="name"
        placeholder={addressContent.prefecture}
        onChange={(value) =>
          onChangeValue(contentIndex, content.type, value, "value_prefecture")
        }
      />
    ) : (
      <InputCustom
        placeholder={addressContent.prefecture}
        disabled={disabled}
        className="w-100-percent"
        onChange={(value) =>
          onChangeValue(contentIndex, content.type, value, "value_prefecture")
        }
        value={addressContent.value_prefecture || EMPTY_INPUT_VALUE}
        clearable={true}
      />
    );

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-message__content--user-zip-code-address-label">{prefectureLabel}</div>
        {prefectureInput}
      </div>
    );
  };

  const renderMunicipality = () => {
    if (addressContent.municipality === undefined) return;

    const municipalityLabel = addressContent.municipality_label?.trim() !== EMPTY_INPUT_VALUE ? addressContent.municipality_label : DEFAULT_MUNICIPALITY_LABEL;

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-message__content--user-zip-code-address-label">{municipalityLabel}</div>
        <InputCustom
          placeholder={addressContent.municipality}
          disabled={disabled}
          className="w-100-percent"
          onChange={(value) =>
            onChangeValue(contentIndex, content.type, value, "value_municipality")
          }
          value={addressContent.value_municipality || EMPTY_INPUT_VALUE}
          clearable={true}
        />
      </div>
    );
  };

  const renderAddress = () => {
    if ((addressContent.compact_municipality_and_address && !addressContent.is_display_address_field) || addressContent.compact_municipality_and_address_and_building_name) return;
    if (addressContent.address === undefined) return;

    const addressLabel = addressContent.address_label?.trim() !== EMPTY_INPUT_VALUE ? addressContent.address_label : DEFAULT_ADDRESS_LABEL;

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-message__content--user-zip-code-address-label">{addressLabel}</div>
        <InputCustom
          id={`ss-user-input-address${contentIndex}`}
          placeholder={addressContent.address}
          disabled={disabled}
          className="w-100-percent"
          onChange={(value) =>
            onChangeValue(contentIndex, content.type, value, "value_address")
          }
          value={addressContent.value_address || EMPTY_INPUT_VALUE}
          clearable={true}
        />
      </div>
    );
  };

  const renderBuildingName = () => {
    if (addressContent.compact_municipality_and_address_and_building_name) return;
    if (addressContent.building_name === undefined) return;
    const buildingNameLabel = addressContent.building_name_label?.trim() !== EMPTY_INPUT_VALUE ? addressContent.building_name_label : DEFAULT_BUILDING_NAME_LABEL;

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-message__content--user-zip-code-address-label">{buildingNameLabel}</div>
        <InputCustom
          id={`ss-user-input-building${contentIndex}`}
          placeholder={addressContent.building_name}
          disabled={disabled}
          className="w-100-percent"
          onChange={(value) =>
            onChangeValue(contentIndex, content.type, value, "value_building_name")
          }
          value={addressContent.value_building_name || EMPTY_INPUT_VALUE}
          clearable={true}
        />
      </div>
    );
  };

  const renderErrorMessage = () => {
    const errorKey = `message${messageIndex}_content${contentIndex}_${content.type}`;
    if (!isDisplayError || !errors?.[errorKey]) return null;

    return (
      <div className="validation-error-message">
        {errors?.[errorKey]}
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

CommonAddress.propTypes = {
  ...baseUserMessageComponentPropTypes,
};

export default CommonAddress;
