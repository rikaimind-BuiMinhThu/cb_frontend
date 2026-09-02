import React from 'react';
import americanExpress from 'assets/img/payment-method/american_express.png';
import dinerClub from 'assets/img/payment-method/diner_club.png';
import discover from 'assets/img/payment-method/discover.png';
import jcb from 'assets/img/payment-method/jcb.png';
import masterCard from 'assets/img/payment-method/master_card.png';
import visa from 'assets/img/payment-method/visa.png';
import {
  ALT_EMPTY,
  PAYMENT_METHOD_AMERICAN_EXPRESS,
  PAYMENT_METHOD_DINER_CLUB,
  PAYMENT_METHOD_DISCOVER,
  PAYMENT_METHOD_JCB,
  PAYMENT_METHOD_MASTER_CARD,
  PAYMENT_METHOD_VISA,
} from './constants';

const PAYMENT_METHODS = [
  { key: PAYMENT_METHOD_VISA, value: <img alt={ALT_EMPTY} src={visa} /> },
  { key: PAYMENT_METHOD_JCB, value: <img alt={ALT_EMPTY} src={jcb} /> },
  { key: PAYMENT_METHOD_MASTER_CARD, value: <img alt={ALT_EMPTY} src={masterCard} /> },
  { key: PAYMENT_METHOD_AMERICAN_EXPRESS, value: <img alt={ALT_EMPTY} src={americanExpress} /> },
  { key: PAYMENT_METHOD_DINER_CLUB, value: <img alt={ALT_EMPTY} src={dinerClub} /> },
  { key: PAYMENT_METHOD_DISCOVER, value: <img alt={ALT_EMPTY} src={discover} /> },
];

export default PAYMENT_METHODS;
