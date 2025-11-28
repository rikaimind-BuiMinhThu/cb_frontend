import { findItem } from "./Utils";

export const mapAmazonPayDataToMessagesListForBliss = (amazonPayData, messagesList, prefectureList) => {
  // No support for other customer and other cart system
  if (!amazonPayData || amazonPayData.cartSystem !== "ECFORCE") return messagesList;

  const newMessagesList = _.cloneDeep(messagesList);

  const {
    profileName1, profileName2, profileZipCode1, profileZipCode2,
    profilePrefecture, profileCity, profileStreetAddress, profileTel1,
    profileTel2, profileTel3
  } = amazonPayData;
  const userMessages = newMessagesList.filter(message => message.belong_to === "user");
  if (!userMessages) return newMessagesList;

  const messageProfileName1= userMessages?.find(message => message.message_content.find(content => content.left_fukushashiki_search_value === "order_billing_address_attributes_name1"));
  if (messageProfileName1) {
    messageProfileName1.message_content.find(content => content.left_fukushashiki_search_value === "order_billing_address_attributes_name1").text_input.text.valueLeft = profileName1;
  }

  const messageProfileName2= userMessages?.find(message => message.message_content.find(content => content.right_fukushashiki_search_value === "order_billing_address_attributes_name2"));
  if (messageProfileName2) {
    messageProfileName2.message_content.find(content => content.right_fukushashiki_search_value === "order_billing_address_attributes_name2").text_input.text.valueRight = profileName2;
  }

  const messageProfileZipCode1 = userMessages?.find(message => message.message_content.find(content => content.post_code_left_fukushashiki_search_value === "order_billing_address_attributes_zip01"));
  if (messageProfileZipCode1) {
    messageProfileZipCode1.message_content.find(content => content.post_code_left_fukushashiki_search_value === "order_billing_address_attributes_zip01").zip_code_address.value_post_code_left = profileZipCode1;
  }

  const messageProfileZipCode2 = userMessages?.find(message => message.message_content.find(content => content.post_code_right_fukushashiki_search_value === "order_billing_address_attributes_zip02"));
  if (messageProfileZipCode2) {
    messageProfileZipCode2.message_content.find(content => content.post_code_right_fukushashiki_search_value === "order_billing_address_attributes_zip02").zip_code_address.value_post_code_right = profileZipCode2;
  }

  // const messageProfilePrefecture = userMessages?.find(message => message.message_content.find(content => content.prefecture_fukushashiki_search_value === "order_billing_address_attributes_prefecture_name"));
  // if (messageProfilePrefecture) {
  //   messageProfilePrefecture.message_content.find(content => content.prefecture_fukushashiki_search_value === "order_billing_address_attributes_prefecture_name").zip_code_address.prefecture_label.name = findItem(prefectureList, {
  //     keys: ["name"],
  //     value: prefectureList[profilePrefecture],
  //     onSuccess: (item)=> item.id,
  //     callbackValue: prefectureList[profilePrefecture],
  //   });
  // }

  // const messageProfilePrefecture = userMessages?.find(message => message.message_content.find(content => content.prefecture_fukushashiki_search_value === "order_billing_address_attributes_prefecture_name"));
  // if (messageProfilePrefecture) {
  //   messageProfilePrefecture.message_content.find(content => content.prefecture_fukushashiki_search_value === "order_billing_address_attributes_prefecture_name").zip_code_address.value_post_code = profilePrefecture;
  // }

  const messageProfileCity = userMessages?.find(message => message.message_content.find(content => content.municipality_fukushashiki_search_value === "order_billing_address_attributes_addr01"));
  if (messageProfileCity) {
    messageProfileCity.message_content.find(content => content.municipality_fukushashiki_search_value === "order_billing_address_attributes_addr01").zip_code_address.value_municipality = profileCity;
  }

  const messageProfileStreetAddress = userMessages?.find(message => message.message_content.find(content => content.address_fukushashiki_search_value === "order_billing_address_attributes_addr02"));
  if (messageProfileStreetAddress) {
    messageProfileStreetAddress.message_content.find(content => content.address_fukushashiki_search_value === "order_billing_address_attributes_addr02").zip_code_address.value_address = profileStreetAddress;
  }

  const messageProfileTel1 = userMessages?.find(message => message.message_content.find(content => content.value1_fukushashiki_search_value === "form-validation-field-0"));
  if (messageProfileTel1) {
    messageProfileTel1.message_content.find(content => content.value1_fukushashiki_search_value === "form-validation-field-0").text_input.phone_number.value1 = profileTel1;
  }

  const messageProfileTel2 = userMessages?.find(message => message.message_content.find(content => content.value2_fukushashiki_search_value === "form-validation-field-1"));
  if (messageProfileTel2) {
    messageProfileTel2.message_content.find(content => content.value2_fukushashiki_search_value === "form-validation-field-1").text_input.phone_number.value2 = profileTel2;
  }

  const messageProfileTel3 = userMessages?.find(message => message.message_content.find(content => content.value3_fukushashiki_search_value === "form-validation-field-2"));
  if (messageProfileTel3) {
    messageProfileTel3.message_content.find(content => content.value3_fukushashiki_search_value === "form-validation-field-2").text_input.phone_number.value3 = profileTel3;
  }

  return newMessagesList;
}

// Hard code check torizen domains
// TODO: Cần refactor đoạn này sao cho có thể sử dụng được setting RENDER_MODES trên trang quản lý
export const isTorizenLP = (url) => {
  const torizenDomains = [
    // Comment out if you want to test torizen in localhost
    // "localhost:8000",
    // "commerceforce.co.jp",
    "hana.inuneko-sukoyaka.jp",
    "sb.inuneko-sukoyaka.jp"
  ];

  return torizenDomains.some(domain => url.includes(domain));
}

export const isBlissLpAmazonData = (message) => {
  const isTel1Data = message.message_content.find(content => content.value1_fukushashiki_search_value === "form-validation-field-0");
  const isTel2Data = message.message_content.find(content => content.value2_fukushashiki_search_value === "form-validation-field-1");
  const isTel3Data = message.message_content.find(content => content.value3_fukushashiki_search_value === "form-validation-field-2");
  const isZipCode1Data = message.message_content.find(content => content.post_code_left_fukushashiki_search_value === "order_billing_address_attributes_zip01");
  const isZipCode2Data = message.message_content.find(content => content.post_code_right_fukushashiki_search_value === "order_billing_address_attributes_zip02");
  const isPrefectureData = message.message_content.find(content => content.prefecture_fukushashiki_search_value === "order_billing_address_attributes_prefecture_name");
  const isCityData = message.message_content.find(content => content.municipality_fukushashiki_search_value === "order_billing_address_attributes_addr01");
  const isStreetAddressData = message.message_content.find(content => content.address_fukushashiki_search_value === "order_billing_address_attributes_addr02");
  const isName1Data = message.message_content.find(content => content.left_fukushashiki_search_value === "order_billing_address_attributes_name1");
  const isName2Data = message.message_content.find(content => content.right_fukushashiki_search_value === "order_billing_address_attributes_name2");
  return isTel1Data || isTel2Data || isTel3Data || isZipCode1Data || isZipCode2Data || isPrefectureData || isCityData || isStreetAddressData || isName1Data || isName2Data;
}