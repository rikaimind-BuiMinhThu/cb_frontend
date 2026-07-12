export const PAGE_SIZE = 25;

export const EMAIL_REGEX =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export const ROLE_OPTIONS = [
  { value: 'admin_client', label: 'クライアント' },
  { value: 'client', label: 'ユーザー' },
];
