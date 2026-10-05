import React, { useEffect, useState } from 'react';
import { Button, Input, message } from 'antd';
import { AdminPage } from 'v2/components/AdminShell';
import {
  CARD_EXPIRY_LABEL,
  CARD_HOLDER_LABEL,
  CARD_HOLDER_PLACEHOLDER,
  CARD_NUMBER_LABEL,
  CARD_NUMBER_PLACEHOLDER,
  EMPTY_VALUE,
  EXPIRE_YEAR_PREFIX,
  GMO_SHOP_ID,
  GMO_SUCCESS_CODE,
  GMO_TOKEN_SCRIPT_SRC,
  MONTH_PAD_PREFIX,
  MONTH_PAD_THRESHOLD,
  MONTH_PLACEHOLDER,
  PURCHASE_BUTTON,
  PURCHASE_ERROR,
  SECURITY_CODE_LABEL,
  SECURITY_CODE_PLACEHOLDER,
  YEAR_PLACEHOLDER,
  YEAR_RANGE_COUNT,
} from './paymentConstants';
import 'v2/views/Payment/styles/payment-management.css';

const MONTH_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const Payment = () => {
  const [yearExpired, setYearExpired] = useState([]);
  const [cardNumber, setCardNumber] = useState(EMPTY_VALUE);
  const [cardHolder, setCardHolder] = useState(EMPTY_VALUE);
  const [expireYear, setExpireYear] = useState(EMPTY_VALUE);
  const [expireMonth, setExpireMonth] = useState(EMPTY_VALUE);
  const [securityCode, setSecurityCode] = useState(EMPTY_VALUE);
  const [purchaseError, setPurchaseError] = useState(EMPTY_VALUE);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: YEAR_RANGE_COUNT + 1 }, (_, index) => currentYear + index);
    setYearExpired(years);
    const script = document.createElement('script');
    script.src = GMO_TOKEN_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  const doPurchase = () => {
    if (!cardNumber || !expireYear || !expireMonth || !securityCode || !cardHolder) {
      setPurchaseError(PURCHASE_ERROR);
      return;
    }
    setPurchaseError(EMPTY_VALUE);
    const monthValue = parseInt(expireMonth, 10) < MONTH_PAD_THRESHOLD
      ? `${MONTH_PAD_PREFIX}${expireMonth}`
      : String(expireMonth);
    window.Multipayment.init(GMO_SHOP_ID);
    window.Multipayment.getToken({
      holdername: cardHolder,
      cardno: cardNumber,
      expire: `${EXPIRE_YEAR_PREFIX}${monthValue}`,
      securitycode: securityCode,
    }, (res) => {
      if (res.resultCode !== GMO_SUCCESS_CODE) {
        message.error(res.resultCode);
      }
    });
  };

  return (
    <AdminPage>
      <div className="admin-page-body payment-test-form">
        <label className="payment-test-label" htmlFor="cardNumber">{CARD_NUMBER_LABEL}</label>
        <Input
          id="cardNumber"
          className="payment-test-input"
          placeholder={CARD_NUMBER_PLACEHOLDER}
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <label className="payment-test-label" htmlFor="cardHolder">{CARD_HOLDER_LABEL}</label>
        <Input
          id="cardHolder"
          className="payment-test-input"
          placeholder={CARD_HOLDER_PLACEHOLDER}
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
        />
        <span className="payment-test-label">{CARD_EXPIRY_LABEL}</span>
        <div className="payment-test-expiry">
          <select
            name="yearEx"
            id="yearEx"
            className="admin-native-select"
            value={expireYear}
            onChange={(e) => setExpireYear(e.target.value)}
          >
            <option value={EMPTY_VALUE}>{YEAR_PLACEHOLDER}</option>
            {yearExpired.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select
            name="monthEx"
            id="monthEx"
            className="admin-native-select"
            value={expireMonth}
            onChange={(e) => setExpireMonth(e.target.value)}
          >
            <option value={EMPTY_VALUE} disabled>{MONTH_PLACEHOLDER}</option>
            {MONTH_OPTIONS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <label className="payment-test-label" htmlFor="securityCode">{SECURITY_CODE_LABEL}</label>
        <Input
          id="securityCode"
          className="payment-test-input"
          placeholder={SECURITY_CODE_PLACEHOLDER}
          value={securityCode}
          onChange={(e) => setSecurityCode(e.target.value)}
        />
        {purchaseError && (
          <span className="payment-test-error">{purchaseError}</span>
        )}
        <div className="payment-test-actions">
          <Button id="btnPurchase" onClick={doPurchase}>
            {PURCHASE_BUTTON}
          </Button>
        </div>
      </div>
    </AdminPage>
  );
};

export default Payment;
