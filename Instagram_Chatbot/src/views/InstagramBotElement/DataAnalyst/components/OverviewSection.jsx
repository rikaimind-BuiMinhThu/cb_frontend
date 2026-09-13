import React, { useMemo } from 'react';
import { Spin } from 'antd';
import ReactApexChart from 'react-apexcharts';
import {
  buildRepeaterPieChartConfig,
  buildUsageTrendChartConfig,
} from '../utils/chartConfig';

function OverviewSection({
  loading,
  error,
  chartCategories,
  userSeries,
  messageSeries,
  repeaterPercent,
  newUserPercent,
  isAdminDeel,
}) {
  const trendChart = useMemo(
    () =>
      buildUsageTrendChartConfig({
        categories: chartCategories,
        userSeries,
        messageSeries,
        isAdminDeel,
      }),
    [chartCategories, userSeries, messageSeries, isAdminDeel]
  );

  const pieChart = useMemo(
    () => buildRepeaterPieChartConfig(repeaterPercent, newUserPercent),
    [repeaterPercent, newUserPercent]
  );

  return (
    <div className="admin-page-card data-analyst-section">
      <div className="data-analyst-section-header">
        <h2>概要</h2>
      </div>
      <div className="data-analyst-section-body">
        <Spin spinning={loading}>
          {error && <div className="data-analyst-date-error">{error}</div>}
          <div className="data-analyst-overview-grid">
            <div className="data-analyst-chart-wrap">
              <ReactApexChart
                options={trendChart.options}
                series={trendChart.series}
                type="line"
                height={350}
              />
            </div>
            <div className="data-analyst-pie-wrap">
              <ReactApexChart
                options={pieChart.options}
                series={pieChart.series}
                type="pie"
                width={320}
              />
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default OverviewSection;
