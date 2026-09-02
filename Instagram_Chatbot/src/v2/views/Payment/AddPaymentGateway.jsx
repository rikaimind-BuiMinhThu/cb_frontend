import { tokenExpired } from 'v2/api/tokenExpired';
import React, { useEffect, useState } from 'react';
import { Form, Input, message, Select, Spin } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import api from 'v2/api/api-management';
import { AdminFormRow, AdminPage, AdminActionButton, useAdminHeaderTitle, useAdminHeaderActions } from 'v2/components/AdminShell';
import { getAdminRoutePath } from 'v2/variables/constants';
import { API_SUCCESS_CODE } from 'v2/api/constants';
import {
  AGENCY_GMO,
  AGENCY_GMO_LABEL,
  AGENCY_NP,
  AGENCY_NP_LABEL,
  API_WARNING_CODE,
  GATEWAY_NAME_MAX,
  GATEWAYS_API_PATH,
  HINT_SHOP_PASS,
  INPUT_REQUIRED,
  LABEL_AGENCY,
  LABEL_GATEWAY_NAME,
  LABEL_MERCHANT_CODE,
  LABEL_MODE,
  LABEL_SHOP_ID,
  LABEL_SHOP_PASS,
  LABEL_SP_CODE,
  LABEL_TERMINAL_ID,
  MAX_25,
  MAX_50,
  MODE_PRODUCTION,
  MODE_PRODUCTION_LABEL,
  MODE_TEST,
  MODE_TEST_LABEL,
  NOT_FOUND,
  PAGE_DESCRIPTION,
  PAYMENT_GATEWAY_LIST_PATH,
  PLACEHOLDER_GATEWAY_NAME,
  PLACEHOLDER_MERCHANT_CODE,
  PLACEHOLDER_SHOP_ID,
  PLACEHOLDER_SHOP_PASS,
  PLACEHOLDER_SP_CODE,
  PLACEHOLDER_TERMINAL_ID,
  REQUIRED_MESSAGE,
  SECTION_BASIC,
  SECTION_GMO,
  SECTION_NP,
  SHOP_ID_MAX,
  SUCCESS_ADDED,
  SUCCESS_UPDATED,
  TITLE_ADD,
  TITLE_EDIT,
} from './gatewayFormConstants';
import 'v2/assets/css/bot/payment-gateway-form.css';

const buildPayload = (values) => {
  const base = {
    gateway_name: values.gateway_name.trim(),
    payment_agency: values.payment_agency,
    mode: values.mode,
  };

  if (values.payment_agency === AGENCY_GMO) {
    return {
      payment: {
        ...base,
        shop_id: values.shop_id.trim(),
        shop_pass: values.shop_pass || '',
        merchant_code: '',
        sp_code: '',
        terminal_id: '',
        client_ip: '',
        store_id: '',
      },
    };
  }

  return {
    payment: {
      ...base,
      shop_id: '',
      shop_pass: '',
      merchant_code: values.merchant_code,
      sp_code: values.sp_code,
      terminal_id: values.terminal_id,
      client_ip: '',
      store_id: '',
    },
  };
}

