import React from 'react';
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import './../../assets/css/sub-user-mng.css';
import { Link } from 'react-router-dom';

function SubUserManagement() {
  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div className='sub-user__title'>Sub User Management</div>
                <div className='sub-user__heading'>
                  <p>View users who have been added as bot admins for your plan.
                    <br />
                    If you want to add a user without a BOTCHAN account as an administrator, invite the user from the invite button on the right and then add the bot administrator.
                  </p>
                  <div className='sub-user__heading-btn'>
                    <Link to={'/admin/add-sub-user'}>
                      <button className='btn btn-primary'>User invitation</button>

                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <Table>
                  <thead className="text-primary">
                    <tr>
                      <th style={{ width: '10%' }}>No</th>
                      <th style={{ width: '20%' }}>Full name</th>
                      <th style={{ width: '20%' }}>email address</th>
                      <th style={{ width: '15%' }}>authority</th>
                      <th style={{ width: '15%' }}>status</th>
                      <th style={{ width: '10%' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="sub-user__border-table">1</td>
                      <td className="sub-user__border-table">NGUYEN THI THU HIEN	</td>
                      <td className="sub-user__border-table">thuhien.nguyen@rikai.technology	</td>
                      <td className="sub-user__border-table">owner</td>
                      <td className="sub-user__border-table">approved</td>
                      <td className="sub-user__border-table">
                        <div className="sub-user__action-wrapper">
                          <div className='sub-user__btn'>
                            <Link to={'/admin/edit-sub-user'}>
                              <button className="sub-user__btn-edit">Edit</button>
                            </Link>
                          </div>
                          <div className='sub-user__btn'>
                            <button className="sub-user__btn-delete">Delete</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default SubUserManagement