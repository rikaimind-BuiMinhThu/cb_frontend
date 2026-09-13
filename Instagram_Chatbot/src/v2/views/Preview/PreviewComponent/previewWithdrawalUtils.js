export const WITHDRAWAL_STATUS_STANDARD = 'standard_exit_popup';
export const WITHDRAWAL_STATUS_IMAGE = 'image_popup';

export const isWithdrawalPreventionEnabled = (status) => (
  status === WITHDRAWAL_STATUS_STANDARD || status === WITHDRAWAL_STATUS_IMAGE
);
