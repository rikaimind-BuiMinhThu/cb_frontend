const WITHDRAWAL_POPUP_STATUS = {
  INVALID: 'invalid',
  STANDARD: 'standard_exit_popup',
  IMAGE: 'image_popup',
};

const STATUS_BY_VALUE = {
  0: WITHDRAWAL_POPUP_STATUS.INVALID,
  1: WITHDRAWAL_POPUP_STATUS.STANDARD,
  2: WITHDRAWAL_POPUP_STATUS.IMAGE,
  invalid: WITHDRAWAL_POPUP_STATUS.INVALID,
  standard_exit_popup: WITHDRAWAL_POPUP_STATUS.STANDARD,
  image_popup: WITHDRAWAL_POPUP_STATUS.IMAGE,
};

export const normalizeWithdrawalPreventionStatus = (rawStatus) => {
  if (rawStatus === undefined || rawStatus === null || rawStatus === '') {
    return WITHDRAWAL_POPUP_STATUS.INVALID;
  }
  return STATUS_BY_VALUE[rawStatus] || STATUS_BY_VALUE[String(rawStatus)] || WITHDRAWAL_POPUP_STATUS.INVALID;
};

export const isWithdrawalPopupEnabled = (botInfor) => {
  const status = normalizeWithdrawalPreventionStatus(botInfor?.withdrawal_prevention_status);
  return status === WITHDRAWAL_POPUP_STATUS.STANDARD || status === WITHDRAWAL_POPUP_STATUS.IMAGE;
};

export const shouldShowPreventExitModal = () => true;

export { WITHDRAWAL_POPUP_STATUS };
