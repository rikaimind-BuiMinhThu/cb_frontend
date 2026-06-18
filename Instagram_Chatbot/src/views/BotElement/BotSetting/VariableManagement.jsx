import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Space, Tabs, Typography, message } from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Cookies from 'js-cookie';
import api from '../../../api/api-management';
import { tokenExpired } from 'api/tokenExpired';
import { AdminConfirmModal, AdminPage, AdminTable } from '../../../components/AdminShell';

const PAGE_SIZE = 25;

const SYSTEM_VARIABLES = [
  { name: 'current_url', description: 'ボットを開いたページのURL' },
  {
    name: 'current_url_param',
    description: 'ボットを開いたページのURLについてるパラメータ（「?」以降の文字列）',
  },
  { name: 'current_url_title', description: 'ボットを開いたwebページのタイトルZ' },
  {
    name: 'user_id',
    description: 'ボットを使用するユーザーごとに自動的に付与されるユニークなID',
  },
  { name: 'bot_id', description: 'ボットのID' },
  {
    name: 'preview_flg',
    description: 'プレビュー機能の使用ユーザーのフラグ（通常ユーザーは空）',
  },
  { name: 'user_ip_address', description: 'アクセスしたユーザーのIPアドレス' },
  { name: 'user_country', description: 'IPアドレスから割り出した国名' },
  { name: 'user_city', description: 'IPアドレスから割り出した市区町村' },
  {
    name: 'user_device',
    description: 'ユーザーが使用しているデバイスの種類（PC、スマホ、タブレット）',
  },
  { name: 'user_browser', description: 'ユーザーが使用しているブラウザの種類' },
  {
    name: 'user_agent',
    description: 'ユーザーが使用しているブラウザ情報とOS情報（各種類、バージョンなど）',
  },
  { name: 'cv_datetime', description: 'ユーザーがシナリオの終端まできた時の日時' },
  {
    name: 'cv_flg',
    description:
      'ユーザーがシナリオの終端まできた時にフラグ（終端まできたユーザーは「1」の値、途中のユーザーは「0」の値を返す）',
  },
  { name: 'start_datetime', description: 'チャットボットを開き最初に会話をした日時' },
  {
    name: 'user_referer_firstopen',
    description: '最初に開いた時のユーザーのリファラル（サイトに訪れる前に滞在していたページのURL）',
  },
  {
    name: 'user_referer_current',
    description: '最後に開いた時のユーザーのリファラル（サイトに訪れる前に滞在していたページのURL）',
  },
];

function validateVariableName(name) {
  if (!name?.trim()) {
    return '変数名は、必ず指定してください。';
  }
  if (name.length > 30) {
    return '変数名は30文字以内で入力してください。';
  }
  return null;
}

