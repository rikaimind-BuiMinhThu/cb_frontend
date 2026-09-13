import React from 'react';
import { AdminPage } from 'v2/components/AdminShell';
import { PAYMENT_HISTORY_PLACEHOLDER } from './constants';

const PaymentHistory = () => (
  <AdminPage>
    <div>{PAYMENT_HISTORY_PLACEHOLDER}</div>
  </AdminPage>
);

export default PaymentHistory;
