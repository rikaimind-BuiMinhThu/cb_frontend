import React, { useMemo } from 'react';
import { Spin } from 'antd';
import ReactApexChart from 'react-apexcharts';
import {
  buildEcUserPieChartConfig,
  buildRepeaterPieChartConfig,
  buildUsageTrendChartConfig,
} from '../utils/chartConfig';

function AnalyticsOverviewSection({
  loading,
  error,
  chartCategories,
  userSeries,
  messageSeries,
  repeaterPercent,
  newUserPercent,
  ecUserPercent,
  ecNewUserPercent,
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

  const repeaterPieChart = useMemo(
    () => buildRepeaterPieChartConfig(repeaterPercent, newUserPercent),
    [repeaterPercent, newUserPercent]
  );

  const ecPieChart = useMemo(
    () => buildEcUserPieChartConfig(ecUserPercent, ecNewUserPercent),
    [ecUserPercent, ecNewUserPercent]
  );

  const gridClass = isAdminDeel
    ? 'list-user-overview-grid with-ec-pie'
    : 'list-user-overview-grid';

  return (
    <div className="admin-page-card list-user-section">
      <div className="list-user-section-header">
        <h2>概要</h2>
      </div>
      <div className="list-user-section-body">
        <Spin spinning={loading}>
          {error && <div className="list-user-date-error">{error}</div>}
          <div className={gridClass}>
            <div className="list-user-chart-wrap">
              <ReactApexChart
                options={trendChart.options}
                series={trendChart.series}
                type="line"
                height={350}
              />
            </div>
            <div className="list-user-pie-wrap">
              <ReactApexChart
                options={repeaterPieChart.options}
                series={repeaterPieChart.series}
                type="pie"
                width={320}
              />
            </div>
            {isAdminDeel && (
              <div className="list-user-pie-wrap">
                <ReactApexChart
                  options={ecPieChart.options}
                  series={ecPieChart.series}
                  type="pie"
                  width={320}
                />
              </div>
            )}
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default AnalyticsOverviewSection;
