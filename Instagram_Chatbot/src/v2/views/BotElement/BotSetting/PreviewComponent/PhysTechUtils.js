import { findItem } from "./Utils";
export const mapAmazonPayDataToMessagesListForPhystech = (amazonPayData, messagesList, prefectureList) => {
  // No support for other customer and other cart system
  if (!amazonPayData || amazonPayData.cartSystem !== "ECFORCE") return messagesList;
  const newMessagesList = _.cloneDeep(messagesList);
  const {
    profileName, profileZipCode,
    profilePrefecture, profileCity, 
    profileStreetAddress, profileTel, profileEmail
  } = amazonPayData;
  const userMessages = newMessagesList.filter(message => message.belong_to === "user");
  if (!userMessages) return newMessagesList;
  const messageProfileName = userMessages?.find(message => message.message_content.find(content => content.fukushashiki_search_value === "order_shipping_address_attributes_name1"));
  if (messageProfileName) {
    messageProfileName.message_content.find(content => content.fukushashiki_search_value === "order_shipping_address_attributes_name1").text_input.text.value = profileName;
  }
  const messageProfileZipCode = userMessages?.find(message => message.message_content.find(content => content.post_code_fukushashiki_search_value === "order_shipping_address_attributes_zip01"));
  if (messageProfileZipCode) {
    messageProfileZipCode.message_content.find(content => content.post_code_fukushashiki_search_value === "order_shipping_address_attributes_zip01").zip_code_address.value_post_code = profileZipCode;
  }
  const messageProfileStateId = userMessages?.find(message => message.message_content.find(content => content.prefecture_fukushashiki_search_value === "order_shipping_address_attributes_prefecture_name"));
  if (messageProfileStateId) {
    messageProfileStateId.message_content.find(content => content.prefecture_fukushashiki_search_value === "order_shipping_address_attributes_prefecture_name").zip_code_address.value_prefecture = findItem(prefectureList, {
      keys: ["name"],
      value: profilePrefecture,
      onSuccess: (item)=> item.id,
      callbackValue: profilePrefecture,
    });
  }
  const messageProfileCity = userMessages?.find(message => message.message_content.find(content => content.municipality_fukushashiki_search_value === "order_shipping_address_attributes_addr01"));
  if (messageProfileCity) {
    messageProfileCity.message_content.find(content => content.municipality_fukushashiki_search_value === "order_shipping_address_attributes_addr01").zip_code_address.value_municipality = profileCity;
  }
  const messageProfileStreetAddress = userMessages?.find(message => message.message_content.find(content => content.address_fukushashiki_search_value === "order_shipping_address_attributes_addr02"));
  if (messageProfileStreetAddress) {
    messageProfileStreetAddress.message_content.find(content => content.address_fukushashiki_search_value === "order_shipping_address_attributes_addr02").zip_code_address.value_address = profileStreetAddress;
  }
  
  const messageProfileTel = userMessages?.find(message => message.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[shipping_address_attributes][tel01]"]'));
  if (messageProfileTel) {
    messageProfileTel.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[shipping_address_attributes][tel01]"]').text_input.phone_number.value = profileTel;
  }
  // Set profileEmail vào message có fukushashiki_search_value là "email". Set vào message_content.text_input.email_address.value
  if (profileEmail) {
    const messageProfileEmail = userMessages?.find(message => message.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[email]"]'));
      messageProfileEmail.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[email]"]').text_input.email_address.value = profileEmail;
  }
  return newMessagesList;
}
export const isPhystechLpAmazonData = (message) => {
  const isTelData = message.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[shipping_address_attributes][tel01]"]');
  const isZipCodeData = message.message_content.find(content => content.post_code_fukushashiki_search_value === "order_shipping_address_attributes_zip01");
  const isPrefectureData = message.message_content.find(content => content.prefecture_fukushashiki_search_value === "order_shipping_address_attributes_prefecture_name");
  const isCityData = message.message_content.find(content => content.municipality_fukushashiki_search_value === "order_shipping_address_attributes_addr01");
  const isStreetAddressData = message.message_content.find(content => content.address_fukushashiki_search_value === "order_shipping_address_attributes_addr02");
  const isNameData = message.message_content.find(content => content.fukushashiki_search_value === "order_shipping_address_attributes_name1");
  const isEmailData = message.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[email]"]');
  return isTelData || isZipCodeData || isPrefectureData || isCityData || isStreetAddressData || isNameData || isEmailData;
}

export const isPhystechLP = (url) => {
  const domains = [
    // Comment out if you want to test phystech in localhost
    // "localhost:8000",
    // "commerceforce.co.jp",
    "livseed.jp",
  ];

  return domains.some(domain => url.includes(domain));
}