import {
  API_SUCCESS_CODE,
  BOT_ID_COOKIE_KEY,
  ROLE_ADMIN_DEEL,
  USER_ROLE_COOKIE_KEY,
} from 'v2/api/constants';

export {
  API_SUCCESS_CODE,
  BOT_ID_COOKIE_KEY,
  ROLE_ADMIN_DEEL,
  USER_ROLE_COOKIE_KEY,
};

export const API_EXPIRED_CODE = 0;
export const PAGE_SIZE = 10;
export const ISO_DATE_LENGTH = 10;
export const CHART_RENDER_HEIGHT = 350;
export const CHART_INTERNAL_HEIGHT = 380;
export const CHART_PIE_WIDTH = 380;
export const CHART_PIE_MOBILE_WIDTH = 200;
export const CHART_MOBILE_BREAKPOINT = 480;
export const COL_WIDTH_START = 100;
export const COL_WIDTH_CV = 100;
export const COL_WIDTH_INDEX = 70;
export const COL_WIDTH_CLICK = 110;
export const COL_WIDTH_SHORT_URL = 220;
export const PENDING_REQUEST_COUNT = 2;

export const DATE_FORMAT = 'YYYY/MM/DD';
export const DATE_SLASH = '/';
export const DATE_DASH = '-';
export const ALIGN_CENTER = 'center';
export const MOMENT_UNIT_DAY = 'day';
export const MOMENT_UNIT_MONTH = 'month';
export const DAYS_YESTERDAY = 1;
export const DAYS_WEEK = 7;
export const DAYS_MONTH = 30;

export const AGGREGATION_CUSTOM = 'first';
export const AGGREGATION_YESTERDAY = '1';
export const AGGREGATION_WEEK = '7';
export const AGGREGATION_MONTH = '30';

export const DEVICE_ALL = 'all';
export const DEVICE_COMPUTER = 'computer';
export const DEVICE_TABLET = 'tablet';
export const DEVICE_SMARTPHONE = 'smartphone';

export const CLIENT_ID_DEEL = 'deel';

export const TAB_CVR = 'cvr';
export const TAB_CTR = 'ctr';
export const TAB_START = 'start';
export const TAB_CV = 'cv';

export const STAT_MODIFIER_PC = 'pc';
export const STAT_MODIFIER_SP = 'sp';
export const STAT_MODIFIER_TABLET = 'tablet';

export const SCREEN_ALL_ID = 'screenAll';
export const CHART_TYPE_BAR = 'bar';
export const CHART_TYPE_PIE = 'pie';
export const CHART_ALIGN_CENTER = 'center';
export const CHART_LEGEND_BOTTOM = 'bottom';
export const CHART_THEME_DARK = 'dark';
export const CHART_TEXT_ANCHOR_START = 'start';
export const CHART_LABEL_POSITION_BOTTOM = 'bottom';
export const CHART_WHITE = '#fff';
export const CHART_FONT_SIZE = '13px';
export const CHART_FONT_WEIGHT = 900;
export const CHART_BAR_HEIGHT = '100%';
export const CHART_STROKE_WIDTH = 1;
export const EMPTY_PIE_SERIES = [0, 0, 0];

export const GET_CLIENT_WITH_NAME_PATH = '/api/v1/managements/get_client_with_name';
export const HISTORY_CLICK_URLS_PATH = '/api/v1/managements/history_click_urls';
export const CHATBOTS_API_PATH = '/api/v1/managements/chatbots';
export const ALL_SCENARIOS_SEGMENT = 'all_scenarios';
export const SCENARIO_COUNTS_PATH = '/api/v1/analytics/scenario_counts';
export const DOWNLOAD_SEGMENT = 'download';
export const GET_SCENARIOS_BY_CLIENT_PATH = '/api/v1/managements/get_list_scenario_by_client';
export const CHATBOT_ID_QUERY = 'chatbot_id';
export const CLIENT_ID_QUERY = 'client_id';
export const BEGIN_DATE_QUERY = 'begin_date';
export const END_DATE_QUERY = 'end_date';
export const SHORTENED_URL_PREFIX = 'https://ec-chatbot1.com/s/';
export const SEARCH_DOWNLOAD_ID_SUFFIX = '}';

