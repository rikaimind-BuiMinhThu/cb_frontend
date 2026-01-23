import { findItem } from "./Utils";

export const mapAmazonPayDataToMessagesListForPhystech = (amazonPayData, messagesList, prefectureList) => {
  // No support for other customer and other cart system
  if (!amazonPayData || amazonPayData.cartSystem !== "ECFORCE") return messagesList;

  const newMessagesList = _.cloneDeep(messagesList);

  const {
<<<<<<< HEAD
<<<<<<< HEAD
    profileName, profileNameKana, profileZipCode,
    profilePrefecture, profileCity, 
    profileStreetAddress, profileTel, profileEmail
=======
    profileName1, profileName2, profileZipCode1, profileZipCode2,
=======
    profileName, profileZipCode,
<<<<<<< HEAD
>>>>>>> f2dafc08 ([DEELWEBCHATBOT2026-62] Fix amazon for Phystech)
    profilePrefecture, profileCity, profileStreetAddress, profileTel1,
    profileTel2, profileTel3, profileEmail
>>>>>>> 547b4cd9 ([DEELWEBCHATBOT2026-62] Fix amazon for Phystech)
=======
    profilePrefecture, profileCity, 
    profileStreetAddress, profileTel, profileEmail
>>>>>>> 25f527c3 ([DEELWEBCHATBOT2026-62] Fix AmazonPay for Phystech)
  } = amazonPayData;
  const userMessages = newMessagesList.filter(message => message.belong_to === "user");
  if (!userMessages) return newMessagesList;

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const messageProfileName = userMessages?.find(message => message.message_content.find(content => content.fukushashiki_search_value === "order_shipping_address_attributes_name1"));
  if (messageProfileName) {
    messageProfileName.message_content.find(content => content.fukushashiki_search_value === "order_shipping_address_attributes_name1").text_input.text.value = profileName;
<<<<<<< HEAD
  }

  const messageProfileNameKana = userMessages?.find(message => message.message_content.find(content => content.fukushashiki_search_value === "order_shipping_address_attributes_kana1"));
  if (messageProfileNameKana) {
    messageProfileNameKana.message_content.find(content => content.fukushashiki_search_value === "order_shipping_address_attributes_kana1").text_input.text.value = profileNameKana;
  }

  const messageProfileZipCode = userMessages?.find(message => message.message_content.find(content => content.post_code_fukushashiki_search_value === "order_shipping_address_attributes_zip01"));
  if (messageProfileZipCode) {
    messageProfileZipCode.message_content.find(content => content.post_code_fukushashiki_search_value === "order_shipping_address_attributes_zip01").zip_code_address.value_post_code = profileZipCode;
=======
  const messageProfileName1= userMessages?.find(message => message.message_content.find(content => content.left_fukushashiki_search_value === "order_shipping_address_attributes_name1"));
  if (messageProfileName1) {
    messageProfileName1.message_content.find(content => content.left_fukushashiki_search_value === "order_shipping_address_attributes_name1").text_input.text.valueLeft = profileName1;
  }

  const messageProfileName2= userMessages?.find(message => message.message_content.find(content => content.right_fukushashiki_search_value === "order_shipping_address_attributes_name2"));
  if (messageProfileName2) {
    messageProfileName2.message_content.find(content => content.right_fukushashiki_search_value === "order_shipping_address_attributes_name2").text_input.text.valueRight = profileName2;
  }

  const messageProfileZipCode1 = userMessages?.find(message => message.message_content.find(content => content.post_code_left_fukushashiki_search_value === "order_shipping_address_attributes_zip01"));
  if (messageProfileZipCode1) {
    messageProfileZipCode1.message_content.find(content => content.post_code_left_fukushashiki_search_value === "order_shipping_address_attributes_zip01").zip_code_address.value_post_code_left = profileZipCode1;
  }

  const messageProfileZipCode2 = userMessages?.find(message => message.message_content.find(content => content.post_code_right_fukushashiki_search_value === "order_shipping_address_attributes_zip02"));
  if (messageProfileZipCode2) {
    messageProfileZipCode2.message_content.find(content => content.post_code_right_fukushashiki_search_value === "order_shipping_address_attributes_zip02").zip_code_address.value_post_code_right = profileZipCode2;
>>>>>>> 547b4cd9 ([DEELWEBCHATBOT2026-62] Fix amazon for Phystech)
=======
  const messageProfileName= userMessages?.find(message => message.message_content.find(content => content.left_fukushashiki_search_value === "order_shipping_address_attributes_name1"));
=======
  const messageProfileName = userMessages?.find(message => message.message_content.find(content => content.fukushashiki_search_value === "order_shipping_address_attributes_name1"));
>>>>>>> 3ef232e7 ([DEELWEBCHATBOT2026-62] Fix AmazonPay for Phystech)
  if (messageProfileName) {
    messageProfileName.message_content.find(content => content.fukushashiki_search_value === "order_shipping_address_attributes_name1").text_input.text.valueLeft = profileName;
=======
>>>>>>> 25f527c3 ([DEELWEBCHATBOT2026-62] Fix AmazonPay for Phystech)
  }

  const messageProfileZipCode = userMessages?.find(message => message.message_content.find(content => content.post_code_fukushashiki_search_value === "order_shipping_address_attributes_zip01"));
  if (messageProfileZipCode) {
<<<<<<< HEAD
    messageProfileZipCode.message_content.find(content => content.post_code_left_fukushashiki_search_value === "order_shipping_address_attributes_zip01").zip_code_address.value_post_code_left = profileZipCode;
>>>>>>> f2dafc08 ([DEELWEBCHATBOT2026-62] Fix amazon for Phystech)
=======
    messageProfileZipCode.message_content.find(content => content.post_code_fukushashiki_search_value === "order_shipping_address_attributes_zip01").zip_code_address.value_post_code = profileZipCode;
>>>>>>> 3ef232e7 ([DEELWEBCHATBOT2026-62] Fix AmazonPay for Phystech)
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

<<<<<<< HEAD
<<<<<<< HEAD
  
  const messageProfileTel = userMessages?.find(message => message.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[shipping_address_attributes][tel01]"]'));
  if (messageProfileTel) {
    messageProfileTel.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[shipping_address_attributes][tel01]"]').text_input.phone_number.value = profileTel;
=======
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
>>>>>>> 547b4cd9 ([DEELWEBCHATBOT2026-62] Fix amazon for Phystech)
=======
  
  const messageProfileTel = userMessages?.find(message => message.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[shipping_address_attributes][tel01]"]'));
  if (messageProfileTel) {
<<<<<<< HEAD
    messageProfileTel.message_content.find(content => content.value1_fukushashiki_search_value === 'input[name="order[shipping_address_attributes][tel01]"]').text_input.phone_number.value1 = profileTel1;
>>>>>>> 3ef232e7 ([DEELWEBCHATBOT2026-62] Fix AmazonPay for Phystech)
=======
    messageProfileTel.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[shipping_address_attributes][tel01]"]').text_input.phone_number.value = profileTel;
>>>>>>> 25f527c3 ([DEELWEBCHATBOT2026-62] Fix AmazonPay for Phystech)
  }

  // Set profileEmail vào message có fukushashiki_search_value là "email". Set vào message_content.text_input.email_address.value
  if (profileEmail) {
<<<<<<< HEAD
<<<<<<< HEAD
    const messageProfileEmail = userMessages?.find(message => message.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[email]"]'));
      messageProfileEmail.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[email]"]').text_input.email_address.value = profileEmail;
=======
    const messageProfileEmail = userMessages?.find(message => message.message_content.find(content => content.fukushashiki_search_value === "email"));
      messageProfileEmail.message_content.find(content => content.fukushashiki_search_value === "email").text_input.email_address.value = profileEmail;
>>>>>>> 547b4cd9 ([DEELWEBCHATBOT2026-62] Fix amazon for Phystech)
=======
    const messageProfileEmail = userMessages?.find(message => message.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[email]"]'));
      messageProfileEmail.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[email]"]').text_input.email_address.value = profileEmail;
>>>>>>> 25f527c3 ([DEELWEBCHATBOT2026-62] Fix AmazonPay for Phystech)
  }

  return newMessagesList;
}

export const isPhystechLpAmazonData = (message) => {
<<<<<<< HEAD
<<<<<<< HEAD
  const isTelData = message.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[shipping_address_attributes][tel01]"]');
  const isZipCodeData = message.message_content.find(content => content.post_code_fukushashiki_search_value === "order_shipping_address_attributes_zip01");
  const isPrefectureData = message.message_content.find(content => content.prefecture_fukushashiki_search_value === "order_shipping_address_attributes_prefecture_name");
  const isCityData = message.message_content.find(content => content.municipality_fukushashiki_search_value === "order_shipping_address_attributes_addr01");
  const isStreetAddressData = message.message_content.find(content => content.address_fukushashiki_search_value === "order_shipping_address_attributes_addr02");
  const isNameData = message.message_content.find(content => content.fukushashiki_search_value === "order_shipping_address_attributes_name1");
  const isNameKanaData = message.message_content.find(content => content.fukushashiki_search_value === "order_shipping_address_attributes_kana1");
  const isEmailData = message.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[email]"]');
  return isTelData || isZipCodeData || isPrefectureData || isCityData || isStreetAddressData || isNameData || isNameKanaData || isEmailData;
=======
  const isTel1Data = message.message_content.find(content => content.value1_fukushashiki_search_value === "form-validation-field-0");
  const isTel2Data = message.message_content.find(content => content.value2_fukushashiki_search_value === "form-validation-field-1");
  const isTel3Data = message.message_content.find(content => content.value3_fukushashiki_search_value === "form-validation-field-2");
  const isZipCode1Data = message.message_content.find(content => content.post_code_left_fukushashiki_search_value === "order_shipping_address_attributes_zip01");
  const isZipCode2Data = message.message_content.find(content => content.post_code_right_fukushashiki_search_value === "order_shipping_address_attributes_addr02");
=======
  const isTelData = message.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[shipping_address_attributes][tel01]"]');
<<<<<<< HEAD
  const isZipCode1Data = message.message_content.find(content => content.post_code_fukushashiki_search_value === "order_shipping_address_attributes_zip01");
>>>>>>> 3ef232e7 ([DEELWEBCHATBOT2026-62] Fix AmazonPay for Phystech)
=======
  const isZipCodeData = message.message_content.find(content => content.post_code_fukushashiki_search_value === "order_shipping_address_attributes_zip01");
>>>>>>> 25f527c3 ([DEELWEBCHATBOT2026-62] Fix AmazonPay for Phystech)
  const isPrefectureData = message.message_content.find(content => content.prefecture_fukushashiki_search_value === "order_shipping_address_attributes_prefecture_name");
  const isCityData = message.message_content.find(content => content.municipality_fukushashiki_search_value === "order_shipping_address_attributes_addr01");
  const isStreetAddressData = message.message_content.find(content => content.address_fukushashiki_search_value === "order_shipping_address_attributes_addr02");
  const isNameData = message.message_content.find(content => content.fukushashiki_search_value === "order_shipping_address_attributes_name1");
<<<<<<< HEAD
  const isEmailData = message.message_content.find(content => content.fukushashiki_search_value === "email");
<<<<<<< HEAD
  return isTel1Data || isTel2Data || isTel3Data || isZipCode1Data || isZipCode2Data || isPrefectureData || isCityData || isStreetAddressData || isName1Data || isName2Data || isEmailData;
>>>>>>> 547b4cd9 ([DEELWEBCHATBOT2026-62] Fix amazon for Phystech)
=======
  return isTelData || isZipCode1Data || isPrefectureData || isCityData || isStreetAddressData || isNameData || isEmailData;
>>>>>>> 3ef232e7 ([DEELWEBCHATBOT2026-62] Fix AmazonPay for Phystech)
=======
  const isEmailData = message.message_content.find(content => content.fukushashiki_search_value === 'input[name="order[email]"]');
  return isTelData || isZipCodeData || isPrefectureData || isCityData || isStreetAddressData || isNameData || isEmailData;
>>>>>>> 25f527c3 ([DEELWEBCHATBOT2026-62] Fix AmazonPay for Phystech)
}