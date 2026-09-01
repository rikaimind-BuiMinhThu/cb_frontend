export const MESSAGE_TYPES = {
  MSG: 'msg',
  IMG: 'img',
  IMG_MSG: 'img_msg',
  PAST_POST: 'past_post',
  PROFILE_MSG: 'profile_msg',
};

export const MESSAGE_TYPE_LABELS = {
  [MESSAGE_TYPES.MSG]: 'テキスト',
  [MESSAGE_TYPES.IMG]: '画像',
  [MESSAGE_TYPES.IMG_MSG]: '画像＋テキスト',
  [MESSAGE_TYPES.PAST_POST]: '過去の投稿',
  [MESSAGE_TYPES.PROFILE_MSG]: 'プロファイルメッセージ',
};

export const ADD_MESSAGE_OPTIONS = [
  { type: MESSAGE_TYPES.IMG, label: '画像', icon: 'picture' },
  { type: MESSAGE_TYPES.MSG, label: 'テキスト', icon: 'message' },
  { type: MESSAGE_TYPES.IMG_MSG, label: '画像＋テキスト', icon: 'file-image' },
  { type: MESSAGE_TYPES.PAST_POST, label: '過去の投稿', icon: 'instagram' },
  { type: MESSAGE_TYPES.PROFILE_MSG, label: 'プロファイル', icon: 'user' },
];

export const GROUP_PAGE_SIZE = 25;