export const LABEL_PERIOD = '集計期間';
export const LABEL_DEVICE = 'デバイス';
export const LABEL_CLIENT = 'クライアント';
export const LABEL_SCENARIO = 'シナリオ';
export const LABEL_AGG_CUSTOM = '指定期間';
export const LABEL_AGG_YESTERDAY = '前日';
export const LABEL_AGG_WEEK = '最近7日間';
export const LABEL_AGG_MONTH = '最近30日間';
export const LABEL_DEVICE_ALL = 'すべて';
export const LABEL_PC = 'パソコン';
export const LABEL_TABLET = 'タブレット';
export const LABEL_SMARTPHONE = 'スマートフォン';
export const LABEL_CLIENT_DEEL = 'Deel';

export const DATE_RANGE_ERROR = '開始日時は終了日時より大きいです。';
export const DATE_REQUIRED_ERROR = '日付を入力してください';
export const EMPTY_VALUE = 'なし';
export const EMPTY_TABLE = 'データがありません';
export const EMPTY_DEVICE = 'デバイスがありません。';

export const SECTION_CVR_CTR = 'コンバージョンレート（CVR）/クリックスルレート（CTR）';
export const SECTION_LEAVE = '離脱';
export const SECTION_CONTENT = 'コンテンツ';
export const SECTION_DEVICE = 'デバイス';
export const SECTION_SHORTENED = 'リンククリックの短縮';

export const TOOLTIP_CVR_CTR = 'コンバージョン率とクリックスルー率の推移';
export const TOOLTIP_LEAVE = 'BOT開始に対する離脱の割合';
export const TOOLTIP_CONTENT = '開始ページとCVページの集計';
export const TOOLTIP_DEVICE = 'デバイス別のBOT起動数';
export const TOOLTIP_SHORTENED = '短縮URLのクリック数';

export const TAB_LABEL_CVR = 'コンバージョンレート（CVR）';
export const TAB_LABEL_CTR = 'クリックスルレート（CTR）';
export const TAB_LABEL_START = '開始ページ';
export const TAB_LABEL_CV = 'CVページ';

export const COL_START_COUNT = '開始数';
export const COL_CV_COUNT = 'CV数';
export const COL_URL = 'URL';
export const COL_INDEX = '番号';
export const COL_CLICK_COUNT = 'クリック数';
export const COL_ORIGIN_URL = '元のURL';
export const COL_SHORT_URL = '短縮URL';

export const CHART_CONVERSION = 'コンバージョン';
export const CHART_BOT_OPEN = 'BOT起動';
export const CHART_BOT_START = 'BOT開始';
export const CHART_TOTAL_PREFIX = '合計:  ';
export const CHART_CVR_PREFIX = 'CVR: ';
export const CHART_CTR_PREFIX = 'CTR: ';
export const CHART_TITLE_CVR = 'コンバージョン率(CVR)';
export const CHART_TITLE_CTR = 'CTR (BOT起動数/BOT開始数）';
export const CHART_SUBTITLE_CVR = 'コンバージョン数／BOT開始';
export const CHART_SUBTITLE_CTR = 'BOT起動/BOT開始';
export const CHART_LEAVE = '離脱';
export const CHART_TITLE_LEAVE = '離脱/BOT開始';
export const CHART_LEAVE_PREFIX = '離脱: ';
export const CHART_LABEL_SEPARATOR = ':  ';
export const PERCENT_SUFFIX = '%';
export const ZERO_PERCENT = '0%';
export const EMPTY_CELL = '';

