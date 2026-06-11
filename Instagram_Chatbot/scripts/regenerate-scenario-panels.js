#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ORIGINAL = execSync(
  'git show HEAD:Instagram_Chatbot/src/views/BotElement/BotSetting/ScenarioSetting/ScenarioEditorContent.jsx',
  { cwd: path.join(ROOT, '..'), encoding: 'utf8' }
);
const lines = ORIGINAL.split('\n');

const PANEL_IMPORTS = `import React from 'react';
import { Button } from 'reactstrap';
import icon from '../../../../../assets/img/bot-icon/man1_new.png';
import { MDBIcon } from 'mdbreact';
import 'react-datepicker/dist/react-datepicker.css';
import SelectCustom from '../scenarioComon/SelectCustom';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import InputNum from '../scenarioComon/InputNum';
import InputDouble from '../scenarioComon/InputDouble';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../scenarioComon/InputCustom';
import moment from 'moment';
import api from '../../../../../api/api-management';
import Cookies from 'js-cookie';
import ModalNoti from '../../../../Popup/ModalNoti';
import ModalShort from '../../../../Popup/ModalShort';
import Preview from '../../Preview';
import PreviewFaq from '../../PreviewFaq';
import FileReferencePopup from '../FileReferencePopup';
import ShopifyReferencePopup from '../ShopifyReferencePopup';
import axios from 'axios';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {
  S3_UPLOAD_URL,
  FUKUSHASHIKI_SEARCH_MODE_OPTIONS,
  FUKUSHASHIKI_SEARCH_VALUE_LABELS,
} from '../../../../../variables/constants';
import { tokenExpired } from 'api/tokenExpired';
import DatePickerCustom from '../scenarioComon/DatePickerCustom';
import { Carousel, Checkbox, Radio, Slider, Calendar, Select } from 'antd';
import { HtmlCodeMessage } from '../../../../../components/BotMessages';
import CheckboxGroupCustom from '../scenarioComon/CheckboxGroupCustom';
import shopifIcon from '../../../../../assets/img/shopify-icon.png';
import nanoMetadata from 'nano-metadata';
import locale from 'antd/es/date-picker/locale/ja_JP';
import 'moment/locale/zh-cn';
import ShopifyReferenceSelect from '../ShopifyReferenceSelect';
import { Tooltip } from '@mui/material';
import { MESSAGE_CONTENT_TYPES, TIMER_TYPES, TIMER_VARIABLES, TIMER_VARIABLES_DESCRIPTION, BOT_MESSAGE_TYPES, RANGE_TEXT_VALIDATE, LABELS, GENDER_DISPLAY_TYPES, CART_SYSTEM } from '../../PreviewComponent/Constants';
import HtmlCodeConfig from '../scenarioComon/HtmlCodeConfig';
import OptionGenderConfig from '../OptionGenderConfig';
import SubmitButtonLoadingConfig from '../SubmitButtonLoadingConfig';
import SubmitButtonConfig from '../SubmitButtonConfig';
import ZipCodeAddressSetting from '../Settings/ZipCodeAddressSetting';
import { CONTENT_SETTING_MAP } from '../contentSettings';
import { PREVIEW_MAP } from '../contentPreviews';
import { renderFukushashikiSetting } from '../ScenarioUtils';
import PaymentDisplayStyleSection from './PaymentDisplayStyleSection';
import { PAYMENT_OPTION_IMAGE_FIELDS } from '../constants/paymentStyleConstants';
import {
  dataPaymentMethod,
  dataHourFixed,
  dataMinutesFixed,
  dataEveryMinuteFixed,
  dataYearFixed,
  dataMonthFixed,
  dataDayFixed,
  dataMaxRangSlider,
  dataConsumeApiResponse,
  agreeTermType,
  dataTypeFile,
  dataSubCondition,
  dataApiLinkage,
  installmentOptions,
  initialTimeConfig,
  carouselType,
  typeCalendar,
  dropDownTitle,
  convertTextType,
  typeTextarea,
  typeRadio,
  rangeText,
  hyphenPhoneNumber,
  typeCheckbox,
  dataTypePullDown,
  dataSelectDateTime,
  dataConditionFixed,
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
import { cleanMessageTimerConfig } from '../utils/scenarioApiUtils';
import { settingsCarousel } from './scenarioCarouselSettings';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
import ScenarioCustomCssModal from './modals/ScenarioCustomCssModal';
import ScenarioCustomJsModal from './modals/ScenarioCustomJsModal';
import ScenarioTimerModal from './modals/ScenarioTimerModal';
import ScenarioErrMsgJsModal from './modals/ScenarioErrMsgJsModal';

const { Option } = Select;
const _ = require('lodash');
`;

