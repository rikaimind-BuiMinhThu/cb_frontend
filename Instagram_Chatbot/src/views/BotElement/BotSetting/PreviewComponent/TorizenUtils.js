export const mapAmazonPayDataToMessagesList = (amazonPayData, messagesList) => {
  // No support for other customer and other cart system
  if (!amazonPayData || amazonPayData.cartSystem !== "SUBSCSTORE") return messagesList;

  const newMessagesList = _.cloneDeep(messagesList);

  const { profileFamilyName, profileFirstName, profileZipCode, profileStateId, profileCity, profileStreetAddress, profileTel, profileEmail } = amazonPayData;
  const userMessages = newMessagesList.filter(message => message.belong_to === "user");
  if (!userMessages) return newMessagesList;

  // set profileFamilyName vào message có left_fukushashiki_search_value là "jsUkProfileFamilyName". Set vào　message_content.text_input.valueLeft
  // set profileFirstName vào message có right_fukushashiki_search_value là "jsUkProfileFirstName". Set vào　message_content.text_input.valueRight
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

  const messageProfileZipCode = userMessages?.find(message => message.message_content.find(content => content.post_code_fukushashiki_search_value === "jsUkProfileZipCode"));
  if (messageProfileZipCode) {
    messageProfileZipCode.message_content.find(content => content.post_code_fukushashiki_search_value === "jsUkProfileZipCode").zip_code_address.value_post_code = profileZipCode;
  }

  const messageProfileStateId = userMessages?.find(message => message.message_content.find(content => content.prefecture_fukushashiki_search_value === "jsUkProfileStateId"));
  if (messageProfileStateId) {
    messageProfileStateId.message_content.find(content => content.prefecture_fukushashiki_search_value === "jsUkProfileStateId").zip_code_address.value_prefecture = profileStateId;
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