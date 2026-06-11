#!/usr/bin/env node
/**
 * Extract inline content.type blocks from ScenarioUserSettingsPanel into contentSettings/*.
 */
const fs = require('fs');
const path = require('path');

const PANEL_PATH = path.join(
  __dirname,
  '../src/views/BotElement/BotSetting/ScenarioSetting/components/ScenarioUserSettingsPanel.jsx'
);
const OUT_DIR = path.join(
  __dirname,
  '../src/views/BotElement/BotSetting/ScenarioSetting/contentSettings'
);

const TYPES = [
  { type: 'calendar', component: 'CalendarSetting', vars: 'const calendar = content.calendar;' },
  { type: 'card_payment_radio_button', component: 'CardPaymentRadioButtonSetting', vars: 'const cardPaymentRadioButton = content.card_payment_radio_button;' },
  { type: 'shipping_address', component: 'ShippingAddressSetting', vars: 'const shippingAddress = content.shipping_address;' },
  { type: 'credit_card_payment', component: 'CreditCardPaymentSetting', vars: 'const creditCardPayment = content.credit_card_payment;' },
  { type: 'product_purchase', component: 'ProductPurchaseSetting', vars: 'const productPurchase = content.product_purchase;' },
  { type: 'product_purchase_radio_button', component: 'ProductPurchaseRadioButtonSetting', vars: 'const productPurchaseRadioButton = content.product_purchase_radio_button;' },
  { type: 'product_purchase_select_option', component: 'ProductPurchaseSelectOptionSetting', vars: 'const productPurchaseSelectOption = content.product_purchase_select_option;' },
  { type: 'slider', component: 'SliderSetting', vars: 'const slider = content.slider;' },
];

const HEADER = `import React from 'react';
import { Button } from 'reactstrap';
import icon from '../../../../../assets/img/bot-icon/man1_new.png';
import { MDBIcon } from 'mdbreact';
import SelectCustom from '../scenarioComon/SelectCustom';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import InputNum from '../scenarioComon/InputNum';
import InputDouble from '../scenarioComon/InputDouble';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../scenarioComon/InputCustom';
import moment from 'moment';
import { Carousel, Checkbox, Radio, Slider, Calendar, Select } from 'antd';
import CheckboxGroupCustom from '../scenarioComon/CheckboxGroupCustom';
import shopifIcon from '../../../../../assets/img/shopify-icon.png';
import locale from 'antd/es/date-picker/locale/ja_JP';
import ShopifyReferenceSelect from '../ShopifyReferenceSelect';
import { Tooltip } from '@mui/material';
import { MESSAGE_CONTENT_TYPES, LABELS, GENDER_DISPLAY_TYPES, CART_SYSTEM } from '../../PreviewComponent/Constants';
import HtmlCodeConfig from '../scenarioComon/HtmlCodeConfig';
import OptionGenderConfig from '../OptionGenderConfig';
import PaymentDisplayStyleSection from '../components/PaymentDisplayStyleSection';
import { PAYMENT_OPTION_IMAGE_FIELDS } from '../constants/paymentStyleConstants';
import DatePickerCustom from '../scenarioComon/DatePickerCustom';
import {
  dataPaymentMethod, dataHourFixed, dataMinutesFixed, dataEveryMinuteFixed,
  dataYearFixed, dataMonthFixed, dataDayFixed, dataMaxRangSlider,
  dataConsumeApiResponse, agreeTermType, dataTypeFile, dataSubCondition,
  installmentOptions, carouselType, typeCalendar, dropDownTitle,
  convertTextType, typeTextarea, typeRadio, rangeText, hyphenPhoneNumber,
  typeCheckbox, dataTypePullDown, dataSelectDateTime, dataConditionFixed,
} from '../constants/scenarioFormConstants';
import {
  DELIVERY_CUT_OFF_SELECT_NONE,
  getCalendarPreviewRelativeRangeLabel,
  isCalendarPreviewRelativeRangeEnabled,
  isCalendarPreviewDaysSplitEnabled,
  deliveryCutOffTimeSelectValue,
  handleDisableDateCalendar,
  handleDisableEndDateCalendar,
  mergePreviewRelativeCalendar,
} from '../utils/scenarioCalendarUtils';
import { settingsCarousel } from '../components/scenarioCarouselSettings';
import { useScenarioContentSettingProps } from '../hooks/useScenarioContentSettingProps';

const { Option } = Select;
`;

function findBlock(lines, type) {
  const pat = `content.type === '${type}'`;
  const start = lines.findIndex((l) => l.includes(pat));
  if (start < 0) return null;
  let depth = 0;
  let started = false;
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    for (const ch of line) {
      if (ch === '(') { depth++; started = true; }
      if (ch === ')') depth--;
    }
    if (started && depth <= 0 && /^\s*\)\}/.test(line)) {
      return { start, end: i, innerStart: start + 1, innerEnd: i - 1 };
    }
  }
  return null;
}