const MODALS_IMPORTS = `import React from 'react';
import { Button } from 'reactstrap';
import ModalNoti from '../../../../Popup/ModalNoti';
import ModalShort from '../../../../Popup/ModalShort';
import FileReferencePopup from '../FileReferencePopup';
import ShopifyReferencePopup from '../ShopifyReferencePopup';
import ScenarioCustomCssModal from './modals/ScenarioCustomCssModal';
import ScenarioCustomJsModal from './modals/ScenarioCustomJsModal';
import ScenarioTimerModal from './modals/ScenarioTimerModal';
import ScenarioErrMsgJsModal from './modals/ScenarioErrMsgJsModal';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
`;

const PREVIEW_IMPORTS = `import React from 'react';
import Preview from '../../Preview';
import PreviewFaq from '../../PreviewFaq';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
`;

const DESTRUCTURING = `  const panel = useScenarioPanelDestructuring();
  const {
    scenarioName, scenarioType, urlThanks, merchandiseId, lpProductUrl, coupon,
    isUseOnlyRegularOrder, isUseFukushashiki, isUseCustomCss, customCssContent,
    isUsedCartConfirmPage, urlCartConfirmPage, isOpenModalCustomCss, isUseCustomJsCode,
    headCustomJsCode, topBodyCustomJsCode, bottomBodyCustomJsCode, isOpenModalCustomJsCode,
    timerConfig, errMsgJsCode, isOpenErrMsgByJsSettingModal, isUseErrMsgByJs,
    errorScenarioName, belongTo, messageType, indexMessageSelect, dataInputVar,
    isOpenPreview, varFileReference, isOpenFileReference, indexCarouselSlide,
    varShopifyReference, isOpenShopifyReference, botTextValue, isOpenAddVariable,
    fileError, fileErrorCarousel, dataMessages, dataPrefectures, dataCity,
    botId, scenarioId, isOpenNoti, messageNoti, dataEmail, isConditionUp,
    conditions, variableName, defaultValue, acceptFile, dataHour, dataMinutes,
    dataEveryMinute, dataYear, dataMonth, dataDay, errorVariable, dataCondition,
    isUsedMessageLoadedPast, isUsedCrosssell, productIdCrossSell,
    isClearLandingPageSession, isUseBtnUpdateTracking, useFullwidthChatbotMobile,
    clientCartSystem, listProductVariants, isShopifyPaymentScenario,
    setScenarioName, setScenarioType, setUrlThanks, setMerchandiseId, setLpProductUrl,
    setCoupon, setIsUseOnlyRegularOrder, setIsUseFukushashiki, setIsUseCustomCss,
    setCustomCssContent, setIsUsedCartConfirmPage, setUrlCartConfirmPage,
    setIsOpenModalCustomCss, setIsUseCustomJsCode, setHeadCustomJsCode,
    setTopBodyCustomJsCode, setBottomBodyCustomJsCode, setIsOpenModalCustomJsCode,
    setTimerConfig, setErrMsgJsCode, setIsOpenErrMsgByJsSettingModal, setIsUseErrMsgByJs,
    setErrorScenarioName, setBelongTo, setMessageType, setIndexMessageSelect,
    setDataInputVar, setIsOpenPreview, setVarFileReference, setIsOpenFileReference,
    setIndexCarouselSlide, setVarShopifyReference, setIsOpenShopifyReference,
    setBotTextValue, setIsOpenAddVariable, setFileError, setFileErrorCarousel,
    setDataMessages, setDataPrefectures, setDataCity, setBotId, setScenarioId,
    setIsOpenNoti, setMessageNoti, setDataEmail, setIsConditionUp, setConditions,
    setVariableName, setDefaultValue, setAcceptFile, setDataHour, setDataMinutes,
    setDataEveryMinute, setDataYear, setDataMonth, setDataDay, setErrorVariable,
    setDataCondition, setIsUsedMessageLoadedPast, setIsUsedCrosssell,
    setProductIdCrossSell, setIsClearLandingPageSession, setIsUseBtnUpdateTracking,
    setUseFullwidthChatbotMobile, setClientCartSystem, setListProductVariants,
    handleGetMessage, onClickSaveScenario, onClickSavePreview, getListVariable,
    handleOpenPreview,
    onChangeValueMessageContent, onChangeTimePullDown, onChangeValueNameMessage,
    botUploadFile, carouselUploadFile, getBaseUrl, handleSelectMessage, handleHiddenMessage,
    handleSelectContentMessage, handleEditIconClick, handleChangeBotStatementType,
    handleAddItemSetting, handleCopyMessage, handleDeleteMessageContent, handleDeleteMessage,
    handleAddItemRadioCheckbox, handleAddItemCustomizePullDown, handleAddItemProductPullDown,
    handleAddItemAgreeTerm, handleDragEnd, handleDragEndMessageOverview,
    handleDragEndRadioCheckbox, handleDragEndPullDown, handleDragEndProduct,
    onChangeFixedDate, handleChangeValueRequireZipCode, handleRemoveItemContent,
    handleRemoveItemCustomizePullDown, handleRemoveItemProductPullDown,
    handleRemoveItemZipCodeAddress, createVariable, onClickCreateStatement,
    handlePannelCondition, onChangeValueCondition, onClickAddCondition,
    handleDeleteCondition, handleDownloadFile, isColor,
    renderPaymentMethodDescriptionInput, renderRootFaqOption, renderAddressField,
    renderBuildingName, renderMunicipality, renderPostCode, renderZipCodeAddressTitle,
    renderPrefecture, renderLPIntegrationOptionSetting, renderLPIntegrationOptionPreview,
    renderTextInputPasswordConfirmationPreview, renderPreviewPulldownfromJs,
    renderDetailSettingPulldownFromJs,
  } = panel;
`;

