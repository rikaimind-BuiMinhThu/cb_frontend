
import React from "react";
import NotificationAlert from "react-notification-alert";
import {
  UncontrolledAlert,
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

function Chatbot() {
  
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                {/* <CardTitle tag="h5">Notifications</CardTitle> */}
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="6">
                    <Card className="card-plain">
                      <CardBody>
                        <div>Create Chatbot</div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Chatbot;
