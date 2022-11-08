import DatePicker from 'react-datepicker';
import React from 'react';
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import './../../../../assets/css/bot/report.css';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Report() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dateState, setDateState] = useState(new Date());
  const changeDate = (e) => {
    setDateState(e);
  };

  function selectStartDate(date) {
    setStartDate(date);
  }
  function selectEndDate(date) {
    setEndDate(date);
  }

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div className="report">
                  <div className="report__info">
                    <p className="report__group">Aggregation period:</p>
                    <div className="report__group">
                      <select name="" id="">
                        <option value="">Aggregation period</option>
                        <option value="">The day before</option>
                        <option value="">Last 7 days</option>
                        <option value="">last 30 days</option>
                      </select>
                    </div>
                    <div className="report__group report-date">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => selectStartDate(date)}
                        dateFormat="yyyy/MM/dd"
                      />
                    </div>
                    <div className="report__group report-date">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => selectEndDate(date)}
                        dateFormat="yyyy/MM/dd"
                      />
                    </div>
                    <p className="report__group">device</p>
                    <div className="report__group">
                      <select name="" id="">
                        <option value="">All</option>
                        <option value="">computer</option>
                        <option value="">Tablet</option>
                        <option value="">Smart phone</option>
                      </select>
                    </div>
                    <p className="report__group">scenario</p>
                    <div className="report__group">
                      <select name="" id="">
                        <option value="">BOB scenario</option>
                        <option value="">Test1</option>
                        <option value="">Test2</option>
                      </select>
                    </div>
                    <div className="report__group">
                      <button className="btn btn-primary">
                        <i class="fa fa-search" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                  <div className="report__download">
                    <button className="btn btn-primary">Input contents download</button>
                    <button className="btn btn-primary">download</button>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="report__body">
                  <div className="report__item">
                    <div className="report__item-head">
                      CONVERSION RATE (CVR) / CLICK-THROUGH RATE (CTR){'  '}
                      <a href="">
                        {' '}
                        <i class="far fa-question-circle"></i>
                      </a>
                    </div>
                    <div className="report__item-btn">
                      <button className="btn btn-success">Conversion rate (CVR)</button>
                      <button className="btn btn-success">Click-through rate (CTR)</button>
                    </div>
                    <div className="report__item-chart"></div>
                  </div>

                  <div className="report__item report__item-2">
                    <div className="report__item-head report__item-2-head">
                      NUMBER OF CONVERSIONS / NUMBER OF BOT STARTS {'  '}
                      <a href="">
                        {' '}
                        <i class="far fa-question-circle"></i>
                      </a>
                    </div>
                    <div className="report__item-head report__item-2-head">
                      CHANGE IN MONTHLY CONVERSIONS {'  '}
                      <a href="">
                        {' '}
                        <i class="far fa-question-circle"></i>
                      </a>
                      <Calendar
                        className="report__item-2-head-calender"
                        value={dateState}
                        onChange={changeDate}
                      />
                    </div>
                  </div>

                  <div className="report__item">
                    <div className="report__item-head">
                      CONTENT {'  '}
                      <a href="">
                        {' '}
                        <i class="far fa-question-circle"></i>
                      </a>
                      <div className="report__item-btn">
                        <button className="btn btn-success">start page</button>
                        <button className="btn btn-success">CV page</button>
                      </div>
                      <div className="report__item-content">
                        <Table>
                          <thead className="text-primary">
                            <tr>
                              <th style={{ width: '4%' }}>page</th>
                              <th style={{ width: '4%' }}> starting number</th>
                              <th style={{ width: '4%' }}>Number of CVs</th>
                              <th style={{ width: '4%' }}>Urls</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>sdsssd</tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  <div className="report__item report__item-2">
                    <div className="report__item-head report__item-2-head">
                      AREA {'  '}
                      <a href="">
                        {' '}
                        <i class="far fa-question-circle"></i>
                      </a>
                      <div className="report__item-btn">
                        <button className="btn btn-success">number of bot starts</button>
                        <button className="btn btn-success">Conversions (CV)</button>
                      </div>
                    </div>
                    <div className="report__item-head report__item-2-head">
                      DEVICE {'  '}
                      <a href="">
                        {' '}
                        <i class="far fa-question-circle"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Report;
