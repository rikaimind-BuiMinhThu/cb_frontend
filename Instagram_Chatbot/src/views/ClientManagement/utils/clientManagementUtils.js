import { PAGE_SIZE } from '../constants';

export { PAGE_SIZE };

export function getConversionPreviewDates(range) {
  if (!range?.[0] || !range?.[1]) {
    return { startPreview: null, endPreview: null };
  }
  const startPreview = range[0].toDate();
  startPreview.setDate(startPreview.getDate() + 1);
  const endPreview = range[1].toDate();
  endPreview.setDate(endPreview.getDate() + 1);
  return { startPreview, endPreview };
}

export function getStatusLabel(status) {
  if (status === 'pause') return '休止';
  if (status === 'ended') return '解約';
  if (status === 'trial') return 'お試し';
  return '契約';
}

export function isValidConversionDateRange(startDateIn, endDateIn) {
  if (!startDateIn || !endDateIn) return true;
  const startDate = parseInt(startDateIn.replaceAll('-', ''), 10);
  const endDate = parseInt(endDateIn.replaceAll('-', ''), 10);
  return startDate <= endDate;
}

export function buildClientsUrl(pageNum, name, startPreview, endPreview) {
  let url = `/api/v1/managements/clients?name=${encodeURIComponent(name || '')}&page=${pageNum}&client_id=`;
  if (startPreview && endPreview) {
    url += `&conversion_begin_date=${startPreview.toISOString().slice(0, 10)}&conversion_end_date=${endPreview.toISOString().slice(0, 10)}`;
  }
  return url;
}

export function gotoPaymentDetail(item) {
  window.location.href = `/admin/client-payment-detail/${item.id}`;
}
