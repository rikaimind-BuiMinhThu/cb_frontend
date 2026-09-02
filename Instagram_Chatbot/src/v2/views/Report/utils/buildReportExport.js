import { utils, writeFileXLSX } from 'xlsx';
import {
  DEVICE_ALL,
  DEVICE_COMPUTER,
  DEVICE_TABLET,
  EMPTY_CELL,
  EXPORT_BOT_LEAVE,
  EXPORT_BOT_OPEN,
  EXPORT_BOT_START,
  EXPORT_CT_PC,
  EXPORT_CT_SMARTPHONE,
  EXPORT_CT_TABLET,
  EXPORT_CTR,
  EXPORT_CV_COUNT,
  EXPORT_CV_PC,
  EXPORT_CV_SMARTPHONE,
  EXPORT_CV_TABLET,
  EXPORT_CV_TOTAL,
  EXPORT_CVR,
  EXPORT_DATE_HEADER,
  EXPORT_LEAVE_RATE,
  EXPORT_PC,
  EXPORT_PC_LEAVE,
  EXPORT_PERIOD_HEADER,
  EXPORT_SMARTPHONE,
  EXPORT_SMARTPHONE_LEAVE,
  EXPORT_START_PAGE,
  EXPORT_TABLET,
  EXPORT_TABLET_LEAVE,
  EXPORT_TOTAL,
  EXPORT_URL,
  ISO_DATE_LENGTH,
  SHEET_CLICK_THROUGH,
  SHEET_CONVERSION,
  SHEET_CTR,
  SHEET_CV_PAGE,
  SHEET_CVR,
  SHEET_LEAVE_COUNT,
  SHEET_LEAVE_RATE,
  SHEET_START_PAGE,
  formatDateRangeLabel,
  formatPercentLabel,
  getExportFileName,
} from '../constants';

export const getDevicePieSeries = (chatbotData) => [
  chatbotData.pc_open_chatbot_window_count,
  chatbotData.smartphone_open_chatbot_window_count,
  chatbotData.tablet_open_chatbot_window_count,
];

export const getAllDeviceTotals = (chatbotData) => ({
  conversion:
    chatbotData.smartphone_conversion_count +
    chatbotData.pc_conversion_count +
    chatbotData.tablet_conversion_count,
  botStart:
    chatbotData.pc_count + chatbotData.tablet_count + chatbotData.smartphone_count,
  botOpen:
    chatbotData.pc_open_chatbot_window_count +
    chatbotData.tablet_open_chatbot_window_count +
    chatbotData.smartphone_open_chatbot_window_count,
  botClose:
    chatbotData.pc_close_chatbot_window_count +
    chatbotData.tablet_close_chatbot_window_count +
    chatbotData.smartphone_close_chatbot_window_count,
});

export const isEmptyDeviceCounts = (chatbotData) =>
  chatbotData.pc_count === 0 &&
  chatbotData.pc_count === 0 &&
  chatbotData.pc_count === 0;

export const getDefaultRangeIso = () => {
  const start = new Date(new Date().setDate(1)).toISOString().slice(0, ISO_DATE_LENGTH);
  const end = new Date(new Date().setDate(new Date().getDate() - 1))
    .toISOString()
    .slice(0, ISO_DATE_LENGTH);
  return { start, end };
};

export const buildPageExportSheets = (pages, dateRangeLabel) => {
  const startPageExportData = [[EXPORT_PERIOD_HEADER, dateRangeLabel]];
  startPageExportData.push([EXPORT_START_PAGE, EXPORT_CV_COUNT, EXPORT_URL]);
  const contentPageExport = [[EXPORT_PERIOD_HEADER, dateRangeLabel]];
  contentPageExport.push([EXPORT_START_PAGE, EXPORT_CV_COUNT, EXPORT_URL]);
  pages.forEach((index) => {
    startPageExportData.push([index.num_of_start, index.num_of_cv, index.url]);
    if (index.num_of_cv > 0) {
      contentPageExport.push([index.num_of_start, index.num_of_cv, index.url]);
    }
  });
  return { startPageExportData, contentPageExport };
};

