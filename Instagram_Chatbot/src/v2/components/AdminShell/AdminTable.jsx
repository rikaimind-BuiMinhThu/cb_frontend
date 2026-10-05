import React from 'react';
import PropTypes from 'prop-types';
import { Empty, Table } from 'antd';
import {
  DEFAULT_PAGE_SIZE,
  TABLE_EMPTY_DESCRIPTION,
  TABLE_ROW_KEY,
  formatTableTotal,
} from './constants';

const AdminTable = ({
  toolbar,
  emptyDescription = TABLE_EMPTY_DESCRIPTION,
  pagination = {},
  ...tableProps
}) => {
  const defaultPagination =
    pagination === false
      ? false
      : {
          showSizeChanger: false,
          showTotal: formatTableTotal,
          pageSize: pagination.pageSize || DEFAULT_PAGE_SIZE,
          ...pagination,
        };

  return (
    <>
      {toolbar && <div className="admin-table-toolbar">{toolbar}</div>}
      <div className="admin-table-body">
        <Table
          rowKey={tableProps.rowKey || TABLE_ROW_KEY}
          locale={{ emptyText: <Empty description={emptyDescription} /> }}
          pagination={defaultPagination}
          {...tableProps}
        />
      </div>
    </>
  );
};

AdminTable.propTypes = {
  toolbar: PropTypes.node,
  emptyDescription: PropTypes.node,
  pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default AdminTable;
