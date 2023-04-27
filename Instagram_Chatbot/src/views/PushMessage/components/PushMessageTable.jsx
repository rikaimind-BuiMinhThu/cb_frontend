import React from "react";
import { Space, Table, Tag } from "antd";

const PushMessageTable = ({ columns, dataSource }) => {
  const newData = dataSource.map((x, i) => ({ ...x, index: i + 1 }));

  const handleChangePaginate = () => {
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });
  };
  return (
    <Table
      columns={columns}
      dataSource={newData}
      onChange={handleChangePaginate}
      rowKey="id"
    />
  );
};

export default PushMessageTable;