const createTotals = () => ({
  conversion: 0,
  botStart: 0,
  botOpen: 0,
  botLeave: 0,
  cvrPC: 0,
  cvrTB: 0,
  cvrSP: 0,
  ctrPC: 0,
  ctrTB: 0,
  ctrSP: 0,
  lBPC: 0,
  lBTB: 0,
  lBSP: 0,
});

const getConversionHeader = (device) => {
  if (device === DEVICE_ALL) {
    return [EXPORT_PERIOD_HEADER, EXPORT_CV_PC, EXPORT_CV_TABLET, EXPORT_CV_SMARTPHONE];
  }
  if (device === DEVICE_COMPUTER) {
    return [EXPORT_PERIOD_HEADER, EXPORT_CV_PC];
  }
  if (device === DEVICE_TABLET) {
    return [EXPORT_PERIOD_HEADER, EXPORT_CV_TABLET];
  }
  return [EXPORT_PERIOD_HEADER, EXPORT_CV_SMARTPHONE];
};

const getCvrHeader = (device) => {
  if (device === DEVICE_ALL) {
    return [EXPORT_CV_PC, EXPORT_CV_TABLET, EXPORT_CV_SMARTPHONE, EXPORT_CV_TOTAL, EXPORT_BOT_OPEN];
  }
  if (device === DEVICE_COMPUTER) {
    return [EXPORT_CV_PC, EXPORT_CV_TOTAL, EXPORT_BOT_OPEN];
  }
  if (device === DEVICE_TABLET) {
    return [EXPORT_CV_TABLET, EXPORT_CV_TOTAL, EXPORT_BOT_OPEN];
  }
  return [EXPORT_CV_SMARTPHONE, EXPORT_CV_TOTAL, EXPORT_BOT_OPEN];
};

const getCtrHeader = (device) => {
  if (device === DEVICE_ALL) {
    return [EXPORT_CT_PC, EXPORT_CT_TABLET, EXPORT_CT_SMARTPHONE, EXPORT_BOT_START, EXPORT_BOT_OPEN];
  }
  if (device === DEVICE_COMPUTER) {
    return [EXPORT_CT_PC, EXPORT_BOT_START, EXPORT_BOT_OPEN];
  }
  if (device === DEVICE_TABLET) {
    return [EXPORT_CT_TABLET, EXPORT_BOT_START, EXPORT_BOT_OPEN];
  }
  return [EXPORT_CT_SMARTPHONE, EXPORT_BOT_START, EXPORT_BOT_OPEN];
};

const getBotLeaveHeader = (device) => {
  if (device === DEVICE_ALL) {
    return [
      EXPORT_PERIOD_HEADER,
      EXPORT_PC_LEAVE,
      EXPORT_TABLET_LEAVE,
      EXPORT_SMARTPHONE_LEAVE,
      EXPORT_BOT_START,
      EXPORT_BOT_LEAVE,
    ];
  }
  if (device === DEVICE_COMPUTER) {
    return [EXPORT_PERIOD_HEADER, EXPORT_PC_LEAVE, EXPORT_BOT_START, EXPORT_BOT_LEAVE];
  }
  if (device === DEVICE_TABLET) {
    return [EXPORT_PERIOD_HEADER, EXPORT_TABLET_LEAVE, EXPORT_BOT_START, EXPORT_BOT_LEAVE];
  }
  return [EXPORT_PERIOD_HEADER, EXPORT_SMARTPHONE_LEAVE, EXPORT_BOT_START, EXPORT_BOT_LEAVE];
};

const getLeaveRateHeader = (device) => {
  if (device === DEVICE_ALL) {
    return [EXPORT_PC, EXPORT_TABLET, EXPORT_SMARTPHONE, EXPORT_TOTAL, EXPORT_BOT_START];
  }
  if (device === DEVICE_COMPUTER) {
    return [EXPORT_PC, EXPORT_TOTAL, EXPORT_BOT_START];
  }
  if (device === DEVICE_TABLET) {
    return [EXPORT_TABLET, EXPORT_TOTAL, EXPORT_BOT_START];
  }
  return [EXPORT_SMARTPHONE, EXPORT_TOTAL, EXPORT_BOT_START];
};