function sliceLines(start, end) {
  return lines.slice(start - 1, end).join('\n');
}

function writePanel(filename, imports, componentName, jsxLines, wrapReturn = (body) => body) {
  const outDir = path.join(
    ROOT,
    'src/views/BotElement/BotSetting/ScenarioSetting/components'
  );
  const body = wrapReturn(jsxLines);
  const content = `${imports}
const ${componentName} = () => {
${DESTRUCTURING}
  return (
${body}
  );
};

export default ${componentName};
`;
  fs.writeFileSync(path.join(outDir, filename), content);
  console.log(`Wrote ${filename} (${content.split('\n').length} lines)`);
}

// Overview list: lines 1784-3518
writePanel(
  'ScenarioMessageOverviewList.jsx',
  PANEL_IMPORTS,
  'ScenarioMessageOverviewList',
  sliceLines(1784, 3518),
  (body) => `    <>\n${body}\n    </>`
);

// Bot settings: lines 3526-3958
writePanel(
  'ScenarioBotSettingsPanel.jsx',
  PANEL_IMPORTS,
  'ScenarioBotSettingsPanel',
  sliceLines(3526, 3958),
  (body) => `    <>\n${body}\n    </>`
);

// User settings: lines 3960-9496
writePanel(
  'ScenarioUserSettingsPanel.jsx',
  PANEL_IMPORTS,
  'ScenarioUserSettingsPanel',
  sliceLines(3960, 9496),
  (body) => `    <>\n${body}\n    </>`
);

// Modals: lines 9505-9611 (through last ModalShort, before preview overlay)
const modalsJsx = sliceLines(9505, 9612);
writePanel(
  'ScenarioEditorModals.jsx',
  MODALS_IMPORTS,
  'ScenarioEditorModals',
  modalsJsx,
  (body) => `    <>\n${body}\n    </>`
);

// Preview overlay: lines 9613-9619
writePanel(
  'ScenarioPreviewOverlay.jsx',
  PREVIEW_IMPORTS,
  'ScenarioPreviewOverlay',
  sliceLines(9613, 9619),
  (body) => `    <>\n${body}\n    </>`
);

console.log('Done regenerating scenario panels.');
