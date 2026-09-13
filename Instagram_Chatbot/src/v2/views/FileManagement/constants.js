import { API_SUCCESS_CODE } from 'v2/api/constants';

export { API_SUCCESS_CODE };

export const FILES_API_PATH = '/api/v1/managements/file';
export const FILES_UPLOAD_PATH = '/api/v1/managements/file/upload';
export const S3_FILE_BASE_URL = 'https://ec-chatbot.s3.ap-northeast-1.amazonaws.com';

export const PAGE_SIZE = 25;
export const INITIAL_PAGE = 1;
export const PREVIEW_MODAL_WIDTH = 720;
export const BYTES_PER_KB = 1024;
export const IMAGE_MAX_MB = 2;
export const PDF_MAX_MB = 3;
export const VIDEO_MAX_SECONDS = 15;
export const TOKEN_EXPIRED_CODE = 0;
export const EMPTY_DURATION = '';

export const FILE_TYPE_JPEG = 'jpeg';
export const FILE_TYPE_JPG = 'jpg';
export const FILE_TYPE_PNG = 'png';
export const FILE_TYPE_PDF = 'pdf';
export const FILE_TYPE_MP4 = 'mp4';
export const FILE_TYPE_GIF = 'gif';

export const ALLOWED_FILE_TYPES = [
  FILE_TYPE_JPEG,
  FILE_TYPE_JPG,
  FILE_TYPE_PNG,
  FILE_TYPE_PDF,
  FILE_TYPE_MP4,
  FILE_TYPE_GIF,
];

export const IMAGE_PREVIEW_TYPES = [
  FILE_TYPE_JPEG,
  FILE_TYPE_JPG,
  FILE_TYPE_PNG,
  FILE_TYPE_GIF,
];

export const MIME_VIDEO_MP4 = 'video/mp4';
export const MIME_APPLICATION_PDF = 'application/pdf';
export const MIME_IMAGE_PREFIX = 'image/';

export const ERROR_FILE_TYPE = 'jpeg/ jpg/ png/ pdf/ mp4/ gifのファイルを入力が必要です。';
export const ERROR_IMAGE_SIZE = '2MB以下のファイルをアップロードしてください。';
export const ERROR_PDF_SIZE = '3MB以下のファイルをアップロードしてください。';
export const ERROR_VIDEO_DURATION = '15秒以下のビデオをアップロードしてください。';
export const SUCCESS_FILE_ADDED = '正常にファイル追加されました！';
export const ERROR_FILE_ADD = 'ファイルの追加ができませんでした。';
export const SUCCESS_FILE_DELETED = '正常に削除されました！';
export const ERROR_FILE_DELETE = '削除できませんでした。';
export const SUCCESS_URL_COPIED = '正常にURLをコピーしました！';
export const DELETE_CONFIRM_MESSAGE = '本当にファイルを削除しますか。';
export const PREVIEW_TITLE = 'プレビュー';
export const CLOSE_BUTTON = '閉じる';

export const COL_NUMBER = '番号';
export const COL_TYPE = 'タイプ';
export const COL_URL = 'URL';
export const COL_ACTIONS = 'アクション';

export const COL_NUMBER_WIDTH = 70;
export const COL_TYPE_WIDTH = 100;
export const COL_ACTIONS_WIDTH = 260;
