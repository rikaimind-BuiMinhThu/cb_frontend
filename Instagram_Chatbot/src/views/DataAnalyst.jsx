import React, { useState } from 'react'
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
// import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from "react-chartjs-2";
import CanvasJSReact from '../components/canvasjs-3.6.6/canvasjs.react';
import { VictoryPie } from "victory-pie";
// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;
// ChartJS.register(...registerables)

function DataAnalyst() {

  const data = {
    labels: ["6", "7", "8", "9", "10", "11", "12", "1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "First dataset",
        data: [33, 53, 85, 41, 44, 65],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
      {
        label: "Second dataset",
        data: [33, 25, 35, 51, 54, 76],
        fill: false,
        borderColor: "#742774"
      }
    ],
    options: {
      plugins: {
        datalabels: {
          display: false,
        },
      }

    }
  };
  const datas = [{ x: "Cats", y: 75 }, { x: "Dogs", y: 25 }];

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "70%" }}>
                    <Line
                      data={data}
                      style={{ maxHeight: "315px", backgroundColor: "#ffffff" }}></Line>
                  </div>
                  <div style={{ width: "30%" }}>
                    {/* <CanvasJSChart options = {options} /> */}
                    {/* <ReactApexChart options={option} series={series} type="pie" width={380} />  */}
                    <VictoryPie style={{width:"20%"}}
                      data={datas}
                      startAngle={130}
                      endAngle={500}
                      colorScale={["#a6d8fe", "#4de396"]}
                      height={280}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div>Body</div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default DataAnalyst