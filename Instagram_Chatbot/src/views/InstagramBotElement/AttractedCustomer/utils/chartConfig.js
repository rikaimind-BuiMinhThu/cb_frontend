import { adminChartPalette } from '../../../../theme/adminTheme';

export function buildInflowPieChartConfig(series) {
  return {
    series,
    options: {
      chart: {
        type: 'pie',
        fontFamily: 'Inter, Noto Sans JP, sans-serif',
      },
      labels: ['DM', 'ストーリー', 'ライブ'],
      colors: [adminChartPalette[0], adminChartPalette[1], adminChartPalette[4]],
      legend: {
        position: 'bottom',
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

export function buildEcUserTrendChartConfig({ categories, userSeries }) {
  return {
    series: [
      {
        name: 'Ec chatbotユーザー',
        type: 'area',
        data: userSeries,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        toolbar: { show: false },
        fontFamily: 'Inter, Noto Sans JP, sans-serif',
      },
      colors: [adminChartPalette[0]],
      stroke: { curve: 'smooth' },
      fill: {
        type: 'solid',
        opacity: 0.2,
      },
      xaxis: { categories },
      markers: { size: 0 },
      yaxis: [
        {
          title: { text: '' },
        },
      ],
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
