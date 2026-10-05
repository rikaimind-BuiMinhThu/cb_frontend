import { getAdminRoutePath } from 'v2/variables/constants';
import {
  CLIENTS_API_PATH,
  CLIENT_PAYMENT_DETAIL_PATH,
  DATE_SLICE_LENGTH,
  PAGE_SIZE,
  STATUS_ENDED,
  STATUS_LABEL_ACTIVE,
  STATUS_LABEL_ENDED,
  STATUS_LABEL_PAUSE,
  STATUS_LABEL_TRIAL,
  STATUS_PAUSE,
  STATUS_TRIAL,
} from '../constants';

export { PAGE_SIZE };

export const getConversionPreviewDates = (range) => {
  if (!range?.[0] || !range?.[1]) {
    return { startPreview: null, endPreview: null };
  }
  const startPreview = range[0].toDate();
  startPreview.setDate(startPreview.getDate() + 1);
  const endPreview = range[1].toDate();
  endPreview.setDate(endPreview.getDate() + 1);
  return { startPreview, endPreview };
};

export const getStatusLabel = (status) => {
  if (status === STATUS_PAUSE) return STATUS_LABEL_PAUSE;
  if (status === STATUS_ENDED) return STATUS_LABEL_ENDED;
  if (status === STATUS_TRIAL) return STATUS_LABEL_TRIAL;
  return STATUS_LABEL_ACTIVE;
};

export const isValidConversionDateRange = (startDateIn, endDateIn) => {
  if (!startDateIn || !endDateIn) return true;
  const startDate = parseInt(startDateIn.replaceAll('-', ''), 10);
  const endDate = parseInt(endDateIn.replaceAll('-', ''), 10);
  return startDate <= endDate;
};

export const buildClientsUrl = (pageNum, name, startPreview, endPreview) => {
  const encodedName = encodeURIComponent(name || '');
  const base = `${CLIENTS_API_PATH}?name=${encodedName}&page=${pageNum}&client_id=`;
  if (!startPreview || !endPreview) {
    return base;
  }
  const beginDate = startPreview.toISOString().slice(0, DATE_SLICE_LENGTH);
  const endDate = endPreview.toISOString().slice(0, DATE_SLICE_LENGTH);
  return `${base}&conversion_begin_date=${beginDate}&conversion_end_date=${endDate}`;
};

export const gotoPaymentDetail = (item) => {
  window.location.href = getAdminRoutePath(`${CLIENT_PAYMENT_DETAIL_PATH}/${item.id}`);
};
