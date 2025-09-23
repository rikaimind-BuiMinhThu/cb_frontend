import { findItem } from "./Utils";

export const mapAmazonPayDataToMessagesList = (amazonPayData, messagesList, prefectureList) => {
  // No support for other customer and other cart system
  if (!amazonPayData || amazonPayData.cartSystem !== "SUBSCSTORE") return messagesList;

  const newMessagesList = _.cloneDeep(messagesList);

  const {
    profileFamilyName, profileFirstName, profileFamilyNameKana, profileFirstNameKana,
    profileZipCode, profileStateId, profileCity, profileStreetAddress,
    profileTel, profileEmail
  } = amazonPayData;
  const userMessages = newMessagesList.filter(message => message.belong_to === "user");
  if (!userMessages) return newMessagesList;

  // set profileFamilyName vào message có left_fukushashiki_search_value là "jsUkProfileFamilyName". Set vào　message_content.text_input.valueLeft
  // set profileFirstName vào message có right_fukushashiki_search_value là "jsUkProfileFirstName". Set vào　message_content.text_input.valueRight
  // set profileFamilyNameKana vào message có left_fukushashiki_search_value là "jsUkProfileFamilyNameKana". Set vào　message_content.text_input.valueLeft
  // set profileFirstNameKana vào message có right_fukushashiki_search_value là "jsUkProfileFirstNameKana". Set vào　message_content.text_input.valueRight
  // set profileZipCode vào message có post_code_fukushashiki_search_value là "jsUkProfileZipCode". Set vào　message_content.zip_code_address.value_post_code
  // set profileStateId vào message có prefecture_fukushashiki_search_value là "jsUkProfileZipCode". Set vào　message_content.zip_code_address.value_prefecture
  // set profileCity vào message có municipality_fukushashiki_search_value là "jsUkProfileZipCode". Set vào　message_content.zip_code_address.value_municipality
  // set profileStreetAddress vào message có address_fukushashiki_search_value là "jsUkProfileZipCode". Set vào　message_content.zip_code_address.value_address
  // set profileTel vào message có fukushashiki_search_value là "jsUkProfileTel". Set vào　message_content.text_input.phone_number.value
  // set profileEmail vào message có fukushashiki_search_value là "jsUkEmail". Set vào　message_content.text_input.email_address.value

  const messageProfileFamilyName = userMessages?.find(message => message.message_content.find(content => content.left_fukushashiki_search_value === "jsUkProfileFamilyName"));
  if (messageProfileFamilyName) {
    messageProfileFamilyName.message_content.find(content => content.left_fukushashiki_search_value === "jsUkProfileFamilyName").text_input.text.valueLeft = profileFamilyName;
  }

  const messageProfileFirstName = userMessages?.find(message => message.message_content.find(content => content.right_fukushashiki_search_value === "jsUkProfileFirstName"));
  if (messageProfileFirstName) {
    messageProfileFirstName.message_content.find(content => content.right_fukushashiki_search_value === "jsUkProfileFirstName").text_input.text.valueRight = profileFirstName;
  }

  const messageProfileFamilyNameKana = userMessages?.find(message => message.message_content.find(content => content.left_fukushashiki_search_value === "jsUkProfileFamilyNameKana"));
  if (messageProfileFamilyNameKana) {
    messageProfileFamilyNameKana.message_content.find(content => content.left_fukushashiki_search_value === "jsUkProfileFamilyNameKana").text_input.text.valueLeft = profileFamilyNameKana;
  }

  const messageProfileFirstNameKana = userMessages?.find(message => message.message_content.find(content => content.right_fukushashiki_search_value === "jsUkProfileFirstNameKana"));
  if (messageProfileFirstNameKana) {
    messageProfileFirstNameKana.message_content.find(content => content.right_fukushashiki_search_value === "jsUkProfileFirstNameKana").text_input.text.valueRight = profileFirstNameKana;
  }

  const messageProfileZipCode = userMessages?.find(message => message.message_content.find(content => content.post_code_fukushashiki_search_value === "jsUkProfileZipCode"));
  if (messageProfileZipCode) {
    messageProfileZipCode.message_content.find(content => content.post_code_fukushashiki_search_value === "jsUkProfileZipCode").zip_code_address.value_post_code = profileZipCode;
  }

  const messageProfileStateId = userMessages?.find(message => message.message_content.find(content => content.prefecture_fukushashiki_search_value === "jsUkProfileStateId"));
  if (messageProfileStateId) {
    messageProfileStateId.message_content.find(content => content.prefecture_fukushashiki_search_value === "jsUkProfileStateId").zip_code_address.value_prefecture = findItem(prefectureList, {
      keys: ["name"],
      value: profileStateId,
      onSuccess: (item)=> item.id,
      callbackValue: profileStateId,
    });
  }

  const messageProfileCity = userMessages?.find(message => message.message_content.find(content => content.municipality_fukushashiki_search_value === "jsUkProfileCity"));
  if (messageProfileCity) {
    messageProfileCity.message_content.find(content => content.municipality_fukushashiki_search_value === "jsUkProfileCity").zip_code_address.value_municipality = profileCity;
  }

  const messageProfileStreetAddress = userMessages?.find(message => message.message_content.find(content => content.address_fukushashiki_search_value === "jsUkProfileStreetAddress"));
  if (messageProfileStreetAddress) {
    messageProfileStreetAddress.message_content.find(content => content.address_fukushashiki_search_value === "jsUkProfileStreetAddress").zip_code_address.value_address = profileStreetAddress;
  }

  const messageProfileTel = userMessages?.find(message => message.message_content.find(content => content.fukushashiki_search_value === "jsUkProfileTel"));
  if (messageProfileTel) {
    messageProfileTel.message_content.find(content => content.fukushashiki_search_value === "jsUkProfileTel").text_input.phone_number.value = profileTel;
  }

  const messageProfileEmail = userMessages?.find(message => message.message_content.find(content => content.fukushashiki_search_value === "jsUkEmail"));
  if (messageProfileEmail) {
    messageProfileEmail.message_content.find(content => content.fukushashiki_search_value === "jsUkEmail").text_input.email_address.value = profileEmail;
  }

  return newMessagesList;
}