function VariableManagement() {
  const botId = Cookies.get('bot_id');
  const [tab, setTab] = useState('user');
  const [variables, setVariables] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [newVariable, setNewVariable] = useState({ variable_name: '', default_value: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  const fetchVariables = useCallback(
    (pageIndex, name = searchQuery) => {
      if (!botId) {
        return;
      }

      setLoading(true);
      api
        .get(`/api/v1/managements/chatbots/${botId}/variables`, {
          params: { page: pageIndex, name },
        })
        .then((res) => {
          setVariables(res.data.data || []);
          setTotal(res.data.total || 0);
        })
        .catch((err) => {
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        })
        .finally(() => setLoading(false));
    },
    [botId, searchQuery]
  );

  useEffect(() => {
    fetchVariables(page);
  }, [fetchVariables, page]);

  const handleSearch = () => {
    setSearchQuery(search);
    setPage(1);
  };

  const updateField = (id, field, value) => {
    setVariables((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[`${id}-${field}`];
      return next;
    });
  };

  const handleSave = (item) => {
    const nameError = validateVariableName(item.variable_name);
    if (nameError) {
      setFieldErrors((prev) => ({
        ...prev,
        [`${item.id}-variable_name`]: nameError,
      }));
      return;
    }

    api
      .patch(`/api/v1/managements/chatbots/${botId}/variables/${item.id}`, {
        variable: {
          variable_name: item.variable_name,
          default_value: item.default_value || '',
        },
      })
      .then((res) => {
        if (res.data.code === 1) {
          message.success('更新しました。');
          fetchVariables(page);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  };

  const handleCreate = () => {
    const nameError = validateVariableName(newVariable.variable_name);
    if (nameError) {
      setFieldErrors({ new_variable_name: nameError });
      return;
    }

    api
      .post(`/api/v1/managements/chatbots/${botId}/variables`, {
        variable: {
          variable_name: newVariable.variable_name,
          default_value: newVariable.default_value || '',
        },
      })
      .then((res) => {
        if (res.data.code === 1) {
          message.success('保存しました。');
          setAddingNew(false);
          setNewVariable({ variable_name: '', default_value: '' });
          setFieldErrors({});
          fetchVariables(page);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  };

  const handleDelete = () => {
    api
      .delete(`/api/v1/managements/chatbots/${botId}/variables/${deleteId}`)
      .then((res) => {
        if (res.data.code === 1) {
          message.success('削除しました。');
          setDeleteId(null);
          fetchVariables(page);
        } else {
          message.error('削除できませんでした。');
          setDeleteId(null);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  };

  const userColumns = useMemo(
    () => [
      {
        title: 'No.',
        width: 70,
        align: 'center',
        render: (_, __, index) => (page - 1) * PAGE_SIZE + index + 1,
      },
      {
        title: '変数名',
        dataIndex: 'variable_name',
        width: '28%',
        render: (value, row) => (
          <div>
            <Input
              className="admin-variable-input"
              value={value || ''}
              placeholder="変数名をご入力ください"
              status={fieldErrors[`${row.id}-variable_name`] ? 'error' : undefined}
              onChange={(e) => updateField(row.id, 'variable_name', e.target.value)}
            />
            {fieldErrors[`${row.id}-variable_name`] && (
              <Typography.Text type="danger" style={{ fontSize: 12 }}>
                {fieldErrors[`${row.id}-variable_name`]}
              </Typography.Text>
            )}
          </div>
        ),
      },
      {
        title: 'デフォルト値',
        dataIndex: 'default_value',
        render: (value, row) => (
          <Input
            className="admin-variable-input"
            value={value || ''}
            placeholder="変数値をご入力ください"
            onChange={(e) => updateField(row.id, 'default_value', e.target.value)}
          />
        ),
      },
      {
        title: 'アクション',
        align: 'right',
        width: 180,
        render: (_, row) => (
          <Space size={4} wrap={false} className="admin-table-actions">
            <Button
              size="small"
              icon={<SaveOutlined />}
              onClick={() => handleSave(row)}
            >
              保存
            </Button>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => setDeleteId(row.id)}
            >
              削除
            </Button>
          </Space>
        ),
      },
    ],
    [fieldErrors, page]
  );

  const systemColumns = useMemo(
    () => [
      {
        title: 'No.',
        width: 70,
        align: 'center',
        render: (_, __, index) => index + 1,
      },
      {
        title: '変数名',
        dataIndex: 'name',
        width: 220,
        render: (name) => (
          <Typography.Text code style={{ fontSize: 13 }}>
            {name}
          </Typography.Text>
        ),
      },
      {
        title: '変数備考',
        dataIndex: 'description',
        render: (description) => (
          <Typography.Text type="secondary">{description}</Typography.Text>
        ),
      },
    ],
    []
  );

  const userToolbar = (
    <Space wrap size={12}>
      <Input
        placeholder="変数検索..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onPressEnter={handleSearch}
        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
        allowClear
        style={{ width: 240 }}
      />
      <Button type="primary" onClick={handleSearch}>
        検索
      </Button>
      <Button
        icon={<PlusOutlined />}
        onClick={() => setAddingNew(true)}
        disabled={addingNew}
      >
        追加
      </Button>
    </Space>
  );

  const userTabContent = (
    <>
      <AdminTable
        loading={loading}
        toolbar={userToolbar}
        columns={userColumns}
        dataSource={variables}
        rowKey="id"
        emptyDescription="変数がありません"
        pagination={{
          current: page,
          total,
          pageSize: PAGE_SIZE,
          onChange: (nextPage) => {
            setPage(nextPage);
            window.scrollTo(0, 0);
          },
        }}
      />

      {addingNew && (
        <div className="admin-variable-new-row">
          <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>
            新しい変数を追加
          </Typography.Text>
          <Space wrap align="start" size={12} style={{ width: '100%' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <Input
                placeholder="変数名をご入力ください"
                value={newVariable.variable_name}
                status={fieldErrors.new_variable_name ? 'error' : undefined}
                onChange={(e) => {
                  setNewVariable((prev) => ({
                    ...prev,
                    variable_name: e.target.value,
                  }));
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.new_variable_name;
                    return next;
                  });
                }}
              />
              {fieldErrors.new_variable_name && (
                <Typography.Text type="danger" style={{ fontSize: 12 }}>
                  {fieldErrors.new_variable_name}
                </Typography.Text>
              )}
            </div>
            <Input
              placeholder="変数値をご入力ください"
              value={newVariable.default_value}
              onChange={(e) =>
                setNewVariable((prev) => ({
                  ...prev,
                  default_value: e.target.value,
                }))
              }
              style={{ flex: 1, minWidth: 220 }}
            />
            <Space>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleCreate}>
                保存
              </Button>
              <Button
                onClick={() => {
                  setAddingNew(false);
                  setNewVariable({ variable_name: '', default_value: '' });
                  setFieldErrors({});
                }}
              >
                キャンセル
              </Button>
            </Space>
          </Space>
        </div>
      )}
    </>
  );

  return (
    <>
      <AdminPage
        title="変数管理"
        description="※ユーザの入力内容などを保管する変数です。シナリオの中で代入や参照ができます。"
      >
        <Tabs
          activeKey={tab}
          onChange={setTab}
          className="admin-page-tabs"
          items={[
            {
              key: 'user',
              label: 'ユーザー定義関数',
              children: userTabContent,
            },
            {
              key: 'system',
              label: 'システム変数',
              children: (
                <AdminTable
                  columns={systemColumns}
                  dataSource={SYSTEM_VARIABLES}
                  rowKey="name"
                  pagination={false}
                  emptyDescription="システム変数がありません"
                />
              ),
            },
          ]}
        />
      </AdminPage>

      <AdminConfirmModal
        open={Boolean(deleteId)}
        message="変数を削除しますか。"
        okText="削除"
        danger
        onOk={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}

export default VariableManagement;