const getConversionRow = (index, device) => {
  if (device === DEVICE_ALL) {
    return [
      index.log_date,
      index.pc_conversion_count,
      index.tablet_conversion_count,
      index.smartphone_conversion_count,
    ];
  }
  if (device === DEVICE_COMPUTER) {
    return [index.log_date, index.pc_conversion_count];
  }
  if (device === DEVICE_TABLET) {
    return [index.log_date, index.tablet_conversion_count];
  }
  return [index.log_date, index.smartphone_conversion_count];
};

const getConversionAmount = (index, device) => {
  if (device === DEVICE_ALL) {
    return (
      index.pc_conversion_count +
      index.tablet_conversion_count +
      index.smartphone_conversion_count
    );
  }
  if (device === DEVICE_COMPUTER) {
    return index.pc_conversion_count;
  }
  if (device === DEVICE_TABLET) {
    return index.tablet_conversion_count;
  }
  return index.smartphone_conversion_count;
};

const getOpenCount = (index, device) => {
  if (device === DEVICE_ALL) {
    return (
      index.pc_open_chatbot_window_count +
      index.smartphone_open_chatbot_window_count +
      index.tablet_open_chatbot_window_count
    );
  }
  if (device === DEVICE_COMPUTER) {
    return index.pc_open_chatbot_window_count;
  }
  if (device === DEVICE_TABLET) {
    return index.tablet_open_chatbot_window_count;
  }
  return index.smartphone_open_chatbot_window_count;
};

const getLeaveCount = (index, device) => {
  if (device === DEVICE_ALL) {
    return (
      index.pc_close_chatbot_window_count +
      index.tablet_close_chatbot_window_count +
      index.smartphone_close_chatbot_window_count
    );
  }
  if (device === DEVICE_COMPUTER) {
    return index.pc_close_chatbot_window_count;
  }
  if (device === DEVICE_TABLET) {
    return index.tablet_close_chatbot_window_count;
  }
  return index.smartphone_close_chatbot_window_count;
};

const getBotLeaveRow = (index, device) => {
  if (device === DEVICE_ALL) {
    return [
      index.log_date,
      index.pc_close_chatbot_window_count,
      index.tablet_close_chatbot_window_count,
      index.smartphone_close_chatbot_window_count,
      index.pc_open_chatbot_window_count +
        index.smartphone_open_chatbot_window_count +
        index.tablet_open_chatbot_window_count,
      index.pc_close_chatbot_window_count +
        index.tablet_close_chatbot_window_count +
        index.smartphone_close_chatbot_window_count,
    ];
  }
  if (device === DEVICE_COMPUTER) {
    return [
      index.log_date,
      index.pc_close_chatbot_window_count,
      index.pc_open_chatbot_window_count,
      index.pc_close_chatbot_window_count,
    ];
  }
  if (device === DEVICE_TABLET) {
    return [
      index.log_date,
      index.tablet_close_chatbot_window_count,
      index.tablet_open_chatbot_window_count,
      index.smartphone_close_chatbot_window_count,
    ];
  }
  return [
    index.log_date,
    index.smartphone_close_chatbot_window_count,
    index.smartphone_open_chatbot_window_count,
    index.smartphone_close_chatbot_window_count,
  ];
};

const getCvrTotalRow = (totals, device) => {
  if (device === DEVICE_ALL) {
    return [totals.cvrPC, totals.cvrTB, totals.cvrSP, totals.conversion, totals.botOpen];
  }
  if (device === DEVICE_COMPUTER) {
    return [totals.cvrPC, totals.conversion, totals.botOpen];
  }
  if (device === DEVICE_TABLET) {
    return [totals.cvrTB, totals.conversion, totals.botOpen];
  }
  return [totals.cvrSP, totals.conversion, totals.botOpen];
};

const getCtrTotalRow = (totals, device) => {
  if (device === DEVICE_ALL) {
    return [totals.ctrPC, totals.ctrTB, totals.ctrSP, totals.botStart, totals.botOpen];
  }
  if (device === DEVICE_COMPUTER) {
    return [totals.ctrPC, totals.botStart, totals.botOpen];
  }
  if (device === DEVICE_TABLET) {
    return [totals.ctrTB, totals.botStart, totals.botOpen];
  }
  return [totals.ctrSP, totals.botStart, totals.botOpen];
};