// Hard code check torizen domains
// TODO: Cần refactor đoạn này sao cho có thể sử dụng được setting RENDER_MODES trên trang quản lý
export const isTorizenLP = (url) => {
  const torizenDomains = [
    // "localhost:8080",
    "commerceforce.co.jp",
    "hana.inuneko-sukoyaka.jp",
    "sb.inuneko-sukoyaka.jp"
  ];

  return torizenDomains.some(domain => url.includes(domain));
}

export const isTorizenLpAmazonData = (message) => {
  const isEmailData = message.message_content.find(content => content.fukushashiki_search_value === "jsUkEmail");
  const isTelData = message.message_content.find(content => content.fukushashiki_search_value === "jsUkProfileTel");
  const isZipCodeData = message.message_content.find(content => content.post_code_fukushashiki_search_value === "jsUkProfileZipCode");
  const isStateIdData = message.message_content.find(content => content.prefecture_fukushashiki_search_value === "jsUkProfileStateId");
  const isCityData = message.message_content.find(content => content.municipality_fukushashiki_search_value === "jsUkProfileCity");
  const isStreetAddressData = message.message_content.find(content => content.address_fukushashiki_search_value === "jsUkProfileStreetAddress");
  const isFamilyNameData = message.message_content.find(content => content.left_fukushashiki_search_value === "jsUkProfileFamilyName");
  const isFirstNameData = message.message_content.find(content => content.right_fukushashiki_search_value === "jsUkProfileFirstName");
  const isFamilyNameKanaData = message.message_content.find(content => content.left_fukushashiki_search_value === "jsUkProfileFamilyNameKana");
  const isFirstNameKanaData = message.message_content.find(content => content.right_fukushashiki_search_value === "jsUkProfileFirstNameKana");
  return isEmailData || isTelData || isZipCodeData || isStateIdData || isCityData || isStreetAddressData || isFamilyNameData || isFirstNameData || isFamilyNameKanaData || isFirstNameKanaData;
}