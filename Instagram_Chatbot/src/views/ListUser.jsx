import React, { useState } from 'react'
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
// import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from "react-chartjs-2";
import CanvasJSReact from '../components/canvasjs-3.6.6/canvasjs.react';
import { VictoryPie } from "victory-pie";
// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;
// ChartJS.register(...registerables)
function listUser() {
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
                        <div style={{ display: "flex", width: "100%" }}>
                            <Card style={{ width: "50%" }}>
                                <CardBody>
                                    <div style={{ display: "flex" }}>
                                        <div style={{ width: "100%" }}>
                                            <Line
                                                data={data}
                                                style={{ maxHeight: "315px", backgroundColor: "#ffffff" }}></Line>
                                        </div>

                                    </div>
                                </CardBody>
                            </Card>
                            <Card style={{ width: "24%", marginLeft: "1%" }}>
                                <div style={{ width: "100%" }}>
                                    {/* <CanvasJSChart options = {options} /> */}
                                    {/* <ReactApexChart options={option} series={series} type="pie" width={380} />  */}
                                    <div style={{ paddingTop: "10%" }}>
                                        <VictoryPie
                                            data={datas}
                                            startAngle={130}
                                            endAngle={500}
                                            colorScale={["#a6d8fe", "#4de396"]}
                                            height={250}
                                        />
                                    </div>
                                </div>
                            </Card>
                            <Card style={{ width: "24%", marginLeft: "1%" }}>
                                <div style={{ width: "100%" }}>
                                    {/* <CanvasJSChart options = {options} /> */}
                                    {/* <ReactApexChart options={option} series={series} type="pie" width={380} />  */}
                                    <div style={{ paddingTop: "10%" }}>
                                        <VictoryPie
                                            data={datas}
                                            startAngle={130}
                                            endAngle={500}
                                            colorScale={["#a6d8fe", "#4de396"]}
                                            height={250}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <Card>
                            <CardBody>
                                <div style={{width:"100%", display:"flex", textAlign:"center"}}>
                                    <div style={{width:"50%"}}>dd</div>
                                    <div style={{width:"50%"}}>dd</div>

                                </div>
                            </CardBody>
                        </Card>
                            <div style={{ display: "flex", width: "100%" }}>
                                <Card style={{ width: "24.5%" }}>
                                    <div style={{ width: "100%" }}>
                                        {/* <CanvasJSChart options = {options} /> */}
                                        {/* <ReactApexChart opti    ons={option} series={series} type="pie" width={380} />  */}
                                        <div style={{ paddingTop: "10%" }}>
                                            <VictoryPie
                                                data={datas}
                                                startAngle={130}
                                                endAngle={500}
                                                colorScale={["#a6d8fe", "#4de396"]}
                                                height={250}
                                            />
                                        </div>
                                    </div>
                                </Card>
                                <Card style={{ width: "24.5%", marginLeft: "1%" }}>
                                    <div style={{ width: "100%" }}>
                                        {/* <CanvasJSChart options = {options} /> */}
                                        {/* <ReactApexChart options={option} series={series} type="pie" width={380} />  */}
                                        <div style={{ paddingTop: "10%" }}>
                                            <VictoryPie
                                                data={datas}
                                                startAngle={130}
                                                endAngle={500}
                                                colorScale={["#a6d8fe", "#4de396"]}
                                                height={250}
                                            />
                                        </div>
                                    </div>
                                </Card>
                                <Card style={{ width: "24%", marginLeft: "1%" }}>
                                    <div style={{ width: "100%" }}>
                                        {/* <CanvasJSChart options = {options} /> */}
                                        {/* <ReactApexChart options={option} series={series} type="pie" width={380} />  */}
                                        <div style={{ paddingTop: "10%" }}>
                                            <VictoryPie
                                                data={datas}
                                                startAngle={130}
                                                endAngle={500}
                                                colorScale={["#a6d8fe", "#4de396"]}
                                                height={250}
                                            />
                                        </div>
                                    </div>
                                </Card>
                                <Card style={{ width: "24%", marginLeft: "1%" }}>
                                    <div style={{ width: "100%" }}>
                                        {/* <CanvasJSChart options = {options} /> */}
                                        {/* <ReactApexChart options={option} series={series} type="pie" width={380} />  */}
                                        <div style={{ paddingTop: "10%" }}>
                                            <VictoryPie
                                                data={datas}
                                                startAngle={130}
                                                endAngle={500}
                                                colorScale={["#a6d8fe", "#4de396"]}
                                                height={250}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                    
                    </Col>
                </Row>
            </div>

        </>
    )
}

export default listUser