const getLeaveRateTotalRow = (totals, device) => {
  if (device === DEVICE_ALL) {
    return [totals.lBPC, totals.lBTB, totals.lBSP, totals.botLeave, totals.botStart];
  }
  if (device === DEVICE_COMPUTER) {
    return [totals.lBPC, totals.botLeave, totals.botStart];
  }
  if (device === DEVICE_TABLET) {
    return [totals.lBTB, totals.botLeave, totals.botStart];
  }
  return [totals.lBSP, totals.botLeave, totals.botStart];
};

export const buildInitialDownloadExport = (exportData, dateRangeLabel) => {
  const totals = createTotals();
  const exportCV = [[EXPORT_PERIOD_HEADER, EXPORT_CV_PC, EXPORT_CV_TABLET, EXPORT_CV_SMARTPHONE]];
  const exportClickThrough = [[EXPORT_PERIOD_HEADER, EXPORT_BOT_START, EXPORT_BOT_OPEN]];
  const exportBotLeave = [
    [
      EXPORT_PERIOD_HEADER,
      EXPORT_PC_LEAVE,
      EXPORT_TABLET_LEAVE,
      EXPORT_SMARTPHONE_LEAVE,
      EXPORT_BOT_START,
      EXPORT_BOT_LEAVE,
    ],
  ];
  const exportCVR = [[EXPORT_PERIOD_HEADER, dateRangeLabel]];
  exportCVR.push([
    EXPORT_CV_PC,
    EXPORT_CV_TABLET,
    EXPORT_CV_SMARTPHONE,
    EXPORT_CV_TOTAL,
    EXPORT_BOT_OPEN,
  ]);
  const exportCTR = [[EXPORT_DATE_HEADER, dateRangeLabel]];
  exportCTR.push([
    EXPORT_CT_PC,
    EXPORT_CT_TABLET,
    EXPORT_CT_SMARTPHONE,
    EXPORT_BOT_START,
    EXPORT_BOT_OPEN,
  ]);
  const exportLeaveBotRate = [[EXPORT_PERIOD_HEADER, dateRangeLabel]];
  exportLeaveBotRate.push([
    EXPORT_PC,
    EXPORT_TABLET,
    EXPORT_SMARTPHONE,
    EXPORT_TOTAL,
    EXPORT_BOT_START,
  ]);
  exportData.forEach((index) => {
    exportCV.push([
      index.log_date,
      index.pc_conversion_count,
      index.tablet_conversion_count,
      index.smartphone_conversion_count,
    ]);
    totals.conversion +=
      index.pc_conversion_count +
      index.tablet_conversion_count +
      index.smartphone_conversion_count;
    totals.cvrPC += index.pc_conversion_count;
    totals.cvrTB += index.tablet_conversion_count;
    totals.cvrSP += index.smartphone_conversion_count;
    exportClickThrough.push([
      index.log_date,
      index.pc_open_chatbot_window_count +
        index.smartphone_open_chatbot_window_count +
        index.tablet_open_chatbot_window_count,
      index.pc_count + index.smartphone_count + index.tablet_count,
    ]);
    totals.botStart += index.pc_count + index.smartphone_count + index.tablet_count;
    totals.botOpen +=
      index.pc_open_chatbot_window_count +
      index.smartphone_open_chatbot_window_count +
      index.tablet_open_chatbot_window_count;
    totals.ctrPC += index.pc_open_chatbot_window_count;
    totals.ctrTB += index.tablet_open_chatbot_window_count;
    totals.ctrSP += index.smartphone_open_chatbot_window_count;
    exportBotLeave.push([
      index.log_date,
      index.pc_close_chatbot_window_count,
      index.tablet_close_chatbot_window_count,
      index.smartphone_close_chatbot_window_count,
      index.pc_open_chatbot_window_count +
        index.smartphone_open_chatbot_window_count +
        index.tablet_open_chatbot_window_count,
      index.pc_close_chatbot_window_count +
        index.tablet_close_chatbot_window_count +
        index.smartphone_close_chatbot_window_count,
    ]);
    totals.botLeave +=
      index.pc_close_chatbot_window_count +
      index.tablet_close_chatbot_window_count +
      index.smartphone_close_chatbot_window_count;
    totals.lBPC += index.pc_close_chatbot_window_count;
    totals.lBTB += index.tablet_close_chatbot_window_count;
    totals.lBSP += index.smartphone_close_chatbot_window_count;
  });
  exportCVR.push([totals.cvrPC, totals.cvrTB, totals.cvrSP, totals.conversion, totals.botOpen]);
  exportCVR.push([
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EXPORT_CVR,
    formatPercentLabel(totals.conversion, totals.botOpen),
  ]);
  exportCTR.push([totals.ctrPC, totals.ctrTB, totals.ctrSP, totals.botStart, totals.botOpen]);
  exportCTR.push([
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EXPORT_CTR,
    formatPercentLabel(totals.botOpen, totals.botStart),
  ]);
  exportLeaveBotRate.push([
    totals.lBPC,
    totals.lBTB,
    totals.lBSP,
    totals.botLeave,
    totals.botStart,
  ]);
  exportLeaveBotRate.push([
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EXPORT_LEAVE_RATE,
    formatPercentLabel(totals.botLeave, totals.botStart),
  ]);
  exportCV.push([EMPTY_CELL, EXPORT_TOTAL, EMPTY_CELL, totals.conversion]);
  exportClickThrough.push([EXPORT_TOTAL, totals.botStart, totals.botOpen]);
  exportBotLeave.push([
    EMPTY_CELL,
    EXPORT_TOTAL,
    EMPTY_CELL,
    EMPTY_CELL,
    totals.botStart,
    totals.botLeave,
  ]);
  return {
    conversionExport: exportCV,
    clickThroughExport: exportClickThrough,
    leaveBotExport: exportBotLeave,
    conversionRateExport: exportCVR,
    clickThroughRateExport: exportCTR,
    botLeaveRate: exportLeaveBotRate,
  };
};

