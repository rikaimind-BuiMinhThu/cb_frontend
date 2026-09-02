import _ from 'lodash';
import { findItem } from "./Utils";
import { findContentsByFukushashikiSearchValue } from "v2/views/Preview/PreviewFukushashiki/LPUtils";

const BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS = {
  TEL1: 'input[name="order[shipping_address_attributes][tel01]"]',
  TEL2: 'input[name="order[shipping_address_attributes][tel02]"]',
  TEL3: 'input[name="order[shipping_address_attributes][tel03]"]',
  ZIP_CODE1: 'input[name="order[shipping_address_attributes][zip01]"]',
  ZIP_CODE2: 'input[name="order[shipping_address_attributes][zip02]"]',
  PREFECTURE: 'order_shipping_address_attributes_prefecture_name',
  CITY: 'input[name="order[shipping_address_attributes][addr01]"]',
  STREET_ADDRESS: 'input[name="order[shipping_address_attributes][addr02]"]',
  NAME1: 'order_shipping_address_attributes_name1',
  NAME2: 'order_shipping_address_attributes_name2',
  EMAIL: 'email',
}

export const mapAmazonPayDataToMessagesListForBliss = (amazonPayData, messagesList, prefectureList) => {
  // No support for other customer and other cart system
  if (!amazonPayData || amazonPayData.cartSystem !== "ECFORCE") return messagesList;

  const newMessagesList = _.cloneDeep(messagesList);

  const {
    profileName1, profileName2, profileZipCode1, profileZipCode2,
    profilePrefecture, profileCity, profileStreetAddress, profileTel1,
    profileTel2, profileTel3, profileEmail
  } = amazonPayData;
  const userMessages = newMessagesList.filter(message => message.belong_to === "user");
  if (!userMessages) return newMessagesList;

  const name1Contents = findContentsByFukushashikiSearchValue(userMessages, 'left_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME1);
  if (name1Contents.length > 0) {
    name1Contents.forEach(content => content.text_input.text.valueLeft = profileName1);
  }

  const name2Contents = findContentsByFukushashikiSearchValue(userMessages, 'right_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME2);
  if (name2Contents.length > 0) {
    name2Contents.forEach(content => content.text_input.text.valueRight = profileName2);
  }

  const zipCode1Contents = findContentsByFukushashikiSearchValue(userMessages, 'post_code_left_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE1);
  if (zipCode1Contents.length > 0) {
    zipCode1Contents.forEach(content => content.zip_code_address.value_post_code_left = profileZipCode1);
  }

  const zipCode2Contents = findContentsByFukushashikiSearchValue(userMessages, 'post_code_right_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE2);
  if (zipCode2Contents.length > 0) {
    zipCode2Contents.forEach(content => content.zip_code_address.value_post_code_right = profileZipCode2);
  }

  const prefectureContents = findContentsByFukushashikiSearchValue(userMessages, 'prefecture_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.PREFECTURE);
  if (prefectureContents.length > 0) {
    const prefectureItem = findItem(prefectureList, {
      keys: ["name"],
      value: profilePrefecture,
      onSuccess: (item)=> item.id,
      callbackValue: profilePrefecture,
    });
    prefectureContents.forEach(content => content.zip_code_address.value_prefecture = prefectureItem);
  }

  const cityContents = findContentsByFukushashikiSearchValue(userMessages, 'municipality_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.CITY);
  if (cityContents.length > 0) {
    cityContents.forEach(content => content.zip_code_address.value_municipality = profileCity);
  }

  const streetAddressContents = findContentsByFukushashikiSearchValue(userMessages, 'address_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.STREET_ADDRESS);
  if (streetAddressContents.length > 0) {
    streetAddressContents.forEach(content => content.zip_code_address.value_address = profileStreetAddress);
  }

  const tel1Contents = findContentsByFukushashikiSearchValue(userMessages, 'value1_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL1);
  if (tel1Contents.length > 0) {
    tel1Contents.forEach(content => content.text_input.phone_number.value1 = profileTel1);
  }

  const tel2Contents = findContentsByFukushashikiSearchValue(userMessages, 'value2_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL2);
  if (tel2Contents.length > 0) {
    tel2Contents.forEach(content => content.text_input.phone_number.value2 = profileTel2);
  }

  const tel3Contents = findContentsByFukushashikiSearchValue(userMessages, 'value3_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL3);
  if (tel3Contents.length > 0) {
    tel3Contents.forEach(content => content.text_input.phone_number.value3 = profileTel3);
  }

  const emailContents = findContentsByFukushashikiSearchValue(userMessages, 'fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.EMAIL);
  if (emailContents.length > 0) {
    emailContents.forEach(content => content.text_input.email_address.value = profileEmail);
  }

  return newMessagesList;
}

export const isBlissLpAmazonData = (message) => {
  return findContentsByFukushashikiSearchValue(message, 'value1_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL1).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'value2_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL2).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'value3_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL3).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'post_code_left_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE1).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'post_code_right_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE2).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'prefecture_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.PREFECTURE).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'municipality_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.CITY).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'address_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.STREET_ADDRESS).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'left_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME1).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'right_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME2).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.EMAIL).length > 0;
}

export const isBlissLP = (url) => {
  const domains = [
    // Comment out if you want to test bliss in localhost
    // "localhost:8000",
    // "commerceforce.co.jp",
    "skull-shaver.jp",
  ];

  return domains.some(domain => url.includes(domain));
}