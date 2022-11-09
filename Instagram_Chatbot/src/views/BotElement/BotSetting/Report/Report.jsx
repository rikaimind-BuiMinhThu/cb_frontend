import DatePicker from 'react-datepicker';
import React from 'react';
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import './../../../../assets/css/bot/report.css';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

function Report() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dateState, setDateState] = useState(new Date());

  function validDateRange(start, end) {
    const errDate = document.getElementById('errDate');
    if (start > end) {
      errDate.style.display = 'block';
      errDate.innerHTML = 'Start date have to small than end date.';
    } else {
      errDate.style.display = 'none';
      errDate.innerHTML = '';
    }
  }

  function selectStartDate(date) {
    setStartDate(date);
    const start = parseInt(format(date, 'yyyy/MM/dd').replaceAll('/', ''));
    const end = parseInt(format(endDate, 'yyyy/MM/dd').replaceAll('/', ''));
    validDateRange(start, end);
  }

  function selectEndDate(date) {
    setEndDate(date);
    const start = parseInt(format(startDate, 'yyyy/MM/dd').replaceAll('/', ''));
    const end = parseInt(format(date, 'yyyy/MM/dd').replaceAll('/', ''));
    validDateRange(start, end);
  }

  function handleSearch(e) {
    e.preventDefault();
    const formSearch = document.getElementById('formSearch');
    console.log(formSearch.length);
    for (let i = 0; i < formSearch.length - 1; i++) {
      console.log(formSearch[i].value);
    }
  }

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div className="report">
                  <form id="formSearch" className="report__info">
                    <p className="report__group">Aggregation period:</p>
                    <div className="report__group">
                      <select name="" id="">
                        <option value="qqq">Aggregation period</option>
                        <option value="">The day before</option>
                        <option value="">Last 7 days</option>
                        <option value="">last 30 days</option>
                      </select>
                    </div>
                    <div className="report__group report-date">
                      <DatePicker
                        id="startDate"
                        selected={startDate}
                        onChange={(date) => selectStartDate(date)}
                        dateFormat="yyyy/MM/dd"
                      />
                    </div>
                    <div className="report__group report-date">
                      <DatePicker
                        id="endDate"
                        selected={endDate}
                        onChange={(date) => selectEndDate(date)}
                        dateFormat="yyyy/MM/dd"
                      />
                    </div>
                    <p className="report__group">device</p>
                    <div className="report__group">
                      <select name="" id="">
                        <option value="qqqwe">All</option>
                        <option value="">computer</option>
                        <option value="">Tablet</option>
                        <option value="">Smart phone</option>
                      </select>
                    </div>
                    <p className="report__group">scenario</p>
                    <div className="report__group">
                      <select name="" id="">
                        <option value="dddd">BOB scenario</option>
                        <option value="">Test1</option>
                        <option value="">Test2</option>
                      </select>
                    </div>
                    <div className="report__group">
                      <button className="btn btn-primary" onClick={(e) => handleSearch(e)}>
                        <i class="fa fa-search" aria-hidden="true"></i>
                      </button>
                    </div>
                    <span id="errDate" className="err-date"></span>
                  </form>
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
                      CONVERSION RATE (CVR) / CLICK-THROUGH RATE (CTR
                      <a href="">
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
                      NUMBER OF CONVERSIONS / NUMBER OF BOT STARTS
                      <a href="">
                        <i class="far fa-question-circle"></i>
                      </a>
                    </div>
                    <div className="report__item-head report__item-2-head">
                      CHANGE IN MONTHLY CONVERSIONS
                      <a href="">
                        <i class="far fa-question-circle"></i>
                      </a>
                      <Calendar
                        className="report__item-2-head-calender"
                        value={dateState}
                        onChange={(e) => {
                          setDateState(e);
                        }}
                      />
                    </div>
                  </div>

                  <div className="report__item">
                    <div className="report__item-head">
                      CONTENT
                      <a href="">
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
                      AREA
                      <a href="">
                        <i class="far fa-question-circle"></i>
                      </a>
                      <div className="report__item-btn">
                        <button className="btn btn-success">number of bot starts</button>
                        <button className="btn btn-success">Conversions (CV)</button>
                      </div>
                    </div>
                    <div className="report__item-head report__item-2-head">
                      DEVICE
                      <a href="">
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
