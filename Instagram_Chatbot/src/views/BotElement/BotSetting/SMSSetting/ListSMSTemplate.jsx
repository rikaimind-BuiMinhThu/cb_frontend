import React, { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import api from "api/api-management";
import { tokenExpired } from "api/tokenExpired";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import Cookies from "js-cookie";

const ListSMSTemplate = () => {
  const [listSMSTemplate, setListSMSTemplate] = useState([]);
  const getListSMSTemplate = async () => {
    const bot_id = Cookies.get("bot_id");
    try {
      const res = await api.get(
        `/api/v1/managements/sms_templates?chatbot_id=${bot_id}`
      );
      if (res.data.code === 1) {
        setListSMSTemplate(
          res.data.data.map((x, i) => ({ ...x, index: i + 1 }))
        );
      }
    } catch (err) {
      if (err?.response?.data.code === 0) {
        tokenExpired();
      }
    }
  };
  const columns = [
    {
      title: "NO.",
      dataIndex: "index",
    },
    { title: "テンプレート名", dataIndex: "template_name" },
    { title: "メール内容", dataIndex: "content" },
    { title: "chatbot_id", dataIndex: "chatbot_id" },
  ];
  useEffect(() => {
    getListSMSTemplate();
  }, []);
  return (
    <div className="ListSMSTemplate">
      <div className="content">
        <Col md="12" className="h-100">
          <Card className="h-100 px-5">
            <CardHeader>
              <h4 style={{ margin: "10px 0" }}>List SMS Template</h4>
            </CardHeader>
            <CardBody style={{ minHeight: '500px' }}>
              <Table
                columns={columns}
                dataSource={listSMSTemplate}
                rowKey="id"
              />
            </CardBody>
          </Card>
        </Col>
      </div>
    </div>
  );
};

export default ListSMSTemplate;
