import React from 'react';
import { Empty, Table } from 'antd';

function AdminTable({
  toolbar,
  emptyDescription = 'データがありません',
  pagination = {},
  ...tableProps
}) {
  const defaultPagination =
    pagination === false
      ? false
      : {
          showSizeChanger: false,
          showTotal: (total) => `全 ${total} 件`,
          pageSize: pagination.pageSize || 10,
          ...pagination,
        };

  return (
    <>
      {toolbar && <div className="admin-table-toolbar">{toolbar}</div>}
      <div className="admin-table-body">
        <Table
          rowKey={tableProps.rowKey || 'id'}
          locale={{ emptyText: <Empty description={emptyDescription} /> }}
          pagination={defaultPagination}
          {...tableProps}
        />
      </div>
    </>
  );
}

export default AdminTable;
