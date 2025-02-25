import american_express from "../../../../assets/img/payment-method/american_express.png";
import diner_club from "../../../../assets/img/payment-method/diner_club.png";
import discover from "../../../../assets/img/payment-method/discover.png";
import jcb from "../../../../assets/img/payment-method/jcb.png";
import master_card from "../../../../assets/img/payment-method/master_card.png";
import visa from "../../../../assets/img/payment-method/visa.png";

let dataHourFixed = [];
for (let i = 0; i <= 23; i++) {
  const formattedValue = i < 10 ? `0${i}` : i.toString();
  dataHourFixed.push({
    key: formattedValue,
    value: formattedValue,
  });
}

let dataMinutes = [];
for (let i = 0; i <= 59; i++) {
  const formattedValue = i < 10 ? `0${i}` : i.toString();
  dataMinutes.push({
    key: formattedValue,
    value: formattedValue,
  });
}

let dataYearFixed = [];
for (let i = 1935; i <= 2072; i++) {
  dataYearFixed.push({
    key: i.toString(),
    value: i.toString(),
  });
}

let dataMonth = [];
for (let i = 1; i <= 12; i++) {
  const formattedValue = i < 10 ? `0${i}` : i.toString();
  dataMonth.push({
    key: formattedValue,
    value: formattedValue,
  });
}

let dataDay = [];
for (let i = 1; i <= 31; i++) {
  const formattedValue = i < 10 ? `0${i}` : i.toString();
  dataDay.push({
    key: formattedValue,
    value: formattedValue,
  });
}

const dataPaymentMethod = [
  {
    key: "visa",
    value: <img src={visa} />,
  },
  {
    key: "jcb",
    value: <img src={jcb} />,
  },
  {
    key: "master_card",
    value: <img src={master_card} />,
  },
  {
    key: "american_express",
    value: <img src={american_express} />,
  },
  {
    key: "diner_club",
    value: <img src={diner_club} />,
  },
  {
    key: "discover",
    value: <img src={discover} />,
  },
];

const installmentOptions = Array.from({ length: 23 }, (_, i) => ({
  key: i + 2,
  value: `${i + 2}`,
}));

const SCAN_REGEX = /\{\{(.*?)\}\}/g;
const CHATBOT_SERVER = {
  SCENARIO_USER_RESPONSE_PATH: '/api/v1/scenario_users/scenario_user_responses',
  SCENARIO_CREATE_ORDER_PATH: '/api/v1/scenario_users/scenario_user_responses/create_order',
  CONVERSION_PATH: '/api/v1/analytics/scenario_counts/:scenario_id',
  GET_CITIES_PATH: '/api/v1/cities?prefecture_jis_code=:prefecture_jis_code',
  GET_TOWNS_PATH: '/api/v1/towns?city_jis_code=:city_jis_code',
};

export {
  dataHourFixed,
  dataMinutes,
  dataYearFixed,
  dataMonth,
  dataDay,
  dataPaymentMethod,
  installmentOptions,
  SCAN_REGEX,
  CHATBOT_SERVER,
};