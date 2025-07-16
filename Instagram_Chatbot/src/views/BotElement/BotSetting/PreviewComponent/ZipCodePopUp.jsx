import React, { useEffect, useState } from "react";
import "assets/css/bot/preview-chat-bot.css";
import "moment/locale/zh-cn";
import { getTownsByCity, getCitiesByPrefecture } from "./Utils";
import { MDBIcon } from "mdbreact";
import SelectCustom from "../ScenarioSetting/scenarioComon/SelectCustom";

const ZipCodePopUp = ({
  isPopUpZipCode,
  prefecturesList,
  message,
  messageIndex,
  zipcodeContentIndex,
  onChangeValue,
  onChangeErrors,
  errors = {},
}) => {
  const [state, setState] = useState({});

  const onChangePrefecture = (value) => {
    if (!value) return;
    const prefecture_jis_code = prefecturesList.find((item) => item.id === value)?.prefecture_jis_code;
    
    if (!prefecture_jis_code) {
      console.error("prefecture_jis_code not found");
      return;
    }

    getCitiesByPrefecture(prefecture_jis_code)
      .then((res) => {
        if (res.data.code !== 1) return;

        const newState = { ...state };
        newState.citiesList = res.data.data;

        newState.selectedPrefecture = value;
        newState.selectedCity = null;
        newState.selectedTown = null;
        newState.selectedZipcode = null;
        setState(newState);
      })
      .catch((error) => {
        const newState = { ...state };

        newState.selectedPrefecture = value;
        newState.selectedCity = null;
        newState.selectedTown = null;
        newState.selectedZipcode = null;
        setState(newState);
      });
  };

  const onChangeCity = (value) => {
    if (!value) return;

    let city_jis_code = state.citiesList.find((item) => item.city_name === value)?.city_jis_code;

    if (!city_jis_code) {
      console.error("city_jis_code not found");
      return;
    }

    getTownsByCity(city_jis_code)
      .then((res) => {
        if (res.data.code !== 1) return;
        const newState = { ...state };
        newState.townsList = res.data.data;

        newState.selectedCity = value;
        newState.selectedTown = null;
        newState.selectedZipcode = null;

        setState(newState);
      })
      .catch((error) => {
        const newState = { ...state };

        newState.selectedCity = value;
        newState.selectedTown = null;
        newState.selectedZipcode = null;

        setState(newState);
      });
  };

  const onChangeTown = (value) => {
    if (!value) return;

    const newState = { ...state };
    newState.selectedTown = value;

    const zipcode = state.townsList.find((item) => item.town_name === value)?.zip_code;
    newState.selectedZipcode = zipcode;

    setState(newState);
  };

  const onSelectZipcode = () => {
    let index = zipcodeContentIndex; 
    if (!zipcodeContentIndex) {
      index = message.message_content
        .findIndex((item) => item.type === "zip_code_address");
    }

    if (state.selectedZipcode) {
      document.getElementById("sp-withdrawal-container").style.display = "none";
      document.getElementById("sp-popup-zip-code-address").style.display = "none";

      let newErrors = { ...errors };
      newErrors[`message${messageIndex}_content${index}_zip_code_address`] = "";

      const newZipCodeAddress = {
        value_post_code: state.selectedZipcode,
        value_post_code_left: state.selectedZipcode.slice(0, 3),
        value_post_code_right: state.selectedZipcode.slice(3),
        value_prefecture: state.selectedPrefecture,
        value_municipality: `${state.selectedCity}${state.selectedTown}`,
      };

      onChangeValue(index, "zip_code_address", newZipCodeAddress, null, null, null, message);
      // TODO: Need refactor for this part to render only 1 time instead of 2 times
      onChangeErrors(`message${messageIndex}_content${zipcodeContentIndex}_zip_code_address`, "");
    }
  };

  if (!prefecturesList) return null;

  return (
    <div id="sp-popup-zip-code-address" className="sp-popup-zip-code-address">
      <div className="sp-popup-zip-code-address-header">
        <div className="sp-popup-zip-code-address-header-left">
          住所で郵便番号を検索する
        </div>
        <div className="sp-popup-zip-code-address-header-right">
          <MDBIcon
            style={{ width: "5%", marginLeft: "3px", cursor: "pointer" }}
            fas
            onClick={() => isPopUpZipCode(false)}
            icon="times"
            className={"sp-plus-circle-option-icon-times-custom"}
          />
        </div>
      </div>
      <div className="sp-popup-zip-code-address-body">
        <div className="sp-popup-zip-code-address-body-form">
          <SelectCustom
            style={{ width: "100%", marginBottom: "7px" }}
            keyValue="id"
            nameValue="name"
            placeholder="都道府県を選択してください"
            data={prefecturesList}
            onChange={onChangePrefecture}
            value={state.selectedPrefecture}
          />
          <SelectCustom
            style={{ width: "100%", marginBottom: "7px" }}
            keyValue="city_name"
            nameValue="city_name"
            placeholder="市区を選択してください"
            data={state.citiesList || []}
            onChange={onChangeCity}
            value={state.selectedCity}
          />
          <SelectCustom
            style={{ width: "100%", marginBottom: "7px" }}
            keyValue="town_name"
            nameValue="town_name"
            placeholder="町村を選択してください"
            data={state.townsList || []}
            onChange={onChangeTown}
            value={state.selectedTown}
          />
          {state.selectedZipcode && (
            <div className="sp-popup-zip-code-address-body-form-content">
              〒{state.selectedZipcode}
            </div>
          )}
        </div>
        <div className="sp-popup-zip-code-address-body-button">
          <div
            className="sp-popup-zip-code-address-body-button-cancel"
            onClick={() => isPopUpZipCode(false)}
          >
            キャンセル
          </div>
          <div
            className="sp-popup-zip-code-address-body-button-selection"
            style={state.selectedZipcode ? {} : { opacity: "0.5" }}
            onClick={onSelectZipcode}
          >
            選択
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZipCodePopUp;