import { findItem } from "./Utils";

const YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS = {
  NAME1: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerName1',
  NAME2: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerName2',
  NAME1_KANA: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerNameKana1',
  NAME2_KANA: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerNameKana2',
  BIRTHDAY_YEAR: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_ddlOwnerBirthYear',
  BIRTHDAY_MONTH: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_ddlOwnerBirthMonth',
  BIRTHDAY_DAY: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_ddlOwnerBirthDay',
  SEX: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_rblOwnerSex',
  EMAIL: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerMailAddr',
  ZIP_CODE: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerZip',
  ADDRESS1: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_ddlOwnerAddr1',
  ADDRESS2: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerAddr2',
  ADDRESS3: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerAddr3',
  ADDRESS4: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerAddr4',
  TEL: 'ctl00_ContentPlaceHolder1_ucInputForm_rCartList_ctl00_tbOwnerTel1',
}

const findContentsByFukushashikiSearchValue = (userMessages, fukushaKey, fukushaValue) => {
  if (!Array.isArray(userMessages)) userMessages = [userMessages];

  let result = [];
  userMessages.forEach(message => {
    message.message_content.forEach(content => {
      if (content[fukushaKey] === fukushaValue) {
        result.push(content);
      }
    });
  });
  return result;
}

export const mapAmazonPayDataToMessagesListForYuwaeru = (amazonPayData, messagesList, prefectureList) => {
  // No support for other customer and other cart system
  if (!amazonPayData || amazonPayData.cartSystem !== "W2_REPEAT") return messagesList;

  const newMessagesList = _.cloneDeep(messagesList);

  const {
    ownerName1, ownerName2, ownerNameKana1, ownerNameKana2,
    ownerBirthYear, ownerBirthMonth, ownerBirthDay, ownerSex,
    ownerMailAddr, ownerZip, ownerAddr1Text, ownerAddr2, ownerAddr3, ownerAddr4, ownerTel1,
  } = amazonPayData;

  const mappedName1 = ownerName1 || "";
  const mappedName2 = ownerName2 || "";
  const mappedNameKana1 = ownerNameKana1 || "";
  const mappedNameKana2 = ownerNameKana2 || "";
  const mappedBirthdayYear = ownerBirthYear || "";
  const mappedBirthdayMonth = ownerBirthMonth || "";
  const mappedBirthdayDay = ownerBirthDay || "";
  const mappedSex = ownerSex || "";
  const mappedEmail = ownerMailAddr || "";
  const mappedZip = ownerZip || "";
  const mappedPrefecture = ownerAddr1Text || "";
  const mappedMunicipality = ownerAddr2 || "";
  const mappedAddress = ownerAddr3 || "";
  const mappedBuildingName = ownerAddr4 || "";
  const mappedTel = ownerTel1 || "";

  console.log("ownerTel1", ownerTel1);

  const userMessages = newMessagesList.filter(message => message.belong_to === "user");
  if (!userMessages) return newMessagesList;

  const name1Contents = findContentsByFukushashikiSearchValue(userMessages, 'left_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME1);
  if (name1Contents.length > 0) {
    name1Contents.forEach(content => content.text_input.text.valueLeft = mappedName1);
  }

  const name2Contents = findContentsByFukushashikiSearchValue(userMessages, 'right_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME2);
  if (name2Contents.length > 0) {
    name2Contents.forEach(content => content.text_input.text.valueRight = mappedName2);
  }

  const name1KanaContents = findContentsByFukushashikiSearchValue(userMessages, 'left_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME1_KANA);
  if (name1KanaContents.length > 0) {
    name1KanaContents.forEach(content => content.text_input.text.valueLeft = mappedNameKana1);
  }

  const name2KanaContents = findContentsByFukushashikiSearchValue(userMessages, 'right_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME2_KANA);
  if (name2KanaContents.length > 0) {
    name2KanaContents.forEach(content => content.text_input.text.valueRight = mappedNameKana2);
  }

  const birthYearContents = findContentsByFukushashikiSearchValue(userMessages, 'valueYear_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.BIRTHDAY_YEAR);
  if (birthYearContents.length > 0) {
    birthYearContents.forEach(content => content.pull_down.dob_ymd.year = mappedBirthdayYear);
  }

  const birthMonthContents = findContentsByFukushashikiSearchValue(userMessages, 'valueMonth_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.BIRTHDAY_MONTH);
  if (birthMonthContents.length > 0) {
    birthMonthContents.forEach(content => content.pull_down.dob_ymd.month = mappedBirthdayMonth);
  }

  const birthDayContents = findContentsByFukushashikiSearchValue(userMessages, 'valueDay_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.BIRTHDAY_DAY);
  if (birthDayContents.length > 0) {
    birthDayContents.forEach(content => content.pull_down.dob_ymd.day = mappedBirthdayDay);
  }

  const sexContents = findContentsByFukushashikiSearchValue(userMessages, 'fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.SEX);
  if (sexContents.length > 0) {
    sexContents.forEach(content => content.text_input.text.value = mappedSex);
  }
  
  const zipCodeContents = findContentsByFukushashikiSearchValue(userMessages, 'post_code_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE);
  if (zipCodeContents.length > 0) {
    zipCodeContents.forEach(content => content.zip_code_address.value_post_code = mappedZip);
  }

  const prefectureContents = findContentsByFukushashikiSearchValue(userMessages, 'prefecture_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.ADDRESS1);
  if (prefectureContents.length > 0) {
    const prefectureItem = findItem(prefectureList, {
      keys: ["name"],
      value: mappedPrefecture,
      onSuccess: (item)=> item.id,
      callbackValue: mappedPrefecture,
    });
    prefectureContents.forEach(content => content.zip_code_address.value_prefecture = prefectureItem);
  }

  const cityContents = findContentsByFukushashikiSearchValue(userMessages, 'municipality_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.ADDRESS2);
  if (cityContents.length > 0) {
    cityContents.forEach(content => content.zip_code_address.value_municipality = mappedMunicipality);
  }

  const streetAddressContents = findContentsByFukushashikiSearchValue(userMessages, 'address_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.ADDRESS3);
  if (streetAddressContents.length > 0) {
    streetAddressContents.forEach(content => content.zip_code_address.value_address = mappedAddress);
  }

  const buildingContents = findContentsByFukushashikiSearchValue(userMessages, 'building_name_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.ADDRESS4);
  if (buildingContents.length > 0) {
    buildingContents.forEach(content => content.zip_code_address.value_building_name = mappedBuildingName);
  }

  const telContents = findContentsByFukushashikiSearchValue(userMessages, 'fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL);
  if (telContents.length > 0) {
    telContents.forEach(content => {
      if (content?.text_input?.phone_number) {
        content.text_input.phone_number.value = mappedTel;
      } else if (content?.text_input?.text) {
        content.text_input.text.value = mappedTel;
      }
    });
  }

  const emailContents = findContentsByFukushashikiSearchValue(userMessages, 'value_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.EMAIL);
  if (emailContents.length > 0) {
    emailContents.forEach(content => {
      content.text_input.email_confirmation.value = mappedEmail;
      content.text_input.email_confirmation.valueConfirm = mappedEmail;
    });
  }

  return newMessagesList;
}

export const isYuwaeruLpAmazonData = (message) => {
  return findContentsByFukushashikiSearchValue(message, 'left_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME1).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'right_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME2).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'left_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME1_KANA).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'right_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.NAME2_KANA).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'valueYear_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.BIRTHDAY_YEAR).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'valueMonth_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.BIRTHDAY_MONTH).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'valueDay_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.BIRTHDAY_DAY).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.SEX).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'post_code_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.ZIP_CODE).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'prefecture_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.ADDRESS1).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'municipality_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.ADDRESS2).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'address_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.ADDRESS3).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'building_name_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.ADDRESS4).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.TEL).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'value_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.EMAIL).length > 0 ||
    findContentsByFukushashikiSearchValue(message, 'valueConfirm_fukushashiki_search_value', YUWAERU_AMAZON_FUKUSHASHIKI_ELEMENTS.EMAIL).length > 0;
}

export const isYuwaeruLP = (url) => {
  const domains = [
    // Comment out if you want to test yuwaeru in localhost
    "localhost:8000",
    // "commerceforce.co.jp",
    "store.nekase-genmai.com/",
  ];

  return domains.some(domain => url.includes(domain));
}