import { tokenExpired } from 'api/tokenExpired';
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Select, Spin } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import api from '../../../../api/api-management';
import { AdminFormRow, AdminPage } from '../../../../components/AdminShell';
import '../../../../assets/css/bot/payment-gateway-form.css';

function buildPayload(values) {
  const base = {
    gateway_name: values.gateway_name.trim(),
    payment_agency: values.payment_agency,
    mode: values.mode,
  };

  if (values.payment_agency === 'gmo') {
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

function AddPaymentGateway() {
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
        payment_agency: 'gmo',
        mode: 'test',
      });
      return;
    }

    setLoading(true);
    api
      .get(`/api/v1/payment_managements/payment_gateways/${id}`)
      .then((res) => {
        if (res.data.code === 1) {
          const data = res.data.data;
          form.setFieldsValue({
            gateway_name: data.gateway_name,
            payment_agency: data.payment_agency || 'gmo',
            mode: data.mode || 'test',
            shop_id: data.shop_id || '',
            shop_pass: '',
            merchant_code: data.merchant_code || '',
            sp_code: data.sp_code || '',
            terminal_id: data.terminal_id || '',
          });
        } else if (res.data.code === 2) {
          message.error('ゲートウェイが見つかりません。');
          history.push('/admin/payment-gateway');
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
        ? api.patch(`/api/v1/payment_managements/payment_gateways/${id}`, payload)
        : api.post('/api/v1/payment_managements/payment_gateways', payload);

      request
        .then((res) => {
          if (res.data.code === 1) {
            message.success(isEdit ? '更新しました。' : '決済ゲートウェイを追加しました。');
            history.push('/admin/payment-gateway');
          } else if (res.data.code === 2) {
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

  return (
    <AdminPage
      title={isEdit ? '決済ゲートウェイ編集' : '決済ゲートウェイ追加'}
      description="決済代行会社への接続情報を設定します。"
    >
      <Spin spinning={loading}>
        <div className="payment-gateway-form">
          <Form form={form} layout="vertical" disabled={loading}>
            <h3 className="payment-gateway-form-section">基本設定</h3>

            <AdminFormRow label="決済ゲートウェイ名" required>
              <Form.Item
                name="gateway_name"
                rules={[
                  { required: true, whitespace: true, message: '必ず指定してください。' },
                  { max: 50, message: '最大50文字です。' },
                ]}
              >
                <Input placeholder="決済ゲートウェイ名を入力" />
              </Form.Item>
            </AdminFormRow>

            <AdminFormRow label="決済代行会社" required>
              <Form.Item
                name="payment_agency"
                rules={[{ required: true, message: '必ず指定してください。' }]}
              >
                <Select
                  options={[
                    { value: 'gmo', label: 'GMOペイメントゲートウェイ' },
                    { value: 'np_payment', label: 'NP後払い' },
                  ]}
                />
              </Form.Item>
            </AdminFormRow>

            <AdminFormRow label="モード" required>
              <Form.Item
                name="mode"
                rules={[{ required: true, message: '必ず指定してください。' }]}
                className="payment-gateway-form-field-narrow"
              >
                <Select
                  options={[
                    { value: 'test', label: 'テスト' },
                    { value: 'production', label: '本番' },
                  ]}
                />
              </Form.Item>
            </AdminFormRow>

            {paymentAgency === 'gmo' && (
              <>
                <h3 className="payment-gateway-form-section">接続設定（GMO）</h3>

                <AdminFormRow label="ショップID" required>
                  <Form.Item
                    name="shop_id"
                    rules={[
                      { required: true, whitespace: true, message: '入力してください。' },
                      { max: 25, message: '最大25文字です。' },
                    ]}
                  >
                    <Input placeholder="ショップIDを入力" />
                  </Form.Item>
                </AdminFormRow>

                <AdminFormRow
                  label="ショップパスワード"
                  hint={isEdit ? '変更しない場合は空欄のままにしてください。' : undefined}
                >
                  <Form.Item
                    name="shop_pass"
                    normalize={(value) => (value ? value.replace(/\s/g, '') : value)}
                  >
                    <Input.Password placeholder="ショップパスワードを入力" />
                  </Form.Item>
                </AdminFormRow>
              </>
            )}

            {paymentAgency === 'np_payment' && (
              <>
                <h3 className="payment-gateway-form-section">接続設定（NP後払い）</h3>

                <AdminFormRow label="加盟店コード" required>
                  <Form.Item
                    name="merchant_code"
                    rules={[{ required: true, message: '入力してください。' }]}
                  >
                    <Input placeholder="加盟店コードを入力" />
                  </Form.Item>
                </AdminFormRow>

                <AdminFormRow label="SPコード" required>
                  <Form.Item
                    name="sp_code"
                    rules={[{ required: true, message: '入力してください。' }]}
                  >
                    <Input placeholder="SPコードを入力" />
                  </Form.Item>
                </AdminFormRow>

                <AdminFormRow label="ターミナルID" required>
                  <Form.Item
                    name="terminal_id"
                    rules={[{ required: true, message: '入力してください。' }]}
                  >
                    <Input placeholder="ターミナルIDを入力" />
                  </Form.Item>
                </AdminFormRow>
              </>
            )}

            <div className="payment-gateway-form-actions">
              <Link to="/admin/payment-gateway">
                <Button>戻る</Button>
              </Link>
              <Button type="primary" loading={saving} onClick={handleSave}>
                保存
              </Button>
            </div>
          </Form>
        </div>
      </Spin>
    </AdminPage>
  );
}

export default AddPaymentGateway;
