import '../../../../assets/css/bot/scenario/scenario-single.css';
import { useEffect } from 'react';
import { Col, Row, Card, CardBody, CardHeader, Button } from 'reactstrap';

const Scenario = () => {
  // states

  // side effects
  useEffect(() => {
    document.title = 'Edit Scenario';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="content">
      <div className="ss-actions">
        <Button>Save scenario</Button>
        <Button>Save and preview</Button>
      </div>
      <Row>
        <Col md="6">
          <Card>
            <CardBody></CardBody>
          </Card>
        </Col>
        <Col md="6">
          <Card>
            <CardBody></CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Scenario;
