import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Descriptions, Modal, Spin, Table, Tag, Typography } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { API_SUCCESS_CODE, BOT_ID_COOKIE_KEY } from 'v2/api/constants';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminActionButton, AdminPage } from 'v2/components/AdminShell';
import { ADMIN_PATHS } from 'v2/components/AdminShell/constants';
import { getAdminRoutePath } from 'v2/variables/constants';
import {
  cleanErrorMessage,
  completedRpaSteps,
  formatCardExpiry,
  formatDateTime,
  formatInputLabel,
  formatInputValue,
  formatRpaStepDetail,
  rpaStepResultLabel,
  showCardFields,
  statusColor,
  statusLabel,
  truncateText,
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
  RPA_COL_ACTION,
  RPA_COL_ERROR,
  RPA_COL_INDEX,
  RPA_COL_RESULT,
  RPA_COL_STEP,
  RPA_COL_TIME,
  RPA_COL_URL,
  RPA_EMPTY_STEPS,
  RPA_LOG_BUTTON,
  RPA_LOG_MODAL_TITLE,
  RPA_NG,
  RPA_OK,
  RPA_STEP_FALLBACK,
  SCREENSHOT_ALT,
} from './constants';
import './styles/bot-orders.css';

const ExternalLink = ({ href, children }) => {
  if (!href) return DASH;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children || href}
    </a>
  );
};

ExternalLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
};

const truncateUrl = (url) => {
  if (!url) return DASH;
  try {
    const parsed = new URL(url);
    const path = `${parsed.pathname}${parsed.search}`.slice(0, 28);
    return `${parsed.host}${path}${path.length >= 28 ? '…' : ''}`;
  } catch {
    return truncateText(url, 36);
  }
};

const BotOrderDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const botId = Cookies.get(BOT_ID_COOKIE_KEY);
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [logStep, setLogStep] = useState(null);
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
  const rpaSteps = useMemo(() => completedRpaSteps(row?.rpa_steps), [row]);
  const errorMessage = useMemo(
    () => (row?.error_message ? cleanErrorMessage(row.error_message) : DASH),
    [row]
  );
  const logDetail = useMemo(() => formatRpaStepDetail(logStep), [logStep]);
  const logModalTitle = logStep
    ? `${RPA_LOG_MODAL_TITLE}: ${logStep.description || logStep.name || RPA_STEP_FALLBACK}`
    : RPA_LOG_MODAL_TITLE;

  const rpaColumns = useMemo(
    () => [
      {
        title: RPA_COL_INDEX,
        key: 'index',
        width: 56,
        render: (_value, _record, index) => index + 1,
      },
      {
        title: RPA_COL_STEP,
        key: 'step',
        render: (_value, step) => (
          <div>
            <div>{step.description || step.name || RPA_STEP_FALLBACK}</div>
            {step.name && step.description && step.name !== step.description && (
              <Typography.Text type="secondary" className="bot-orders-rpa-step-id">
                {step.name}
              </Typography.Text>
            )}
          </div>
        ),
      },
      {
        title: RPA_COL_RESULT,
        key: 'result',
        width: 72,
        render: (_value, step) => {
          const label = rpaStepResultLabel(step.ok);
          if (label === RPA_OK) return <Tag color="success">{RPA_OK}</Tag>;
          if (label === RPA_NG) return <Tag color="error">{RPA_NG}</Tag>;
          return DASH;
        },
      },
      {
        title: RPA_COL_TIME,
        key: 'at',
        width: 160,
        render: (_value, step) => formatDateTime(step.at),
      },
      {
        title: RPA_COL_URL,
        key: 'url',
        ellipsis: true,
        render: (_value, step) => (
          <ExternalLink href={step.url}>{truncateUrl(step.url)}</ExternalLink>
        ),
      },
      {
        title: RPA_COL_ERROR,
        key: 'error',
        ellipsis: true,
        render: (_value, step) =>
          step.ok === false ? truncateText(cleanErrorMessage(step.error)) : DASH,
      },
      {
        title: RPA_COL_ACTION,
        key: 'action',
        width: 88,
        render: (_value, step) => (
          <Button type="link" size="small" onClick={() => setLogStep(step)}>
            {RPA_LOG_BUTTON}
          </Button>
        ),
      },
    ],
    []
  );

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
                <Descriptions.Item label={LABEL_ERROR}>{errorMessage}</Descriptions.Item>
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
              <Table
                className="bot-orders-section bot-orders-rpa-table"
                rowKey={(_step, index) => `${_step.name || 'step'}-${index}-${_step.at || ''}`}
                columns={rpaColumns}
                dataSource={rpaSteps}
                pagination={false}
                size="small"
                locale={{ emptyText: RPA_EMPTY_STEPS }}
              />

              <Modal
                title={logModalTitle}
                visible={Boolean(logStep)}
                onCancel={() => setLogStep(null)}
                footer={null}
                width={640}
                destroyOnClose
              >
                <pre className="bot-orders-rpa-step-detail">{logDetail}</pre>
              </Modal>

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