function stripWrapper(innerLines) {
  let lines = [...innerLines];
  while (lines.length && lines[0].trim() === '') lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  const first = lines[0]?.trim() || '';
  const last = lines[lines.length - 1]?.trim() || '';
  if (first.startsWith('<React.Fragment>') && last === '</React.Fragment>') {
    lines = lines.slice(1, -1);
  }
  return lines;
}

const panelSrc = fs.readFileSync(PANEL_PATH, 'utf8');
let panelLines = panelSrc.split('\n');
const registryEntries = [];

for (const { type, component, vars } of TYPES) {
  const block = findBlock(panelLines, type);
  if (!block) {
    console.warn(`Skip ${type}: block not found`);
    continue;
  }
  let inner = stripWrapper(panelLines.slice(block.innerStart, block.innerEnd + 1));
  const body = inner.join('\n');

  const fileContent = `${HEADER}
const ${component} = ({ indexMessageSelect, indexContent, content }) => {
  const {
    dataMessages, setDataMessages, onChangeValueMessageContent, renderRootFaqOption,
    dataInputVar, setIsOpenAddVariable, isUseFukushashiki, handleDragEndRadioCheckbox,
    handleRemoveItemContent, handleAddItemRadioCheckbox, setIsOpenFileReference,
    setVarFileReference, setAcceptFile, handleDragEndPullDown, handleRemoveItemCustomizePullDown,
    handleAddItemCustomizePullDown, onChangeTimePullDown, dataHour, dataMinutes, dataEveryMinute,
    dataYear, dataMonth, dataDay, dataPrefectures, dataCity, renderLPIntegrationOptionSetting,
    renderDetailSettingPulldownFromJs, handleRemoveItemZipCodeAddress, renderAddressField,
    renderBuildingName, renderMunicipality, renderPostCode, renderZipCodeAddressTitle,
    renderPrefecture, renderPaymentMethodDescriptionInput, handleAddItemAgreeTerm,
    handleDragEndProduct, handleRemoveItemProductPullDown, handleAddItemProductPullDown,
    botUploadFile, carouselUploadFile, getBaseUrl, handleDownloadFile, isColor,
    listProductVariants, clientCartSystem, isShopifyPaymentScenario,
  } = useScenarioContentSettingProps(indexMessageSelect, indexContent, content);

  ${vars}

  return (
${body}
  );
};

export default ${component};
`;

  fs.writeFileSync(path.join(OUT_DIR, `${component}.jsx`), fileContent);
  registryEntries.push({ type, component });
  console.log(`Extracted ${component} (${block.end - block.start + 1} lines)`);

  // Remove block from panel (including comment line above if present)
  let removeStart = block.start;
  if (removeStart > 0 && panelLines[removeStart - 1].includes(`type = '${type}'`)) {
    removeStart -= 1;
  }
  panelLines = [...panelLines.slice(0, removeStart), ...panelLines.slice(block.end + 1)];
}

// Remove zip_code_address inline block too
const zipBlock = findBlock(panelLines, 'zip_code_address');
if (zipBlock) {
  let removeStart = zipBlock.start;
  if (removeStart > 0 && panelLines[removeStart - 1].includes("type = 'zip_code_address'")) {
    removeStart -= 1;
  }
  panelLines = [...panelLines.slice(0, removeStart), ...panelLines.slice(zipBlock.end + 1)];
  console.log('Removed inline zip_code_address block');
}

fs.writeFileSync(PANEL_PATH, panelLines.join('\n'));

// Update index.js
const indexPath = path.join(OUT_DIR, 'index.js');
let indexSrc = fs.readFileSync(indexPath, 'utf8');
for (const { type, component } of registryEntries) {
  if (!indexSrc.includes(`import ${component}`)) {
    indexSrc = indexSrc.replace(
      "import ZipCodeAddressContentSetting",
      `import ${component} from './${component}';\nimport ZipCodeAddressContentSetting`
    );
  }
  if (!indexSrc.includes(`${type}:`)) {
    indexSrc = indexSrc.replace(
      '  zip_code_address: ZipCodeAddressContentSetting,',
      `  ${type}: ${component},\n  zip_code_address: ZipCodeAddressContentSetting,`
    );
  }
}
fs.writeFileSync(indexPath, indexSrc);

// Simplify createElement props in panel
const simplifiedCreate = `                                                  {CONTENT_SETTING_MAP[content.type] ? React.createElement(CONTENT_SETTING_MAP[content.type], {
                                                    indexMessageSelect,
                                                    indexContent,
                                                    content,
                                                  }) : null}`;
panelSrc2 = fs.readFileSync(PANEL_PATH, 'utf8');
panelSrc2 = panelSrc2.replace(
  /\{CONTENT_SETTING_MAP\[content\.type\] \? React\.createElement\(CONTENT_SETTING_MAP\[content\.type\], \{[\s\S]*?\}\) : null\}/,
  simplifiedCreate
);
fs.writeFileSync(PANEL_PATH, panelSrc2);

console.log('Done. Registry entries:', registryEntries.map((e) => e.type).join(', '));
