import React from "react";
import InputCustom from "../../ScenarioSetting/scenarioComon/InputCustom";
import SelectCustom from "../../ScenarioSetting/scenarioComon/SelectCustom";
import { NUMBER_REGEX } from "../../PreviewComponent/Constants";
import "assets/css/bot/preview-chat-bot.css";
import { tokenExpired } from "api/tokenExpired";
import { stringNullOrEmpty, getAddressFromZipCode } from "../../PreviewComponent/Utils";

const ZipCodeAddress = ({
  content,
  zipCodeAddress,
  disabled,
  indexContent,
  messageIndex,
  messageContent,
  errors,
  prefecturesList,
  onChangeValue,
  onChangeErrors,
  moveToNext,
  toggleZipCodePopup,
}) => {
  if (content.type !== "zip_code_address") return null;

  const errorMessageKey = `message${messageIndex}_content${indexContent}_${messageContent[indexContent].type}`;

  const renderAddressField = (address) => {
    if (address.compact_municipality_and_address || address.compact_municipality_and_address_and_building_name) return;
    if (address.address === undefined) return;

    return (renderInputField("value_address", "address", "address_label", "番地"));
  }

  const renderSearchLink = () => {
    return (
      <div className="zip-code-address-search-link"
        style={{color: !disabled ? "#2c76f0" : "gray"}}
      >
        <span
          style={!disabled ? { cursor: "pointer" } : {}}
          onClick={() => {
            console.log("messageIndex: ", messageIndex);
            if (disabled !== true) toggleZipCodePopup(true, indexContent, messageIndex);
          }}
        >
          〒検索はこちら
        </span>
      </div>
    )
  }

  const renderRequired = () => {
    if (!zipCodeAddress.title_require && !zipCodeAddress.isCheckRequire) return null;
    const isRequired = zipCodeAddress.isCheckRequire === "all_items_require" || zipCodeAddress.isCheckRequire === "require";

    return (
      <div className="zip-code-address-title-required ss-message__content--user-pull_down-top">
        {zipCodeAddress.title_require && (
          <span className="ss-message__content--user-pull_down-title">
            {zipCodeAddress.title}
          </span>
        )}
        {isRequired && (
          <span className="ss-message__content--user-text-input-required">
            ※必須
          </span>
        )}
      </div>
    )
  }

  const changeAddressFromZipCode = (zipCode) => {
    getAddressFromZipCode(zipCode).then((res) => {
      if (res.data && res.data.code === 1) {
        onChangeValue(indexContent, content.type, res.data.data.prefecture_name, "value_prefecture");
        if (zipCodeAddress.compact_municipality_and_address) {
          onChangeValue(indexContent, content.type, `${res.data.data.city_name}${res.data.data.town_name}`, "value_municipality");
        } else if (zipCodeAddress.compact_municipality_and_address_and_building_name) {
          onChangeValue(indexContent, content.type, `${res.data.data.city_name}${res.data.data.town_name}${res.data.data.building_name}`.replace('undefined', ''), "value_municipality");
        } else {
          onChangeValue(indexContent, content.type, res.data.data.city_name, "value_municipality");
          onChangeValue(indexContent, content.type, res.data.data.town_name, "value_address");
        }
        onChangeErrors(errorMessageKey, "");
        moveToNext(`ss-user-input-address${indexContent}`);
      } else {
        onChangeErrors(errorMessageKey, "無効な郵便番号です。");
      }
    })
    .catch((error) => {
      onChangeErrors(errorMessageKey, "無効な郵便番号です。");
      if (error.response?.data.code === 0) {
        tokenExpired();
      }
    });
  }

  const renderUnsplitPostCodeField = () => {
    if (zipCodeAddress.split_postal_code === true) return null;

    return (
      <InputCustom
        type="tel"
        inputMode="numeric"
        placeholder={zipCodeAddress.post_code}
        disabled={disabled}
        onKeyPress={(e) => {
          if (e.target.value.length >= 7) e.preventDefault();
        }}
        style={{ width: "100%", marginLeft: "0px" }}
        onChange={(value) => {
          if (value && !NUMBER_REGEX.test(value)) return;
          onChangeValue(
            indexContent,
            content.type,
            value,
            "value_post_code"
          );
          if ((value + "").length === 7) {
            changeAddressFromZipCode(value);
          } else if ((value + "").length !== 0) {
            onChangeErrors(errorMessageKey, "無効な郵便番号です。");
          } else {
            onChangeErrors(errorMessageKey, "");
          }
        }}
        value={zipCodeAddress.value_post_code}
        clearable={true}
      />
    )
  }

  const renderSplitPostCodeField = () => {
    if (zipCodeAddress.split_postal_code !== true) return null;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <InputCustom
          type="tel"
          inputMode="numeric"
          placeholder={zipCodeAddress.post_code_left}
          disabled={disabled}
          style={{ width: "49%" }}
          onKeyPress={(e) => {
            if (e.target.value.length >= 3) e.preventDefault();
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
            
            if (
              (value + "").length === 3 &&
              zipCodeAddress.value_post_code_right &&
              (zipCodeAddress.value_post_code_right + "")
                .length === 4
            ) {
              changeAddressFromZipCode(`${value}${zipCodeAddress.value_post_code_right}`);
            } else if (
              (value + "").length !== 0 ||
              (zipCodeAddress.value_post_code_right + "")
                .length !== 0
            ) {
              onChangeErrors(errorMessageKey, "無効な郵便番号です。");
            } else {
              onChangeErrors(errorMessageKey, "");
            }
          }}
          value={zipCodeAddress.value_post_code_left}
          clearable={true}
        />
        <InputCustom
          type="tel"
          inputMode="numeric"
          placeholder={zipCodeAddress.post_code_right}
          disabled={disabled}
          id={`ss-user-post-code-right-input${indexContent}`}
          style={{ width: "49%" }}
          onKeyPress={(e) => {
            if (e.target.value.length >= 4) e.preventDefault();
          }}
          onChange={async (value) => {
            if (value && !NUMBER_REGEX.test(value)) return;
            onChangeValue(
              indexContent,
              content.type,
              value,
              "value_post_code_right"
            );
            if (
              (value + "").length === 4 &&
              zipCodeAddress.value_post_code_left &&
              (zipCodeAddress.value_post_code_left + "")
                .length === 3
            ) {
              changeAddressFromZipCode(`${zipCodeAddress.value_post_code_left}${value}`);
            } else if (
              (value + "").length !== 0 ||
              (zipCodeAddress.value_post_code_left + "")
                .length !== 0
            ) {
              onChangeErrors(errorMessageKey, "無効な郵便番号です。");
            } else {
              onChangeErrors(errorMessageKey, "");
            }
          }}
          value={zipCodeAddress.value_post_code_right}
          clearable={true}
        />
      </div>
    )
  }

  const renderErrorMessages = () => {
    const errorMessage = errors?.[
      `message${messageIndex}_content${indexContent}_${content.type}`
    ];
    if (!errorMessage) return null;

    return (
      <div className="zip-code-address-error-message">
        {errorMessage}
      </div>
    )
  }

  const renderPostCodeField = () => {
    if (zipCodeAddress.post_code === undefined) return null;

    const postCodeLabel = stringNullOrEmpty(zipCodeAddress.post_code_label) ? '郵便番号' : zipCodeAddress.post_code_label;

    return (
      <div className="zip-code-address-post-code ss-user-setting__item-bottom">
        <div className="zip-code-address-post-code-label">
          {postCodeLabel}
        </div>
        {zipCodeAddress.split_postal_code !== true ? renderUnsplitPostCodeField() : renderSplitPostCodeField()}
      </div>
    )
  }

  const renderFieldLabel = (label, defaultLabel) => {
    if (label && label.trim() !== "") return label;
    return defaultLabel;
  }

  const renderInputField = (fieldValue, placeholderField, labelField, defaultLabelValue) => {
    if (zipCodeAddress[placeholderField] === undefined) return null;

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="zip-code-address-field-label">
          {renderFieldLabel(zipCodeAddress[labelField], defaultLabelValue)}
        </div>
        <InputCustom
          placeholder={zipCodeAddress[placeholderField]}
          disabled={disabled}
          style={{ width: "100%" }}
          onChange={(value) => onChangeValue(indexContent, content.type, value, fieldValue)}
          value={zipCodeAddress[fieldValue]}
          clearable={true}
        />
      </div>
    )
  }

  const findPrefectureNameById = (prefectureId) => {
    if (!prefectureId) return "";
    
    return prefecturesList.find((item) => item.id === prefectureId)?.name || prefectureId;
  }

  return (
    <div className="zip-code-address-container">
      {renderSearchLink()}
      {renderRequired()}
      {renderPostCodeField()}
      {zipCodeAddress.prefecture !== undefined && (
        <div className="ss-user-setting__item-bottom">
          <div
            style={{
              fontWeight: "400",
              fontSize: "12px",
              width: "100%",
              marginBottom: "3px",
            }}
          >
            {zipCodeAddress.prefecture_label && zipCodeAddress.prefecture_label.trim() !== ""
              ? zipCodeAddress.prefecture_label
              : '都道府県'}
          </div>
          {zipCodeAddress.is_use_dropdown ? (
            <SelectCustom
              style={{ width: "100%" }}
              value={zipCodeAddress?.value_prefecture}
              data={prefecturesList}
              keyValue="id"
              nameValue="name"
              placeholder={zipCodeAddress.prefecture}
              onChange={(value) =>
                onChangeValue(
                  indexContent,
                  content.type,
                  value,
                  "value_prefecture"
                )
              }
            />
          ) : (
            <InputCustom
              placeholder={zipCodeAddress.prefecture}
              disabled={disabled}
              style={{ width: "100%" }}
              onChange={(value) =>
                onChangeValue(
                  indexContent,
                  content.type,
                  value,
                  "value_prefecture"
                )
              }
              value={findPrefectureNameById(zipCodeAddress.value_prefecture)}
              clearable={true}
            />
          )}
        </div>
      )}
      {renderInputField("value_municipality", "municipality", "municipality_label", "市区町村")}
      {renderAddressField(zipCodeAddress, indexContent, content)}
      {renderInputField("value_building_name", "building_name", "building_name_label", "建物名")}
      {renderErrorMessages()}
    </div>
  );
};

export default ZipCodeAddress;
