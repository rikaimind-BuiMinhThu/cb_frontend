import React, { useMemo } from 'react';
import { Spin } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { buildEcUserTrendChartConfig, buildInflowPieChartConfig } from '../utils/chartConfig';

function ChartsSection({
  conversionLoading,
  conversionError,
  pieSeries,
  trendLoading,
  trendError,
  chartCategories,
  userSeries,
}) {
  const loading = conversionLoading || trendLoading;
  const error = conversionError || trendError;

  const pieChart = useMemo(() => buildInflowPieChartConfig(pieSeries), [pieSeries]);

  const lineChart = useMemo(
    () =>
      buildEcUserTrendChartConfig({
        categories: chartCategories,
        userSeries,
      }),
    [chartCategories, userSeries]
  );

  return (
    <div className="admin-page-card attracted-customer-section">
      <div className="attracted-customer-section-header">
        <h2>流入・利用状況</h2>
      </div>
      <div className="attracted-customer-section-body">
        <Spin spinning={loading}>
          {error && <div className="attracted-customer-date-error">{error}</div>}
          <div className="attracted-customer-charts-grid">
            <div className="attracted-customer-chart-block">
              <h3 className="attracted-customer-chart-title">流入元</h3>
              <div className="attracted-customer-pie-wrap">
                <ReactApexChart
                  options={pieChart.options}
                  series={pieChart.series}
                  type="pie"
                  width={320}
                />
              </div>
            </div>
            <div className="attracted-customer-chart-block attracted-customer-chart-block--wide">
              <h3 className="attracted-customer-chart-title">EC Chatbotユーザー</h3>
              <div className="attracted-customer-chart-wrap">
                <ReactApexChart
                  options={lineChart.options}
                  series={lineChart.series}
                  type="line"
                  height={350}
                />
              </div>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default ChartsSection;
