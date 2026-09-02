export const PUSH_MESSAGES_PATH = '/api/v1/managements/push_messages';
export const PUSH_MESSAGE_HISTORIES_PATH = '/api/v1/managements/push_message_histories';
export const EMAILS_PATH = '/api/v1/managements/emails';
export const SMS_TEMPLATES_PATH = '/api/v1/managements/sms_templates';

export const CREATE_LABEL = 'プッシュメッセージ作成';
export const EDIT_TITLE = 'プッシュメッセージ編集';
export const SAVE_OK = '保存';
export const CANCEL = 'キャンセル';
export const SUCCESS_SAVE = 'プッシュメッセージを正常に保存しました。';
export const SUCCESS_DELETE = '正常に削除しました。';
export const DELETE_CONFIRM = '本当に削除しますか。';
export const DELETE_OK = '削除';

export const COL_NO = '番号';
export const COL_TITLE = 'プッシュメッセージ名';
export const COL_SENDING_METHOD = '送信方法';
export const COL_STARTED_AT = '開始日時';
export const COL_SENT_TIME = '配信日時';
export const COL_STATUS = '状態';
export const COL_ACTION = 'アクション';
export const COL_DESTINATION = '行き先';
export const COL_FAILED_COUNT = '送信失敗の件数';

export const TAG_EMAIL = 'メール';
export const TAG_SMS = 'SMS';
export const TAG_SUBSCRIBE = '配信予約中';
export const TAG_UNSUBSCRIBE = '配信停止';
export const TAG_SUCCESS = '成功';
export const TAG_FAILURE = '失敗';

export const BTN_PAUSE = '配信停止';
export const BTN_RESUME = '配信する';

export const EMPTY_CELL = '—';
export const EMPTY_LIST = 'プッシュメッセージがありません';
export const EMPTY_HISTORY = '配信履歴がありません';

export const HISTORY_PERIOD_LABEL = '集計期間';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

export const LABEL_NAME = 'プッシュメッセージ名';
export const PLACEHOLDER_NAME = 'プッシュメッセージ名';
export const NAME_HINT = '※プッシュメッセージに任意の名前をつけます。この名称がチャットに表示されることはありません。';
export const LABEL_SENDING_METHOD = '送信方法';
export const LABEL_TEMPLATE = 'テンプレート';
export const LABEL_START_TIME = '開始日時';
export const START_TIME_HINT = '※プッシュメッセージを送信する日時を指定します。';
export const LABEL_EXCLUDE_TIME = '自動送信プッシュの時間帯除外';
export const LABEL_EXCLUDE_RANGE = '除外時間';
export const LABEL_ALTERNATE_TIME = '代替送信時間';
export const EXCLUDE_RANGE_SEPARATOR = '~';
export const EXCLUDE_PUSH_TIME_ERROR = '代替送信時間を除外時間以外と設定してください。';

export const FILTER_TITLE = '対象者指定';
export const FILTER_HINT = '※条件を加えることでプッシュメッセージを送信する対象者を絞り込むことができます。';
export const FILTER_VAR_LABEL = '変数';
export const FILTER_LAST_LABEL = 'last_message_datetime';
export const FILTER_OF_LABEL = 'の';
export const BTN_ADD_CONDITION = '条件追加';

export const OPERATOR_CONTAINS = 'contains';
export const OPERATOR_IS = 'is';
export const OPERATOR_IS_NOT = 'is not';
export const OPERATOR_AND = 'AND';

export const METHOD_EMAIL = 'email';
export const METHOD_SMS = 'sms';
export const STATUS_SUBSCRIBE = 'subscribe';
export const STATUS_UNSUBSCRIBE = 'unsubscribe';
export const STATUS_SUCCESS = 'success';

export const DEFAULT_HOUR = '00';
export const FILTER_VAR_VALUE = 'var';
export const FILTER_LAST_VALUE = 'last';
export const FILTER_OF_VALUE = 'of';
export const FILTER_AND_VALUE = 'and';