export const buildSearchDownloadExport = (exportData, searchVal) => {
  const totals = createTotals();
  const dateRangeLabel = formatDateRangeLabel(searchVal.startDate, searchVal.endDate);
  const exportCV = [getConversionHeader(searchVal.device)];
  const exportCVR = [[EXPORT_PERIOD_HEADER, dateRangeLabel]];
  exportCVR.push(getCvrHeader(searchVal.device));
  const exportCTR = [[EXPORT_PERIOD_HEADER, dateRangeLabel]];
  const exportClickThrough = [[EXPORT_PERIOD_HEADER, EXPORT_BOT_START, EXPORT_BOT_OPEN]];
  const exportBotLeave = [getBotLeaveHeader(searchVal.device)];
  exportCTR.push(getCtrHeader(searchVal.device));
  const exportLeaveBotRate = [[EXPORT_PERIOD_HEADER, dateRangeLabel]];
  exportLeaveBotRate.push(getLeaveRateHeader(searchVal.device));
  exportData.forEach((index) => {
    exportCV.push(getConversionRow(index, searchVal.device));
    totals.conversion += getConversionAmount(index, searchVal.device);
    totals.cvrPC += index.pc_conversion_count;
    totals.cvrTB += index.tablet_conversion_count;
    totals.cvrSP += index.smartphone_conversion_count;
    exportClickThrough.push([
      index.log_date,
      searchVal.device === DEVICE_ALL
        ? index.pc_open_chatbot_window_count +
          index.smartphone_open_chatbot_window_count +
          index.tablet_open_chatbot_window_count
        : searchVal.device === DEVICE_COMPUTER
          ? index.pc_open_chatbot_window_count
          : searchVal.device === DEVICE_TABLET
            ? index.tablet_open_chatbot_window_count
            : index.smartphone_open_chatbot_window_count,
      searchVal.device === DEVICE_ALL
        ? index.pc_count + index.smartphone_count + index.tablet_count
        : searchVal.device === DEVICE_COMPUTER
          ? index.pc_count
          : searchVal === DEVICE_TABLET
            ? index.tablet_count
            : index.smartphone_count,
    ]);
    totals.botStart +=
      searchVal.device === DEVICE_ALL
        ? index.pc_count + index.smartphone_count + index.tablet_count
        : searchVal.device === DEVICE_COMPUTER
          ? index.pc_count
          : searchVal.device === DEVICE_TABLET
            ? index.tablet_count
            : index.smartphone_count;
    totals.botOpen += getOpenCount(index, searchVal.device);
    totals.ctrPC += index.pc_count;
    totals.ctrTB += index.tablet_count;
    totals.ctrSP += index.smartphone_count;
    exportBotLeave.push(getBotLeaveRow(index, searchVal.device));
    totals.botLeave += getLeaveCount(index, searchVal.device);
    totals.lBPC += index.pc_close_chatbot_window_count;
    totals.lBTB += index.tablet_close_chatbot_window_count;
    totals.lBSP += index.smartphone_close_chatbot_window_count;
  });
  exportCVR.push(getCvrTotalRow(totals, searchVal.device));
  exportCVR.push([
    EMPTY_CELL,
    EXPORT_CVR,
    formatPercentLabel(totals.conversion, totals.botOpen),
    EMPTY_CELL,
    EMPTY_CELL,
  ]);
  exportCTR.push(getCtrTotalRow(totals, searchVal.device));
  exportCTR.push([
    EMPTY_CELL,
    EXPORT_CTR,
    formatPercentLabel(totals.botOpen, totals.botStart),
    EMPTY_CELL,
    EMPTY_CELL,
  ]);
  exportLeaveBotRate.push(getLeaveRateTotalRow(totals, searchVal.device));
  exportLeaveBotRate.push([
    EMPTY_CELL,
    EMPTY_CELL,
    EMPTY_CELL,
    EXPORT_LEAVE_RATE,
    formatPercentLabel(totals.botLeave, totals.botStart),
  ]);
  exportCV.push([EMPTY_CELL, EXPORT_TOTAL, totals.conversion, EMPTY_CELL]);
  exportClickThrough.push([EXPORT_TOTAL, totals.botStart, totals.botOpen]);
  exportBotLeave.push([
    EMPTY_CELL,
    EXPORT_TOTAL,
    totals.botStart,
    totals.botLeave,
    EMPTY_CELL,
    EMPTY_CELL,
  ]);
  return {
    conversionExport: exportCV,
    clickThroughExport: exportClickThrough,
    leaveBotExport: exportBotLeave,
    conversionRateExport: exportCVR,
    clickThroughRateExport: exportCTR,
    botLeaveRate: exportLeaveBotRate,
  };
};

