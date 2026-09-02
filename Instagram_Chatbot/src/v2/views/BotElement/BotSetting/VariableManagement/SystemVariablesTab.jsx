import React from 'react';
import { AdminTable } from '../../../../components/AdminShell';
import { SYSTEM_VARIABLES } from './constants';
import { SYSTEM_COLUMNS } from './columns';

const SystemVariablesTab = () => (
  <AdminTable
    columns={SYSTEM_COLUMNS}
    dataSource={SYSTEM_VARIABLES}
    rowKey="name"
    pagination={false}
    emptyDescription="システム変数がありません"
  />
);

export default SystemVariablesTab;
