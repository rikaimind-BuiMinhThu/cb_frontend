import {
  CHART_ALIGN_CENTER,
  CHART_BAR_HEIGHT,
  CHART_BOT_OPEN,
  CHART_BOT_START,
  CHART_CONVERSION,
  CHART_CTR_PREFIX,
  CHART_CVR_PREFIX,
  CHART_FONT_SIZE,
  CHART_FONT_WEIGHT,
  CHART_INTERNAL_HEIGHT,
  CHART_LABEL_POSITION_BOTTOM,
  CHART_LABEL_SEPARATOR,
  CHART_LEAVE,
  CHART_LEAVE_PREFIX,
  CHART_LEGEND_BOTTOM,
  CHART_MOBILE_BREAKPOINT,
  CHART_PIE_MOBILE_WIDTH,
  CHART_PIE_WIDTH,
  CHART_STROKE_WIDTH,
  CHART_SUBTITLE_CTR,
  CHART_SUBTITLE_CVR,
  CHART_TEXT_ANCHOR_START,
  CHART_THEME_DARK,
  CHART_TITLE_CTR,
  CHART_TITLE_CVR,
  CHART_TITLE_LEAVE,
  CHART_TOTAL_PREFIX,
  CHART_TYPE_BAR,
  CHART_TYPE_PIE,
  CHART_WHITE,
  EMPTY_CELL,
  EMPTY_PIE_SERIES,
  LABEL_PC,
  LABEL_SMARTPHONE,
  LABEL_TABLET,
  PERCENT_SUFFIX,
  formatRateNumber,
} from '../constants';

export const buildCvrCtrChart = ({
  isCtr,
  conversionCvrCtr,
  numOfOpenBot,
  numOfBotStart,
  palette,
}) => {
  const conversionValue = conversionCvrCtr ?? 0;
  const openValue = numOfOpenBot ?? 0;
  const startValue = numOfBotStart ?? 0;
  const rateText = isCtr
    ? `${CHART_CTR_PREFIX}${formatRateNumber(numOfOpenBot, numOfBotStart)}`
    : `${CHART_CVR_PREFIX}${formatRateNumber(conversionCvrCtr, numOfOpenBot)}`;

  return {
    series: [
      {
        name: isCtr ? CHART_BOT_OPEN : CHART_CONVERSION,
        data: [isCtr ? openValue : conversionValue],
      },
      {
        name: isCtr ? CHART_BOT_START : CHART_BOT_OPEN,
        data: [isCtr ? startValue : openValue],
      },
    ],
    options: {
      chart: {
        type: CHART_TYPE_BAR,
        height: CHART_INTERNAL_HEIGHT,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: CHART_FONT_SIZE,
                fontWeight: CHART_FONT_WEIGHT,
              },
            },
            position: CHART_LABEL_POSITION_BOTTOM,
          },
        },
      },
      colors: [palette[0], palette[1]],
      dataLabels: {
        enabled: true,
        textAnchor: CHART_TEXT_ANCHOR_START,
        style: {
          colors: [CHART_WHITE],
        },
        formatter: (val) => `${CHART_TOTAL_PREFIX}${val}`,
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: CHART_STROKE_WIDTH,
        colors: [CHART_WHITE],
      },
      xaxis: {
        categories: [` ${rateText}${PERCENT_SUFFIX}`],
        labels: {
          formatter: (val) => val,
        },
      },
      yaxis: {
        labels: {
          show: true,
        },
      },
      title: {
        text: isCtr ? CHART_TITLE_CTR : CHART_TITLE_CVR,
        align: CHART_ALIGN_CENTER,
        floating: true,
      },
      subtitle: {
        text: isCtr ? CHART_SUBTITLE_CTR : CHART_SUBTITLE_CVR,
        align: CHART_ALIGN_CENTER,
      },
      tooltip: {
        y: {
          formatter: (val) => val + EMPTY_CELL,
        },
      },
    },
  };
};

export const buildLeaveBotChart = ({ numOfCloseBot, numOfBotStart, palette }) => ({
  series: [
    {
      data: [numOfCloseBot ?? 0, numOfBotStart ?? 0],
    },
  ],
  options: {
    chart: {
      type: CHART_TYPE_BAR,
      height: CHART_INTERNAL_HEIGHT,
    },
    plotOptions: {
      bar: {
        barHeight: CHART_BAR_HEIGHT,
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: CHART_LABEL_POSITION_BOTTOM,
        },
      },
    },
    colors: [palette[0], palette[1]],
    dataLabels: {
      enabled: true,
      textAnchor: CHART_TEXT_ANCHOR_START,
      style: {
        colors: [CHART_WHITE],
      },
      formatter: (val, opt) =>
        opt.w.globals.labels[opt.dataPointIndex] + CHART_LABEL_SEPARATOR + val,
      offsetX: 0,
      dropShadow: {
        enabled: true,
      },
    },
    stroke: {
      width: CHART_STROKE_WIDTH,
      colors: [CHART_WHITE],
    },
    xaxis: {
      categories: [CHART_LEAVE, CHART_BOT_START],
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    title: {
      text: CHART_TITLE_LEAVE,
      align: CHART_ALIGN_CENTER,
      floating: true,
    },
    subtitle: {
      text: `${CHART_LEAVE_PREFIX}${formatRateNumber(numOfCloseBot, numOfBotStart)}${PERCENT_SUFFIX}`,
      align: CHART_ALIGN_CENTER,
    },
    tooltip: {
      theme: CHART_THEME_DARK,
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: () => EMPTY_CELL,
        },
      },
    },
  },
});

export const buildDevicePieChart = ({ emptyDevice, series, palette }) => ({
  series: emptyDevice === true ? EMPTY_PIE_SERIES : series,
  options: {
    chart: {
      width: CHART_PIE_WIDTH,
      type: CHART_TYPE_PIE,
    },
    labels: [LABEL_PC, LABEL_SMARTPHONE, LABEL_TABLET],
    colors: palette,
    responsive: [
      {
        breakpoint: CHART_MOBILE_BREAKPOINT,
        options: {
          chart: {
            width: CHART_PIE_MOBILE_WIDTH,
          },
          legend: {
            position: CHART_LEGEND_BOTTOM,
          },
        },
      },
    ],
  },
});
