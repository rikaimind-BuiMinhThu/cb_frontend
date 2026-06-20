import { adminChartPalette } from '../../../../theme/adminTheme';

export function buildUsageTrendChartConfig({ categories, userSeries, messageSeries, isAdminDeel }) {
  const userLabel = isAdminDeel ? 'Ec chatbotユーザー' : '新規ユーザー';

  return {
    series: [
      {
        name: userLabel,
        type: 'area',
        data: userSeries,
      },
      {
        name: '送信したメッセージ数',
        type: 'line',
        data: messageSeries,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        toolbar: { show: false },
        fontFamily: 'Inter, Noto Sans JP, sans-serif',
      },
      colors: [adminChartPalette[0], adminChartPalette[1]],
      stroke: { curve: 'smooth', width: [0, 2] },
      fill: {
        type: ['solid', 'solid'],
        opacity: [0.2, 1],
      },
      xaxis: { categories },
      markers: { size: 0 },
      yaxis: [
        { title: { text: userLabel } },
        { opposite: true, title: { text: '送信したメッセージ数' } },
      ],
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (value) => (typeof value !== 'undefined' ? `${value}` : value),
        },
      },
    },
  };
}

export function buildRepeaterPieChartConfig(repeaterPercent, newUserPercent) {
  return {
    series: [repeaterPercent, newUserPercent],
    options: {
      chart: {
        type: 'pie',
        fontFamily: 'Inter, Noto Sans JP, sans-serif',
      },
      labels: ['リピーター', '新規ユーザー'],
      colors: [adminChartPalette[4], adminChartPalette[0]],
      legend: {
        position: 'bottom',
      },
      dataLabels: {
        formatter: (value) => `${Math.round(value)}%`,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 280 },
            legend: { position: 'bottom' },
          },
        },
      ],
    },
  };
}
