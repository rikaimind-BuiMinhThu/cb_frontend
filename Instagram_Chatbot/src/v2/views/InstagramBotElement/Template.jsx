import React from 'react';
import { AdminPage } from 'v2/components/AdminShell';
import { EMPTY_TEMPLATE_MESSAGE } from './constants';

const Template = () => (
  <AdminPage>
    <p>{EMPTY_TEMPLATE_MESSAGE}</p>
  </AdminPage>
);

export default Template;
