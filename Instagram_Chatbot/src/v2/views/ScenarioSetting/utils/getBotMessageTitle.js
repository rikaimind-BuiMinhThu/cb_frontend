import { BOT_MESSAGE_TYPES } from 'v2/views/Preview/PreviewComponent/Constants';

export const getBotMessageTitle = (content) => {
  if (!content) return '';
  if (content.type === 'delay') return '遅延';
  if (content.type === 'file') return 'ファイル';
  if (content.type === 'email') return 'メール';
  if (content.type === 'api_linkage') return 'API連携';
  if (content.type === 'script') return 'スクリプト';
  if (content.type === 'clear_variable') return '変数クリア';
  if (content.type === 'variable_set') return '変数セット';
  if (content.type === 'pause') return '一時停止';
  if (content.type === 'getting_error_notification') return 'エラー取得の通知';
  if (content.type === BOT_MESSAGE_TYPES.HTML_CODE) return 'HTMLコード';
  if (content.type === BOT_MESSAGE_TYPES.UGC) return 'HTML_UGC_CONFIG';
  if (content.type === BOT_MESSAGE_TYPES.AMAZON_PAY_BUTTON) return 'Amazon Payボタン';
  if (content.type === BOT_MESSAGE_TYPES.ORDER_CONFIRM) return '注文確認';
  if (content.type === BOT_MESSAGE_TYPES.CART_LOGIN) return 'カートログイン';
  return '';
};

export const getBotFileExtension = (content) => {
  if (!content || content.type !== 'file') return '';
  return content[content.type]?.content?.slice(
    content[content.type]?.content.lastIndexOf('.') + 1
  ) || '';
};
