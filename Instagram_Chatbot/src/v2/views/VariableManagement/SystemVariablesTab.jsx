import React from 'react';
import { AdminTable } from 'v2/components/AdminShell';
import { EMPTY_SYSTEM_VARIABLES, SYSTEM_VARIABLES } from './constants';
import { SYSTEM_COLUMNS } from './columns';

const SystemVariablesTab = () => (
  <AdminTable
    columns={SYSTEM_COLUMNS}
    dataSource={SYSTEM_VARIABLES}
    rowKey="name"
    pagination={false}
    emptyDescription={EMPTY_SYSTEM_VARIABLES}
  />
);

export default SystemVariablesTab;
