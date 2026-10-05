import moment from 'moment';
import { BASELINE_MONTHS_BEFORE } from '../constants';

export function getDefaultDateRange() {
  const end = moment();
  const start = moment().subtract(1, 'month').date(15);
  return [start, end];
}

export function formatDateToApi(date) {
  if (!date) return '';
  return moment(date).format('YYYY-MM-DD');
}

export function getLiveEndDate(endDate) {
  return moment(endDate).add(1, 'day').format('YYYY-MM-DD');
}

export function getBaselineBeginDate(beginDate) {
  return moment(beginDate).subtract(BASELINE_MONTHS_BEFORE, 'months').format('YYYY-MM-DD');
}

export function isValidDateRange(startDate, endDate) {
  if (!startDate || !endDate) return true;
  const start = parseInt(formatDateToApi(startDate).replaceAll('-', ''), 10);
  const end = parseInt(formatDateToApi(endDate).replaceAll('-', ''), 10);
  return start <= end;
}

export function formatChartDate(logDate) {
  if (!logDate) return '';
  return `${logDate.slice(3, 5)}/${logDate.slice(0, 2)}`;
}
