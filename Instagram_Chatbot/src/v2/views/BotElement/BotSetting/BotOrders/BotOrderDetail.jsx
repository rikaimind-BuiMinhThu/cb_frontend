import React, { useEffect, useMemo, useState } from 'react';
import { Button, Descriptions, Spin, Tag, Typography } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage } from '../../../../components/AdminShell';
import {
  formatCardExpiry,
  formatDateTime,
  formatInputLabel,
  formatInputValue,
  formatRpaLog,
  showCardFields,
  statusColor,
  statusLabel,
} from './botOrderFormat';

const LABEL_STYLE = { width: 160 };

function ExternalLink({ href }) {
  if (!href) return '—';
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {href}
    </a>
  );
}

const RPA_LOG_STYLE = {
  background: '#F5F7FA',
  border: '1px solid #E5E7EB',
  borderRadius: 4,
  padding: 16,
  marginBottom: 24,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  fontSize: 13,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  overflow: 'auto',
};

function BotOrderDetail() {
  const { id } = useParams();
  const history = useHistory();
  const botId = Cookies.get('bot_id');
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/v1/managements/selenium_results/${id}`, { params: { chatbot_id: botId } })
      .then((res) => {
        if (res.data.code === 1) {
          setRow(res.data.data);
        } else {
          history.push('/v2/admin/scenario-list');
        }
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          history.push('/v2/admin/scenario-list');
        } else if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }, [botId, history, id]);

  useEffect(() => {
    if (!row?.id || !row.has_screenshot) return undefined;
    let objectUrl;
    api
      .get(`/api/v1/managements/selenium_results/${row.id}/screenshot`, {
        params: { chatbot_id: botId },
        responseType: 'blob',
      })
      .then((res) => {
        objectUrl = URL.createObjectURL(res.data);
        setScreenshotUrl(objectUrl);
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) tokenExpired();
      });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [botId, row]);

  const goToList = () => history.push('/v2/admin/bot-orders');
  const cardVisible = showCardFields(row);
  const answers = row?.answers || [];
  const rpaLog = useMemo(() => formatRpaLog(row?.rpa_steps), [row]);

  return (
    <AdminPage>
      <div style={{ padding: 20 }}>
        <Spin spinning={loading}>
          {row && (
            <>
              <div style={{ marginBottom: 16 }}>
                <Button onClick={goToList}>一覧へ戻る</Button>
              </div>

              <Descriptions bordered column={1} size="small" labelStyle={LABEL_STYLE} style={{ marginBottom: 24 }}>
                <Descriptions.Item label="ステータス">
                  <Tag color={statusColor(row.result)}>{statusLabel(row.result)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="注文タイプ">{row.path_label || '—'}</Descriptions.Item>
                <Descriptions.Item label="支払い">{row.payment_label || '—'}</Descriptions.Item>
                <Descriptions.Item label="メール">{row.email || '—'}</Descriptions.Item>
                <Descriptions.Item label="商品コード">{row.sku || '—'}</Descriptions.Item>
                <Descriptions.Item label="商品URL">
                  <ExternalLink href={row.product_url} />
                </Descriptions.Item>
                <Descriptions.Item label="カートURL">
                  <ExternalLink href={row.cart_url} />
                </Descriptions.Item>
                <Descriptions.Item label="レキシカ注文ID">{row.lexica_order_id || '—'}</Descriptions.Item>
                {cardVisible && (
                  <Descriptions.Item label="カード">{row.masked_pan || '—'}</Descriptions.Item>
                )}
                {cardVisible && (
                  <Descriptions.Item label="有効期限">{formatCardExpiry(row.card_expiry)}</Descriptions.Item>
                )}
                {cardVisible && (
                  <Descriptions.Item label="名義">{row.card_holder || '—'}</Descriptions.Item>
                )}
                <Descriptions.Item label="開始">{formatDateTime(row.start_time)}</Descriptions.Item>
                <Descriptions.Item label="終了">{formatDateTime(row.end_time)}</Descriptions.Item>
                <Descriptions.Item label="エラー">{row.error_message || '—'}</Descriptions.Item>
                <Descriptions.Item label="会話">
                  <Link to="/v2/admin/bot-chat-log">会話を開く</Link>
                </Descriptions.Item>
              </Descriptions>

              {answers.length > 0 && (
                <>
                  <Typography.Title level={5}>入力内容</Typography.Title>
                  <Descriptions bordered column={1} size="small" labelStyle={LABEL_STYLE} style={{ marginBottom: 24 }}>
                    {answers.map((answer) => (
                      <Descriptions.Item key={answer.data_input_name} label={formatInputLabel(answer.data_input_name)}>
                        {formatInputValue(answer.data_input_name, answer.value)}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </>
              )}

              <Typography.Title level={5}>RPA実行ログ</Typography.Title>
              <pre style={RPA_LOG_STYLE}>{rpaLog}</pre>

              {screenshotUrl && (
                <div style={{ marginTop: 16 }}>
                  <Typography.Title level={5}>失敗時スクリーンショット</Typography.Title>
                  <img
                    alt="fail screenshot"
                    style={{ maxWidth: '100%' }}
                    src={screenshotUrl}
                  />
                </div>
              )}

              <div style={{ marginTop: 24 }}>
                <Button onClick={goToList}>一覧へ戻る</Button>
              </div>
            </>
          )}
        </Spin>
      </div>
    </AdminPage>
  );
}

export default BotOrderDetail;