export const EXPORT_PERIOD_HEADER = '集計期間';
export const EXPORT_DATE_HEADER = 'Date';
export const EXPORT_START_PAGE = '開始ページ';
export const EXPORT_CV_COUNT = 'CV数';
export const EXPORT_URL = 'URL';
export const EXPORT_CV_PC = 'CV PC';
export const EXPORT_CV_TABLET = 'CV タブレット';
export const EXPORT_CV_SMARTPHONE = 'CV スマートフォン';
export const EXPORT_BOT_START = 'BOT開始';
export const EXPORT_BOT_OPEN = 'BOT起動';
export const EXPORT_PC_LEAVE = 'PC離脱';
export const EXPORT_TABLET_LEAVE = 'タブレット離脱';
export const EXPORT_SMARTPHONE_LEAVE = 'スマートフォン離脱';
export const EXPORT_BOT_LEAVE = 'BOT離脱';
export const EXPORT_CV_TOTAL = 'CV合計数';
export const EXPORT_CT_PC = 'CT PC';
export const EXPORT_CT_TABLET = 'CT タブレット';
export const EXPORT_CT_SMARTPHONE = 'CT スマートフォン';
export const EXPORT_PC = 'PC';
export const EXPORT_TABLET = 'タブレット';
export const EXPORT_SMARTPHONE = 'スマートフォン';
export const EXPORT_TOTAL = '合計';
export const EXPORT_CVR = 'CVR';
export const EXPORT_CTR = 'CTR';
export const EXPORT_LEAVE_RATE = '離脱率';
export const EXPORT_FILE_PREFIX = 'Export ';
export const EXPORT_FILE_EXT = '.xlsx';
export const SHEET_CVR = 'コンバージョン率(CVR)';
export const SHEET_CONVERSION = 'コンバージョン数';
export const SHEET_CTR = 'クリックスルーレート(CTR) ';
export const SHEET_CLICK_THROUGH = 'クリックスルーレート数';
export const SHEET_LEAVE_RATE = '離脱率';
export const SHEET_LEAVE_COUNT = '離脱数';
export const SHEET_START_PAGE = '開始ページ';
export const SHEET_CV_PAGE = 'CVページ';

export const AGGREGATION_OPTIONS = [
  { value: AGGREGATION_CUSTOM, label: LABEL_AGG_CUSTOM },
  { value: AGGREGATION_YESTERDAY, label: LABEL_AGG_YESTERDAY },
  { value: AGGREGATION_WEEK, label: LABEL_AGG_WEEK },
  { value: AGGREGATION_MONTH, label: LABEL_AGG_MONTH },
];

export const DEVICE_OPTIONS = [
  { value: DEVICE_ALL, label: LABEL_DEVICE_ALL },
  { value: DEVICE_COMPUTER, label: LABEL_PC },
  { value: DEVICE_TABLET, label: LABEL_TABLET },
  { value: DEVICE_SMARTPHONE, label: LABEL_SMARTPHONE },
];

export const getAllScenariosPath = (botId) =>
  `${CHATBOTS_API_PATH}/${botId}/${ALL_SCENARIOS_SEGMENT}`;

export const getHistoryClickUrlsPath = (botId) =>
  `${HISTORY_CLICK_URLS_PATH}?${CHATBOT_ID_QUERY}=${botId}`;

export const getScenarioCountsPath = (scenarioId, beginDate, endDate) =>
  `${SCENARIO_COUNTS_PATH}/${scenarioId}?${BEGIN_DATE_QUERY}=${beginDate}&${END_DATE_QUERY}=${endDate}`;

export const getScenarioCountsDownloadPath = (scenarioId, beginDate, endDate) =>
  `${SCENARIO_COUNTS_PATH}/${scenarioId}/${DOWNLOAD_SEGMENT}?${BEGIN_DATE_QUERY}=${beginDate}&${END_DATE_QUERY}=${endDate}`;

export const getSearchScenarioDownloadPath = (scenarioId, beginDate, endDate) =>
  `${SCENARIO_COUNTS_PATH}/${scenarioId}${SEARCH_DOWNLOAD_ID_SUFFIX}/${DOWNLOAD_SEGMENT}?${BEGIN_DATE_QUERY}=${beginDate}&${END_DATE_QUERY}=${endDate}`;

export const getScenariosByClientPath = (clientId) =>
  `${GET_SCENARIOS_BY_CLIENT_PATH}?${CLIENT_ID_QUERY}=${clientId}`;

export const getShortenedUrl = (code) => `${SHORTENED_URL_PREFIX}${code}`;

export const getExportFileName = (startDateEx, endDateEx) =>
  `${EXPORT_FILE_PREFIX}${startDateEx}_${endDateEx}${EXPORT_FILE_EXT}`;

export const formatDateRangeLabel = (start, end) => `${start}~${end}`;

export const formatPercentLabel = (numerator, denominator) => {
  if (denominator === 0) {
    return ZERO_PERCENT;
  }
  return `${Math.round((numerator * 100) / denominator).toFixed(2)}${PERCENT_SUFFIX}`;
};

export const formatRateNumber = (numerator, denominator) => {
  if (denominator === 0) {
    return 0;
  }
  return Math.round((numerator * 100) / denominator).toFixed(2);
};

export const STATISTICS_PENDING_LABEL = '統計（準備中）';

