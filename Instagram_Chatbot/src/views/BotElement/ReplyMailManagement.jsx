import React from 'react';
import '../../assets/css/bot/reply-mail.css';
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import { Pagination } from '@material-ui/lab';
import { useState } from 'react';

function ReplyMailManagement() {
  // states
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [pageIndex, setPageIndex] = useState(1);
  const [replyMails, setReplyMails] = useState([0]);

  // reload function
  const reload = (value) => {};

  // handle change page
  const handlePageChange = (event, value) => {
    setPage(parseInt(value));
    setPageIndex(value);
    reload(value);
    document.querySelector('.main-panel').scrollTop = 0;
  };

  return (
    <div className="content">
      <Row id="screenAll">
        <Col md="12">
          <Card>
            <CardHeader></CardHeader>
            <CardBody>
              <div>
                <Table className="rm-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Email</th>
                      <th>Password</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {replyMails.map((mail) => (
                      <>
                        <tr key={mail}>
                          <td>1</td>
                          <td>
                            <input
                              className="rm-input-field"
                              type="text"
                              placeholder="Input email"
                            />
                          </td>
                          <td>
                            <input
                              className="rm-input-field"
                              type="text"
                              placeholder="Input password"
                            />
                          </td>
                          <td>
                            <button className="btn">Update</button>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
              </div>
              <Pagination
                count={totalPage}
                variant="outlined"
                page={page}
                onChange={handlePageChange}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ReplyMailManagement;
