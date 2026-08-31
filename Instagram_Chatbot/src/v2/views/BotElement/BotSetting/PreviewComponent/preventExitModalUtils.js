// Bug #11: Đóng chat không hiện modal — chuẩn hóa status 離脱防止 (0/1/2 hoặc string).
// Không ép modal khi cả 離脱防止 và popup_close_bot đều off.
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

// Hiện confirm khi đóng chỉ nếu 離脱防止 đang bật (standard/image)
// HOẶC design setting popup_close_bot (activePopupCloseBot) đang bật.
// Cả hai off → đóng thẳng, không hiện modal.
export const shouldShowPreventExitModal = (botInfor, activePopupCloseBot) => (
  isWithdrawalPopupEnabled(botInfor) || Boolean(activePopupCloseBot)
);

export { WITHDRAWAL_POPUP_STATUS };
