import _ from 'lodash';
import { findItem } from "./Utils";
import { findContentsByFukushashikiSearchValue } from "../PreviewFukushashiki/LPUtils";

const ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS = {
  NAME1: 'input[name="order[shipping_address_attributes][name01]"]',
  KANA_NAME1: 'input[name="order[shipping_address_attributes][kana01]"]',
  KANA_NAME2: 'input[name="order[shipping_address_attributes][kana02]"]',
  EMAIL: 'input[name="order[email]"]',
  EMAIL_CONFIRMATION: 'input[name="order[email_confirmation]"]',
  TEL1: 'input[name="order[shipping_address_attributes][tel01]"]',
  TEL2: 'input[name="order[shipping_address_attributes][tel02]"]',
  TEL3: 'input[name="order[shipping_address_attributes][tel03]"]',
  ZIP_CODE1: 'input[name="order[shipping_address_attributes][zip01]"]',
  ZIP_CODE2: 'input[name="order[shipping_address_attributes][zip02]"]',
  PREFECTURE: 'select[name="order[shipping_address_attributes][prefecture_id]"]',
  ADDRESS1: 'input[name="order[shipping_address_attributes][addr01]"]',
  ADDRESS2: 'input[name="order[shipping_address_attributes][addr02]"]',
}

export const mapAmazonPayDataToMessagesListForRoseMay = (amazonPayData, messagesList, prefectureList) => {
  // No support for other customer and other cart system
  if (!amazonPayData || amazonPayData.cartSystem !== "ECFORCE") return messagesList;

  const newMessagesList = _.cloneDeep(messagesList);

  const {
    name1, kanaName1, kanaName2, zipCode1, zipCode2,
    prefecture, address1, address2, tel1, tel2, tel3,
    email, emailConfirmation,
  } = amazonPayData;
  const userMessages = newMessagesList.filter(message => message.belong_to === "user");
  if (!userMessages) return newMessagesList;

  const name1Contents = findContentsByFukushashikiSearchValue(userMessages, 'fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME1);
  if (name1Contents.length > 0) {
    name1Contents.forEach(content => content.text_input.text.value = name1);
  }

  const kanaName1Contents = findContentsByFukushashikiSearchValue(userMessages, 'right_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.KANA_NAME1);
  if (kanaName1Contents.length > 0) {
    kanaName1Contents.forEach(content => content.text_input.text.valueRight = kanaName1);
  }

  const kanaName2Contents = findContentsByFukushashikiSearchValue(userMessages, 'left_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.KANA_NAME2);
  if (kanaName2Contents.length > 0) {
    kanaName2Contents.forEach(content => content.text_input.text.valueLeft = kanaName2);
  }

  const zipCode1Contents = findContentsByFukushashikiSearchValue(userMessages, 'post_code_left_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE1);
  if (zipCode1Contents.length > 0) {
    zipCode1Contents.forEach(content => content.zip_code_address.value_post_code_left = zipCode1);
  }

  const zipCode2Contents = findContentsByFukushashikiSearchValue(userMessages, 'post_code_right_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE2);
  if (zipCode2Contents.length > 0) {
    zipCode2Contents.forEach(content => content.zip_code_address.value_post_code_right = zipCode2);
  }

  const prefectureContents = findContentsByFukushashikiSearchValue(userMessages, 'prefecture_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.PREFECTURE);
  if (prefectureContents.length > 0) {
    const prefectureItem = findItem(prefectureList, {
      keys: ["name"],
      value: prefecture,
      onSuccess: (item)=> item.id,
      callbackValue: prefecture,
    });
    prefectureContents.forEach(content => content.zip_code_address.value_prefecture = prefectureItem);
  }

  const address1Contents = findContentsByFukushashikiSearchValue(userMessages, 'municipality_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.ADDRESS1);
  if (address1Contents.length > 0) {
    address1Contents.forEach(content => content.zip_code_address.value_municipality = address1);
  }

  const address2Contents = findContentsByFukushashikiSearchValue(userMessages, 'address_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.ADDRESS2);
  if (address2Contents.length > 0) {
    address2Contents.forEach(content => content.zip_code_address.value_address = address2);
  }

  const tel1Contents = findContentsByFukushashikiSearchValue(userMessages, 'value1_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL1);
  if (tel1Contents.length > 0) {
    tel1Contents.forEach(content => content.text_input.phone_number.value1 = tel1);
  }

  const tel2Contents = findContentsByFukushashikiSearchValue(userMessages, 'value2_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL2);
  if (tel2Contents.length > 0) {
    tel2Contents.forEach(content => content.text_input.phone_number.value2 = tel2);
  }

  const tel3Contents = findContentsByFukushashikiSearchValue(userMessages, 'value3_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL3);
  if (tel3Contents.length > 0) {
    tel3Contents.forEach(content => content.text_input.phone_number.value3 = tel3);
  }

  const emailContents = findContentsByFukushashikiSearchValue(userMessages, 'value_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.EMAIL);
  if (emailContents.length > 0) {
    emailContents.forEach(content => {
      content.text_input.email_confirmation.value = email;
      content.text_input.email_confirmation.valueConfirm = emailConfirmation;
    });
  }

  return newMessagesList;
}

export const isRoseMayLpAmazonData = (message) => {
  return findContentsByFukushashikiSearchValue(message, 'value1_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL1).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'value2_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL2).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'value3_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL3).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'post_code_left_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE1).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'post_code_right_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE2).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'prefecture_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.PREFECTURE).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'municipality_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.ADDRESS1).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'address_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.ADDRESS2).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME1).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'right_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.KANA_NAME1).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'left_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.KANA_NAME2).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'value_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.EMAIL).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'valueConfirm_fukushashiki_search_value', ROSEMAY_AMAZON_FUKUSHASHIKI_ELEMENTS.EMAIL_CONFIRMATION).length > 0;
}

export const isRoseMayLP = (url) => {
  const domains = [
    // TODO: Update RoseMay domains nếu cần test ở môi trường khác
    "rosemay.net",
    "rosemay.jp",
  ];

  return domains.some(domain => url.includes(domain));
}

