#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ORIGINAL = execSync(
  'git show HEAD:Instagram_Chatbot/src/views/BotElement/BotSetting/ScenarioSetting/ScenarioEditorContent.jsx',
  { cwd: path.join(__dirname, '../..'),
    encoding: 'utf8' }
);
const lines = ORIGINAL.split('\n');

const HEADER = fs.readFileSync(
  path.join(__dirname, '../src/views/BotElement/BotSetting/ScenarioSetting/contentSettings/CalendarSetting.jsx'),
  'utf8'
).split('const CalendarSetting')[0];

function stripWrapper(innerLines) {
  let ls = [...innerLines];
  while (ls.length && ls[0].trim() === '') ls.shift();
  while (ls.length && ls[ls.length - 1].trim() === '') ls.pop();
  if (ls[0]?.trim().startsWith('<React.Fragment>') && ls[ls.length - 1]?.trim() === '</React.Fragment>') {
    ls = ls.slice(1, -1);
  }
  if (ls[0]?.trim() === '<>') {
    const last = ls.length - 1;
    if (ls[last]?.trim() === '</>') ls = ls.slice(1, -1);
  }
  return ls;
}

const fixes = [
  { component: 'ProductPurchaseSelectOptionSetting', vars: 'const productPurchaseSelectOption = content.product_purchase_select_option;', start: 6309, end: 6495 },
  { component: 'SliderSetting', vars: 'const slider = content.slider;', start: 6556, end: 6752 },
];

const OUT = path.join(__dirname, '../src/views/BotElement/BotSetting/ScenarioSetting/contentSettings');

for (const { component, vars, start, end } of fixes) {
  const inner = stripWrapper(lines.slice(start, end));
  const body = inner.join('\n');
  const file = `${HEADER}const ${component} = ({ indexMessageSelect, indexContent, content }) => {
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
    <React.Fragment>
${body}
    </React.Fragment>
  );
};

export default ${component};
`;
  fs.writeFileSync(path.join(OUT, `${component}.jsx`), file);
  console.log(`Fixed ${component}`);
}
