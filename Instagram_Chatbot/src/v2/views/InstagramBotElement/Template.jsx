import React from 'react'
import { Row, Col } from "reactstrap";
// import workingtable from "../views/Popup/workingtable.jpg"
// import registration from "../views/Popup/registration.jpeg"
// import chatbot from "../views/Popup/chatbot.png"

function Template() {
    return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                        {/* <Card>
                            <CardBody style={{ width: "70%", margin: "auto", display: "flex" }}>
                                <div style={{ width: "40%" }}>
                                    <img src={workingtable} style={{ width: "100%" }}></img>
                                </div>
                                <div style={{ width: "60%", paddingLeft:"20px" }}>
                                    <div style={{ marginTop: "10px" }}>
                                        <h3>Title</h3>
                                        <h4 style={{ marginTop: "-20px" }}>Description</h4>
                                        <div style={{marginTop: "-20px"}}>
                                        {tag.map((item) => (
                                            <span>{item} &nbsp;&nbsp;</span>
                                        ))}
                                        </div>
                                        <Button>Select</Button>
                                    </div>

                                </div>
                            </CardBody>
                            <CardBody style={{ width: "70%", margin: "auto", display: "flex" }}>
                                <div style={{ width: "40%" }}>
                                    <img src={registration} style={{ width: "100%" }}></img>
                                </div>
                                <div style={{ width: "60%", paddingLeft:"20px" }}>
                                    <div style={{ marginTop: "10px" }}>
                                        <h3>Title</h3>
                                        <h4 style={{ marginTop: "-20px" }}>Description</h4>
                                        <div style={{marginTop: "-20px"}}>
                                        {tag.map((item) => (
                                            <span>{item} &nbsp;&nbsp;</span>
                                        ))}
                                        </div>
                                        <Button>Select</Button>
                                    </div>

                                </div>
                            </CardBody>
                            <CardBody style={{ width: "70%", margin: "auto", display: "flex" }}>
                                <div style={{ width: "40%" }}>
                                    <img src={chatbot} style={{ width: "100%" }}></img>
                                </div>
                                <div style={{ width: "60%", paddingLeft:"20px" }}>
                                    <div style={{ marginTop: "10px" }}>
                                        <h3>Title</h3>
                                        <h4 style={{ marginTop: "-20px" }}>Description</h4>
                                        <div style={{marginTop: "-20px"}}>
                                        {tag.map((item) => (
                                            <span>{item} &nbsp;&nbsp;</span>
                                        ))}
                                        </div>
                                        <Button>Select</Button>
                                    </div>

                                </div>
                            </CardBody>
                        </Card> */}


                    </Col>
                </Row>
            </div>

        </>
    )
}

export default Template