export const CHAT_LOG_TAB_LOGS = 'LOGS';
export const CHAT_LOG_TAB_STATISTIC = 'STATICTIC';
export const CHAT_LOG_TAB_LOGS_LABEL = '会話ログ';
export const CHAT_LOG_TAB_STATISTIC_LABEL = '統計';
export const CHAT_LOG_SCENARIO_LABEL = 'シナリオ';
export const CHAT_LOG_SCENARIO_PLACEHOLDER = 'すべて';
export const CHAT_LOG_CONVERSATION_PREFIX = '会話（';
export const CHAT_LOG_CONVERSATION_SUFFIX = '人）';
export const CHAT_LOG_USER_NAME_PREFIX = 'ユーザー ';
export const CHAT_LOG_STATUS_DONE = '完了';
export const CHAT_LOG_STATUS_NOT_DONE = '未完了';
export const CHAT_LOG_SELECT_CONVERSATION = '会話を選択してください';
export const CHAT_LOG_NEXT_BUTTON = '次へ';
export const CHAT_LOG_STATS_EMPTY_DESCRIPTION = 'メッセージが存在しないか、シナリオが未選択です';
export const CHAT_LOG_METRIC_NO_LABEL = 'No label';
export const BOT_MESSAGE_DOWNLOAD_FILE = 'ファイルをダウンロード';
export const BOT_MESSAGE_ICON_ALT = 'icon';
export const BOT_MESSAGE_FILE_DOWNLOAD_NAME = 'file';

export const METRIC_KEY_ENTRY_COUNT = 'entry_count';
export const METRIC_KEY_FORM_COMPLETED_COUNT = 'form_completed_count';
export const METRIC_KEY_FORM_COMPLETION_RATE = 'form_completion_rate';
export const METRIC_KEY_PGS_CV_COUNT = 'pgs_cv_count';
export const METRIC_KEY_PGS_CV_ENTRY_RATE = 'pgs_cv_entry_rate';
export const METRIC_KEY_IMPRESSION_COUNT = 'impression_count';

export const METRIC_LABEL_ENTRY_COUNT = 'エントリー数';
export const METRIC_LABEL_FORM_COMPLETED_COUNT = '入力完了数';
export const METRIC_LABEL_FORM_COMPLETION_RATE = '入力完了率';
export const METRIC_LABEL_CV_COUNT = 'CV数';
export const METRIC_LABEL_CV_ENTRY_RATE = 'CV数';
export const METRIC_LABEL_CV_ENTRY_RATE_DIVIDER = '/ エントリー数';
export const METRIC_LABEL_IMPRESSION_COUNT = 'インプレッション数';
export const METRIC_UNIT_PERCENT = '%';
export const METRIC_PGS_PREFIX = 'PGS-';

export const CHAT_LOG_DATE_FORMAT = 'YYYY-MM-DD';
export const CHAT_LOG_DATE_PICKER_FORMAT = 'YYYY/MM/DD';
export const CHAT_LOG_DISPLAY_DATE_FORMAT = 'yyyy-MM-dd HH:mm';
export const CHAT_LOG_PASSWORD_MASK = '********';
export const EMPTY_STRING = '';

export const formatChatLogConversationHeader = (count) =>
  `${CHAT_LOG_CONVERSATION_PREFIX}${count}${CHAT_LOG_CONVERSATION_SUFFIX}`;

export const formatChatLogUserName = (index, total) =>
  `${CHAT_LOG_USER_NAME_PREFIX}${total - index}`;

export const STAT_DETAIL_KEY_APPEAR_COUNT = 'appear_count';
export const STAT_DETAIL_KEY_ERROR_COUNT = 'error_count';
export const STAT_DETAIL_KEY_COMPLETE_COUNT = 'complete_count';
export const STAT_DETAIL_KEY_RETRY_COUNT = 'retry_count';
export const STAT_DETAIL_KEY_COMPLETION_RATE = 'completion_rate';

export const STAT_DETAIL_LABEL_APPEAR_COUNT = '表示回数';
export const STAT_DETAIL_LABEL_ERROR_COUNT = 'エラー回数';
export const STAT_DETAIL_LABEL_COMPLETE_COUNT = '入力完了数';
export const STAT_DETAIL_LABEL_RETRY_COUNT = '再入力回数';
export const STAT_DETAIL_LABEL_COMPLETION_RATE = '入力完了率';
export const STAT_DETAIL_COUNT_SUFFIX = '回';
