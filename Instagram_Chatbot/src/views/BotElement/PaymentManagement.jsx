import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import '../../assets/css/bot/payment-mng.css';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
function PaymentManagement() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openHisOrder, setOpenHisOrder] = useState(true);
  const [openTax, setOpenTax] = useState(true);
  const [noCan, setNoCan] = useState(true);
  const [noPaid, setNoPaid] = useState(true);
  const [noShip, setNoShip] = useState(true);

  useEffect(() => {
    var date = new Date();
    if (date.getDate() != 1) {
      setEndDate(new Date(date.setDate(date.getDate() - 1)));
    }
    setStartDate(new Date(date.setDate(1)));
  }, []);

  function orderHisSelected() {
    setOpenHisOrder(true);
    document.getElementById('payment_management_order_his').style.color = '#43b8af';
    document.getElementById('payment_management_setting').style.color = 'black';
  }

  function settingSelected() {
    setOpenHisOrder(false);
    document.getElementById('payment_management_order_his').style.color = 'black';
    document.getElementById('payment_management_setting').style.color = '#43b8af';
  }

  function selectDateStart(date) {
    setStartDate(date);
    var validate = document.getElementById(`payment_management_date_err`);
    var endMonth =
      startDate.getMonth() + 1 < 10 ? `0${endDate.getMonth() + 1}` : `${endDate.getMonth() + 1}`;
    var endDatee = startDate.getDate() < 10 ? `0${endDate.getDate()}` : `${endDate.getDate()}`;
    var dateMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    var dateDate = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    if (
      parseInt(`${date.getFullYear()}${dateMonth}${dateDate}`) >
      parseInt(`${endDate.getFullYear()}${endMonth}${endDatee}`)
    ) {
      validate.style.display = 'block';
      validate.innerHTML = 'Start date cannot be after end date.';
    } else {
      validate.style.display = 'none';
      validate.innerHTML = '';
    }
    console.log(parseInt(`${date.getFullYear()}${dateMonth}${dateDate}`));
    console.log(parseInt(`${endDate.getFullYear()}${endMonth}${endDatee}`));
  }

  function selectDateEnd(date) {
    setEndDate(date);
    var validate = document.getElementById(`payment_management_date_err`);
    var startMonth =
      startDate.getMonth() + 1 ? `0${startDate.getMonth() + 1}` : `${startDate.getMonth() + 1}`;
    var startDatee = startDate.getDate() ? `0${startDate.getDate()}` : `${startDate.getDate()}`;
    var dateMonth = date.getMonth() + 1 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    var dateDate = date.getDate() ? `0${date.getDate()}` : `${date.getDate()}`;
    if (
      parseInt(`${startDate.getFullYear()}${startMonth}${startDatee}`) >
      parseInt(`${date.getFullYear()}${dateMonth}${dateDate}`)
    ) {
      validate.style.display = 'block';
      validate.innerHTML = 'End date cannot be before start date.';
    } else {
      validate.style.display = 'none';
      validate.innerHTML = '';
    }
  }

  return (
    // <div>
    <div className="content">
      <Row id="screenAll">
        <Col md="12">
          <Card>
            <CardHeader>Payment management</CardHeader>
            <CardBody>
              <div className="payment-management-option">
                <div
                  id="payment_management_order_his"
                  style={{ color: '#43b8af' }}
                  className="payment-management-option-item"
                  onClick={() => orderHisSelected()}
                >
                  ORDER HISTORY
                </div>
                <div
                  id="payment_management_setting"
                  className="payment-management-option-item"
                  onClick={() => settingSelected()}
                >
                  SETTING
                </div>
              </div>
              {openHisOrder ? (
                <>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <h4
                        style={{
                          margin: '0',
                          fontWeight: '400',
                          fontSize: '1.2em',
                        }}
                      >
                        コンバージョン数
                      </h4>
                      <div style={{ borderRadius: '5px', padding: '5px' }}>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => selectDateStart(date)}
                          dateFormat="yyyy-MM-dd"
                          value={startDate}
                          // value={
                          //   startDatePreview
                          //     ? startDatePreview.toISOString().slice(0, 10).replaceAll('-', '/')
                          //     : 'yyyy/mm/dd'
                          // }
                        />
                      </div>
                      <h4
                        style={{
                          margin: '0',
                          fontWeight: '400',
                          fontSize: '1.2em',
                        }}
                      >
                        から
                      </h4>
                      <div style={{ borderRadius: '5px', padding: '5px' }}>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => selectDateEnd(date)}
                          dateFormat="yyyy-MM-dd"
                          value={endDate}
                          // value={
                          //   endDatePreview
                          //     ? endDatePreview.toISOString().slice(0, 10).replaceAll('-', '/')
                          //     : 'yyyy/mm/dd'
                          // }
                        />
                      </div>
                      まで &emsp;<button className="payment-management-btn-search">Search</button>
                    </div>
                    <span
                      id="payment_management_date_err"
                      style={{ color: 'red', display: 'none' }}
                    ></span>
                  </div>
                  <br /> <br />
                  <Table style={{ textAlign: 'center', tableLayout: 'fixed', overflow: 'hidden' }}>
                    <thead className="text-primary">
                      <tr>
                        <th style={{ width: '7.5%' }}>No</th>
                        <th style={{ width: '7.5%' }}>User ID</th>
                        <th style={{ width: '9%' }}>Order number</th>
                        <th>Product name</th>
                        <th style={{ width: '7.5%' }}>Unit price</th>
                        <th style={{ width: '7.5%' }}>Quantity</th>
                        <th style={{ width: '7.5%' }}>Price</th>
                        <th>Consumption tax</th>
                        <th>Settlement fee (tax included)</th>
                        <th>Shipping fee (tax included)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                        <td style={{ border: '1px solid #7186a1' }}>123</td>
                      </tr>
                    </tbody>
                  </Table>
                </>
              ) : (
                <div>
                  <div className="payment_management_setting__item">
                    <h6>consumption tax</h6>
                    <div className="payment_management_setting__body">
                      <div className="payment_management_setting__check">
                        <form action="">
                          <input
                            type="radio"
                            name="tax"
                            checked={openTax}
                            onChange={() => setOpenTax(true)}
                          />
                          <label> tax included</label>
                          <input type="radio" name="tax" onChange={() => setOpenTax(false)} />
                          <label>outside tax</label>
                          <br />
                        </form>
                        {openTax ? (
                          <div className="payment_management_setting__check-in">
                            <p>
                              In the case of tax-inclusive, the product price subtotal will be used
                              as the order price.
                            </p>
                            <p>
                              In the case of tax-excluded, the order amount is calculated by adding
                              the tax rate to the product price subtotal.
                            </p>
                          </div>
                        ) : (
                          <div className="payment_management_setting__check-out">
                            <p>sales tax rate(%)</p>
                            <select>
                              <option value="8">8</option>
                              <option value="9">9</option>
                              <option value="10">10</option>
                            </select>
                            <br />
                            <p>Less than 1 yen</p>
                            <input type="radio" name="sale" />
                            <label> truncation</label>
                            <input type="radio" name="sale" />
                            <label>rounded up</label>
                            <br />
                            <p>
                              In the case of tax-inclusive, the product price subtotal will be used
                              as the order price.
                            </p>
                            <p>
                              In the case of tax-excluded, the order amount is calculated by adding
                              the tax rate to the product price subtotal.
                            </p>
                          </div>
                        )}
                        <button className="btn btn-primary">Keep</button>
                      </div>
                    </div>
                  </div>

                  <div className="payment_management_setting__item">
                    <h6>Specify payment gateway</h6>
                    <div className="payment_management_setting__body">
                      <div className="payment_management_setting__check">
                        <form action="">
                          <input
                            type="radio"
                            name="tax"
                            checked={noCan}
                            onChange={() => setNoCan(true)}
                          />
                          <label> None</label>
                          <input type="radio" name="tax" onChange={() => setNoCan(false)} />
                          <label>can be</label>
                          <br />
                        </form>
                        {noCan ? (
                          ''
                        ) : (
                          <div className="payment_management_setting__can">
                            <label>Payment method variable name</label>
                            <select>
                              <option value="current_url">current_url</option>
                              <option value="current_url">current_url dddddddddddddd</option>
                            </select>
                            <br />
                            <div>
                              <form action="">
                                <label>variable value</label>
                                <input type="text" />
                                <label>payment gateway</label>
                                <select>
                                  <option value="l">l</option>
                                  <option value="l">l dddddddddddddd</option>
                                </select>
                              </form>
                              <form action="">
                                <label>variable value</label>
                                <input type="text" />
                                <label>payment gateway</label>
                                <select>
                                  <option value="l">l</option>
                                  <option value="l">l dddddddddddddd</option>
                                </select>
                              </form>
                            </div>
                            <button className="btn btn-outline-primary">
                              <i class="fas fa-plus"></i>
                            </button>
                          </div>
                        )}
                        <button className="btn btn-primary">Keep</button>
                      </div>
                    </div>
                  </div>

                  <div className="payment_management_setting__item">
                    <h6>Shipping fee (tax included)</h6>
                    <div className="payment_management_setting__body">
                      <div className="payment_management_setting__check">
                        <form action="">
                          <input
                            type="radio"
                            name="tax"
                            checked={noPaid}
                            onChange={() => setNoPaid(true)}
                          />
                          <label> free</label>
                          <input type="radio" name="tax" onChange={() => setNoPaid(false)} />
                          <label>Paid</label>
                          <br />
                        </form>
                        {noPaid ? (
                          ''
                        ) : (
                          <div className="payment_management_setting__can">
                            <label>Payment method variable name</label>
                            <select>
                              <option value="current_url">current_url</option>
                              <option value="current_url">current_url dddddddddddddd</option>
                            </select>
                            <br />
                            <div>
                              <form action="">
                                <label>
                                  variable value <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input type="text" />
                                <label>payment gateway</label>
                                <input type="number" placeholder="0" />
                                <input type="text" placeholder="Yen (tax included)" />
                              </form>
                            </div>
                            <button className="btn btn-outline-primary">
                              <i class="fas fa-plus"></i>
                            </button>
                          </div>
                        )}
                        <button className="btn btn-primary">Keep</button>
                      </div>
                    </div>
                  </div>

                  <div className="payment_management_setting__item">
                    <h6>Shipping fee (tax included)</h6>
                    <div className="payment_management_setting__body">
                      <div className="payment_management_setting__check">
                        <form action="">
                          <input
                            type="radio"
                            name="tax"
                            checked={noShip}
                            onChange={() => setNoShip(true)}
                          />
                          <label> free</label>
                          <input type="radio" name="tax" onChange={() => setNoShip(false)} />
                          <label>Paid</label>
                          <br />
                        </form>
                        {noShip ? (
                          ''
                        ) : (
                          <div className="payment_management_setting__can">
                            <label>Address variable name</label>
                            <select>
                              <option value="url">url</option>
                              <option value="url">url dddddddddddddd</option>
                            </select>
                            <br />
                            <div>
                              <Table style={{ border: 'none' }}>
                                <thead>
                                  <tr style={{ border: 'none' }}>
                                    <th style={{ border: 'none' }}>Amount of money</th>
                                    <th style={{ border: 'none' }}>Amount of money</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr style={{ border: 'none' }}>
                                    <td>Hokkaido</td>
                                    <td>
                                      <input type="number" />
                                    </td>
                                    <td>Yen (tax included)</td>
                                  </tr>
                                  <tr style={{ border: 'none' }}>
                                    <td>Hokkaido</td>
                                    <td>
                                      <input type="number" />
                                    </td>
                                    <td>Yen (tax included)</td>
                                  </tr>
                                  <tr style={{ border: 'none' }}>
                                    <td>Hokkaido</td>
                                    <td>
                                      <input type="number" />
                                    </td>
                                    <td>Yen (tax included)</td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        )}
                        <button className="btn btn-primary">Keep</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>

    // </div>
  );
}

export default PaymentManagement;
