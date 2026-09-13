import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Descriptions, Spin, Tag, Typography } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { API_SUCCESS_CODE, BOT_ID_COOKIE_KEY } from 'v2/api/constants';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminActionButton, AdminPage } from 'v2/components/AdminShell';
import { ADMIN_PATHS } from 'v2/components/AdminShell/constants';
import { getAdminRoutePath } from 'v2/variables/constants';
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
import {
  BACK_TO_LIST_LABEL,
  CONVERSATION_LINK_LABEL,
  DASH,
  LABEL_ANSWERS,
  LABEL_CARD,
  LABEL_CARD_EXPIRY,
  LABEL_CARD_HOLDER,
  LABEL_CART_URL,
  LABEL_CONVERSATION,
  LABEL_EMAIL,
  LABEL_END,
  LABEL_ERROR,
  LABEL_LEXICA_ORDER_ID,
  LABEL_PATH,
  LABEL_PAYMENT,
  LABEL_PRODUCT_URL,
  LABEL_RPA_LOG,
  LABEL_SCREENSHOT,
  LABEL_SKU,
  LABEL_START,
  LABEL_STATUS,
  ORDERS_API_PATH,
  SCREENSHOT_ALT,
} from './constants';
import './styles/bot-orders.css';

const ExternalLink = ({ href }) => {
  if (!href) return DASH;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {href}
    </a>
  );
};

ExternalLink.propTypes = {
  href: PropTypes.string,
};

const BotOrderDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const botId = Cookies.get(BOT_ID_COOKIE_KEY);
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const screenshotObjectUrlRef = useRef('');
  const listPath = getAdminRoutePath(ADMIN_PATHS.BOT_ORDERS);
  const scenarioListPath = getAdminRoutePath(ADMIN_PATHS.SCENARIO_LIST);
  const chatLogPath = getAdminRoutePath(ADMIN_PATHS.BOT_CHAT_LOG);

  useEffect(() => {
    setLoading(true);
    api
      .get(`${ORDERS_API_PATH}/${id}`, { params: { chatbot_id: botId } })
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          setRow(res.data.data);
          return;
        }
        history.push(scenarioListPath);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          history.push(scenarioListPath);
          return;
        }
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }, [botId, history, id, scenarioListPath]);

  useEffect(() => {
    if (!row?.id || !row.has_screenshot) return undefined;
    api
      .get(`${ORDERS_API_PATH}/${row.id}/screenshot`, {
        params: { chatbot_id: botId },
        responseType: 'blob',
      })
      .then((res) => {
        screenshotObjectUrlRef.current = URL.createObjectURL(res.data);
        setScreenshotUrl(screenshotObjectUrlRef.current);
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) tokenExpired();
      });
    return () => {
      if (screenshotObjectUrlRef.current) {
        URL.revokeObjectURL(screenshotObjectUrlRef.current);
      }
    };
  }, [botId, row]);

  const goToList = () => history.push(listPath);
  const cardVisible = showCardFields(row);
  const answers = row?.answers || [];
  const rpaLog = useMemo(() => formatRpaLog(row?.rpa_steps), [row]);

  return (
    <AdminPage>
      <div className="bot-orders-page">
        <Spin spinning={loading}>
          {row && (
            <>
              <div className="bot-orders-back">
                <AdminActionButton action="back" label={BACK_TO_LIST_LABEL} onClick={goToList} />
              </div>

              <Descriptions bordered column={1} size="small" className="bot-orders-section">
                <Descriptions.Item label={LABEL_STATUS}>
                  <Tag color={statusColor(row.result)}>{statusLabel(row.result)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={LABEL_PATH}>{row.path_label || DASH}</Descriptions.Item>
                <Descriptions.Item label={LABEL_PAYMENT}>{row.payment_label || DASH}</Descriptions.Item>
                <Descriptions.Item label={LABEL_EMAIL}>{row.email || DASH}</Descriptions.Item>
                <Descriptions.Item label={LABEL_SKU}>{row.sku || DASH}</Descriptions.Item>
                <Descriptions.Item label={LABEL_PRODUCT_URL}>
                  <ExternalLink href={row.product_url} />
                </Descriptions.Item>
                <Descriptions.Item label={LABEL_CART_URL}>
                  <ExternalLink href={row.cart_url} />
                </Descriptions.Item>
                <Descriptions.Item label={LABEL_LEXICA_ORDER_ID}>{row.lexica_order_id || DASH}</Descriptions.Item>
                {cardVisible && (
                  <Descriptions.Item label={LABEL_CARD}>{row.masked_pan || DASH}</Descriptions.Item>
                )}
                {cardVisible && (
                  <Descriptions.Item label={LABEL_CARD_EXPIRY}>{formatCardExpiry(row.card_expiry)}</Descriptions.Item>
                )}
                {cardVisible && (
                  <Descriptions.Item label={LABEL_CARD_HOLDER}>{row.card_holder || DASH}</Descriptions.Item>
                )}
                <Descriptions.Item label={LABEL_START}>{formatDateTime(row.start_time)}</Descriptions.Item>
                <Descriptions.Item label={LABEL_END}>{formatDateTime(row.end_time)}</Descriptions.Item>
                <Descriptions.Item label={LABEL_ERROR}>{row.error_message || DASH}</Descriptions.Item>
                <Descriptions.Item label={LABEL_CONVERSATION}>
                  <Link to={chatLogPath}>{CONVERSATION_LINK_LABEL}</Link>
                </Descriptions.Item>
              </Descriptions>

              {answers.length > 0 && (
                <>
                  <Typography.Title level={5}>{LABEL_ANSWERS}</Typography.Title>
                  <Descriptions bordered column={1} size="small" className="bot-orders-section">
                    {answers.map((answer) => (
                      <Descriptions.Item key={answer.data_input_name} label={formatInputLabel(answer.data_input_name)}>
                        {formatInputValue(answer.data_input_name, answer.value)}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </>
              )}

              <Typography.Title level={5}>{LABEL_RPA_LOG}</Typography.Title>
              <pre className="bot-orders-rpa-log">{rpaLog}</pre>

              {screenshotUrl && (
                <div className="bot-orders-screenshot">
                  <Typography.Title level={5}>{LABEL_SCREENSHOT}</Typography.Title>
                  <img
                    alt={SCREENSHOT_ALT}
                    className="bot-orders-screenshot-image"
                    src={screenshotUrl}
                  />
                </div>
              )}

              <div className="bot-orders-footer">
                <AdminActionButton action="back" label={BACK_TO_LIST_LABEL} onClick={goToList} />
              </div>
            </>
          )}
        </Spin>
      </div>
    </AdminPage>
  );
};

export default BotOrderDetail;
