import { findItem } from "./Utils";

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

const findContentByFukushashikiSearchValue = (userMessages, fukushaKey, fukushaValue) => {
  let result = null;
  userMessages.forEach(message => {
    message.message_content.forEach(content => {
      if (content[fukushaKey] === fukushaValue) {
        content = content;
      }
    });
  });
  return result;
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

  const name1Content = findContentByFukushashikiSearchValue(userMessages, 'left_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME1);
  if (name1Content) {
    name1Content.text_input.text.valueLeft = profileName1;
  }

  const name2Content = findContentByFukushashikiSearchValue(userMessages, 'right_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME2);
  if (name2Content) {
    name2Content.text_input.text.valueRight = profileName2;
  }

  const zipCode1Content = findContentByFukushashikiSearchValue(userMessages, 'post_code_left_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE1);
  if (zipCode1Content) {
    zipCode1Content.zip_code_address.value_post_code_left = profileZipCode1;
  }

  const zipCode2Content = findContentByFukushashikiSearchValue(userMessages, 'post_code_right_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE2);
  if (zipCode2Content) {
    zipCode2Content.zip_code_address.value_post_code_right = profileZipCode2;
  }

  const prefectureContent = findContentByFukushashikiSearchValue(userMessages, 'prefecture_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.PREFECTURE);
  if (prefectureContent) {
    prefectureContent.zip_code_address.value_prefecture = findItem(prefectureList, {
      keys: ["name"],
      value: profilePrefecture,
      onSuccess: (item)=> item.id,
      callbackValue: profilePrefecture,
    });
  }

  const cityContent = findContentByFukushashikiSearchValue(userMessages, 'municipality_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.CITY);
  if (cityContent) {
    cityContent.zip_code_address.value_municipality = profileCity;
  }

  const streetAddressContent = findContentByFukushashikiSearchValue(userMessages, 'address_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.STREET_ADDRESS);
  if (streetAddressContent) {
    streetAddressContent.zip_code_address.value_address = profileStreetAddress;
  }

  const tel1Content = findContentByFukushashikiSearchValue(userMessages, 'value1_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL1);
  if (tel1Content) {
    tel1Content.text_input.phone_number.value1 = profileTel1;
  }

  const tel2Content = findContentByFukushashikiSearchValue(userMessages, 'value2_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL2);
  if (tel2Content) {
    tel2Content.text_input.phone_number.value2 = profileTel2;
  }

  const tel3Content = findContentByFukushashikiSearchValue(userMessages, 'value3_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL3);
  if (tel3Content) {
    tel3Content.text_input.phone_number.value3 = profileTel3;
  }

  const emailContent = findContentByFukushashikiSearchValue(userMessages, 'fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.EMAIL);
  if (emailContent) {
    emailContent.text_input.email_address.value = profileEmail;
  }

  return newMessagesList;
}

export const isBlissLpAmazonData = (message) => {
  const isTel1 = !!findContentByFukushashikiSearchValue(message, 'value1_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL1);
  const isTel2 = !!findContentByFukushashikiSearchValue(message, 'value2_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL2);
  const isTel3 = !!findContentByFukushashikiSearchValue(message, 'value3_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL3);
  const isZipCode1 = !!findContentByFukushashikiSearchValue(message, 'post_code_left_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE1);
  const isZipCode2 = !!findContentByFukushashikiSearchValue(message, 'post_code_right_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE2);
  const isPrefecture = !!findContentByFukushashikiSearchValue(message, 'prefecture_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.PREFECTURE);
  const isCity = !!findContentByFukushashikiSearchValue(message, 'municipality_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.CITY);
  const isStreetAddress = !!findContentByFukushashikiSearchValue(message, 'address_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.STREET_ADDRESS);
  const isName1 = !!findContentByFukushashikiSearchValue(message, 'left_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME1);
  const isName2 = !!findContentByFukushashikiSearchValue(message, 'right_fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME2);
  const isEmail = !!findContentByFukushashikiSearchValue(message, 'fukushashiki_search_value', BLISS_AMAZON_FUKUSHASHIKI_ELEMENTS.EMAIL);
  return isTel1 || isTel2 || isTel3 || isZipCode1 || isZipCode2 || isPrefecture || isCity || isStreetAddress || isName1 || isName2 || isEmail;
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