const AddPaymentGateway = () => {
  const { id } = useParams();
  const history = useHistory();
  const isEdit = Boolean(id);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const paymentAgency = Form.useWatch('payment_agency', form);

  useEffect(() => {
    if (!isEdit) {
      form.setFieldsValue({
        payment_agency: AGENCY_GMO,
        mode: MODE_TEST,
      });
      return;
    }

    setLoading(true);
    api
      .get(`${GATEWAYS_API_PATH}/${id}`)
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          const data = res.data.data;
          form.setFieldsValue({
            gateway_name: data.gateway_name,
            payment_agency: data.payment_agency || AGENCY_GMO,
            mode: data.mode || MODE_TEST,
            shop_id: data.shop_id || '',
            shop_pass: '',
            merchant_code: data.merchant_code || '',
            sp_code: data.sp_code || '',
            terminal_id: data.terminal_id || '',
          });
        } else if (res.data.code === API_WARNING_CODE) {
          message.error(NOT_FOUND);
          history.push(getAdminRoutePath(PAYMENT_GATEWAY_LIST_PATH));
        }
      })
      .catch((error) => {
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }, [form, history, id, isEdit]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      const payload = buildPayload(values);
      setSaving(true);

      const request = isEdit
        ? api.patch(`${GATEWAYS_API_PATH}/${id}`, payload)
        : api.post(GATEWAYS_API_PATH, payload);

      request
        .then((res) => {
          if (res.data.code === API_SUCCESS_CODE) {
            message.success(isEdit ? SUCCESS_UPDATED : SUCCESS_ADDED);
            history.push(getAdminRoutePath(PAYMENT_GATEWAY_LIST_PATH));
          } else if (res.data.code === API_WARNING_CODE) {
            message.warning(res.data.message);
          }
        })
        .catch((error) => {
          if (error.response?.data?.code === 0) {
            tokenExpired();
          }
        })
        .finally(() => setSaving(false));
    });
  };

  useAdminHeaderTitle(isEdit ? TITLE_EDIT : TITLE_ADD);

  useAdminHeaderActions(
    <>
      <Link to={getAdminRoutePath(PAYMENT_GATEWAY_LIST_PATH)}>
        <AdminActionButton action="back" />
      </Link>
      <AdminActionButton action="save" loading={saving} onClick={handleSave} />
    </>
  );

  return (
    <AdminPage description={PAGE_DESCRIPTION}>
      <Spin spinning={loading}>
        <div className="payment-gateway-form">
          <Form form={form} layout="vertical" disabled={loading}>
            <h3 className="payment-gateway-form-section">{SECTION_BASIC}</h3>

            <AdminFormRow label={LABEL_GATEWAY_NAME} required>
              <Form.Item
                name="gateway_name"
                rules={[
                  { required: true, whitespace: true, message: REQUIRED_MESSAGE },
                  { max: GATEWAY_NAME_MAX, message: MAX_50 },
                ]}
              >
                <Input placeholder={PLACEHOLDER_GATEWAY_NAME} />
              </Form.Item>
            </AdminFormRow>

            <AdminFormRow label={LABEL_AGENCY} required>
              <Form.Item
                name="payment_agency"
                rules={[{ required: true, message: REQUIRED_MESSAGE }]}
              >
                <Select
                  options={[
                    { value: AGENCY_GMO, label: AGENCY_GMO_LABEL },
                    { value: AGENCY_NP, label: AGENCY_NP_LABEL },
                  ]}
                />
              </Form.Item>
            </AdminFormRow>

            <AdminFormRow label={LABEL_MODE} required>
              <Form.Item
                name="mode"
                rules={[{ required: true, message: REQUIRED_MESSAGE }]}
                className="payment-gateway-form-field-narrow"
              >
                <Select
                  options={[
                    { value: MODE_TEST, label: MODE_TEST_LABEL },
                    { value: MODE_PRODUCTION, label: MODE_PRODUCTION_LABEL },
                  ]}
                />
              </Form.Item>
            </AdminFormRow>

            {paymentAgency === AGENCY_GMO && (
              <>
                <h3 className="payment-gateway-form-section">{SECTION_GMO}</h3>

                <AdminFormRow label={LABEL_SHOP_ID} required>
                  <Form.Item
                    name="shop_id"
                    rules={[
                      { required: true, whitespace: true, message: INPUT_REQUIRED },
                      { max: SHOP_ID_MAX, message: MAX_25 },
                    ]}
                  >
                    <Input placeholder={PLACEHOLDER_SHOP_ID} />
                  </Form.Item>
                </AdminFormRow>

                <AdminFormRow
                  label={LABEL_SHOP_PASS}
                  hint={isEdit ? HINT_SHOP_PASS : undefined}
                >
                  <Form.Item
                    name="shop_pass"
                    normalize={(value) => (value ? value.replace(/\s/g, '') : value)}
                  >
                    <Input.Password placeholder={PLACEHOLDER_SHOP_PASS} />
                  </Form.Item>
                </AdminFormRow>
              </>
            )}

            {paymentAgency === AGENCY_NP && (
              <>
                <h3 className="payment-gateway-form-section">{SECTION_NP}</h3>

                <AdminFormRow label={LABEL_MERCHANT_CODE} required>
                  <Form.Item
                    name="merchant_code"
                    rules={[{ required: true, message: INPUT_REQUIRED }]}
                  >
                    <Input placeholder={PLACEHOLDER_MERCHANT_CODE} />
                  </Form.Item>
                </AdminFormRow>

                <AdminFormRow label={LABEL_SP_CODE} required>
                  <Form.Item
                    name="sp_code"
                    rules={[{ required: true, message: INPUT_REQUIRED }]}
                  >
                    <Input placeholder={PLACEHOLDER_SP_CODE} />
                  </Form.Item>
                </AdminFormRow>

                <AdminFormRow label={LABEL_TERMINAL_ID} required>
                  <Form.Item
                    name="terminal_id"
                    rules={[{ required: true, message: INPUT_REQUIRED }]}
                  >
                    <Input placeholder={PLACEHOLDER_TERMINAL_ID} />
                  </Form.Item>
                </AdminFormRow>
              </>
            )}
          </Form>
        </div>
      </Spin>
    </AdminPage>
  );
};

export default AddPaymentGateway;