export const writeReportWorkbook = ({
  conversionRateExport,
  conversionExport,
  clickThroughRateExport,
  clickThroughExport,
  botLeaveRate,
  leaveBotExport,
  startPageExport,
  cvPageExport,
  startDateEx,
  endDateEx,
}) => {
  const wb = utils.book_new();
  const cvr = utils.aoa_to_sheet(conversionRateExport);
  const ws1 = utils.aoa_to_sheet(conversionExport);
  const ctr = utils.aoa_to_sheet(clickThroughRateExport);
  const ws2 = utils.aoa_to_sheet(clickThroughExport);
  const lbr = utils.aoa_to_sheet(botLeaveRate);
  const ws3 = utils.aoa_to_sheet(leaveBotExport);
  const startPageSheet = utils.aoa_to_sheet(startPageExport);
  const cvPageSheet = utils.aoa_to_sheet(cvPageExport);
  utils.book_append_sheet(wb, cvr, SHEET_CVR);
  utils.book_append_sheet(wb, ws1, SHEET_CONVERSION);
  utils.book_append_sheet(wb, ctr, SHEET_CTR);
  utils.book_append_sheet(wb, ws2, SHEET_CLICK_THROUGH);
  utils.book_append_sheet(wb, lbr, SHEET_LEAVE_RATE);
  utils.book_append_sheet(wb, ws3, SHEET_LEAVE_COUNT);
  utils.book_append_sheet(wb, startPageSheet, SHEET_START_PAGE);
  utils.book_append_sheet(wb, cvPageSheet, SHEET_CV_PAGE);
  writeFileXLSX(wb, getExportFileName(startDateEx, endDateEx));
};
