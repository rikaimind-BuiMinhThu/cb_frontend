import React from 'react';
import { AdminPage } from 'v2/components/AdminShell';
import { BOT_ADMIN_PLACEHOLDER } from './constants';

const BotAdmin = () => (
  <AdminPage>
    <div>{BOT_ADMIN_PLACEHOLDER}</div>
  </AdminPage>
);

export default BotAdmin;
