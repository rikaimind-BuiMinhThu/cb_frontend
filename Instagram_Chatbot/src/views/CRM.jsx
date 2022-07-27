import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap'
import ava from "./Popup/ava.png";
import ModalDetail from "./Popup/ModalDetail";
function CRM() {
  const [isOpenDetailUser ,setIsOpenDetailUser] = useState(false)

  function detailUser(){
    setIsOpenDetailUser(true)
  }
  return (
    <>
      <div className='content'>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                Instagram User
              </CardHeader>
              <CardBody>
                <Table style={{ textAlign: "center", tableLayout: "fixed", overflow: "hidden" }}>
                  <thead className="text-primary">
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>View Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>nghia.hoang</td>
                      <td>nghia.hoang@rikai.technology</td>
                      <td>012345678</td>
                      <td><Button style={{ backgroundColor: "#51cbcd" }} onClick={() => detailUser()}>Deail</Button></td>
                    </tr>
                    <tr>
                      <td>dung.bui</td>
                      <td>dung.bui@rikai.technology</td>
                      <td>012345678</td>
                      <td><Button style={{ backgroundColor: "#51cbcd" }} onClick={() => detailUser()}>Deail</Button></td>
                    </tr>
                    <tr>
                      <td>quan.le</td>
                      <td>quan.le@rikai.technology</td>
                      <td>012345678</td>
                      <td><Button style={{ backgroundColor: "#51cbcd" }} onClick={() => detailUser()}>Deail</Button></td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ModalDetail open={isOpenDetailUser} onClose={() => setIsOpenDetailUser(false)}>
            <div style={{ width: "400", height: "100%", textAlign: "center", padding: "0" }}>
              <div style={{ display: "flex", width: "100%", height: "100%" }}>
                <div style={{ width: "30% ", height: "100%", position:"absolute", borderRight: "1px solid #dddddd" }}>
                  <div style={{ width: "100% ", height: "30%" }}>
                    <img src={ava} style={{ objectFit: "cover", borderRadius: "50%", width: "150px", height: "150px" }}></img>
                  </div>
                  <div style={{ width: "100%", position:"relative" }}>
                    <div style={{ height: "3px", width: "75%", position:"absolute", margin: "35px 12.5% 0% 12.5%", backgroundColor: "gray" }}></div>
                    <div style={{  width: "100%", display:"grid", marginLeft:"-2%", position:"absolute", gridTemplateColumns:"auto auto auto auto", textAlign:"center" }}>
                    {/* <div style={{ display: "flex" }}> */}
                      <div style={{paddingLeft:"0%"}}><span>電話番号</span>
                      <div style={{ width: "35px", height: "35px", margin:"auto", backgroundColor: "gray", borderRadius: "50%", display: "table" }}><span style={{ verticalAlign: "middle",display: "table-cell"  }}>1</span></div>
                      </div>
                      <div style={{paddingLeft:"0%"}}><span>メール</span>
                      <div style={{ width: "35px", height: "35px", margin:"auto", backgroundColor: "gray", borderRadius: "50%", display: "table" }}><span style={{ verticalAlign: "middle",display: "table-cell"  }}>2</span></div>
                      </div>
                      <div style={{paddingLeft:"0%"}}><span>タグ</span>
                      <div style={{ width: "35px", height: "35px", margin:"auto", backgroundColor: "gray", borderRadius: "50%", display: "table" }}><span style={{ verticalAlign: "middle",display: "table-cell"  }}>3</span></div>
                      </div>
                      <div style={{paddingLeft:"0%"}}><span>顧客データ</span>
                      <div style={{ width: "35px", height: "35px", margin:"auto", backgroundColor: "gray", borderRadius: "50%", display: "table" }}><span style={{ verticalAlign: "middle",display: "table-cell"  }}>4</span></div>
                      </div>
                    </div>
                    {/* </div> */}
                    
                  </div>
                </div>
                <div style={{ width: "70%", height: "100%" }}>asdasdas</div>
              </div>
            </div>
          </ModalDetail>
      </div>
    </>
  )
}

export default CRM