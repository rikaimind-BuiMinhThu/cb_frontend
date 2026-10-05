import { adminChartPalette } from '../../../../theme/adminTheme';
import {
  buildRepeaterPieChartConfig,
  buildUsageTrendChartConfig,
} from '../../DataAnalyst/utils/chartConfig';

export { buildRepeaterPieChartConfig, buildUsageTrendChartConfig };

export function buildEcUserPieChartConfig(ecUserPercent, ecNewUserPercent) {
  return {
    series: [ecUserPercent, ecNewUserPercent],
    options: {
      chart: {
        type: 'pie',
        fontFamily: 'Inter, Noto Sans JP, sans-serif',
      },
      labels: ['ECユーザー', '新規ユーザー'],
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
