import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, message, Space } from 'antd';
import { tokenExpired } from 'v2/api/tokenExpired';
import api from 'api/api-management';
import CreateSmsTemplateDialog from './CreateSmsTemplateDialog';
import UpdateSmsTemplateDialog from './UpdateSmsTemplateDialog';
import { AdminPage, AdminTable, AdminConfirmModal, AdminActionButton, useAdminHeaderActions } from '../../../components/AdminShell';

const ListSmsTemplate = () => {
  const { botId } = useParams();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateSuccess = (item) => {
    if (item) setList((pre) => [item, ...pre]);
    setPage(1);
  };

  const onDelete = () => {
    api
      .delete(`/api/v1/managements/sms_templates/${deleteId}`, { params: { chatbot_id: botId } })
      .then((response) => {
        if (response.data.code === 1) {
          message.success('正常に削除しました。');
          setList((pre) => pre.filter((each) => each.id !== deleteId));
          handleCloseDeleteDialog();
        }
      })
      .catch((err) => {
        if (err?.response?.data.code === 0) tokenExpired();
      });
  };

  const handleOpenDeleteDialog = (id) => {
    setOpenDeleteDialog(true);
    setDeleteId(id);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  const handleOpenUpdateDialog = (id) => {
    setOpenUpdateDialog(true);
    setUpdateId(id);
  };

  const handleCloseUpdateDialog = (item) => {
    if (item) {
      setList((pre) => pre.map((each) => (each.id === updateId ? item : each)));
    }
    setOpenUpdateDialog(false);
    setUpdateId(null);
  };

  useEffect(() => {
    const getList = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/v1/managements/sms_templates`, {
          params: { page, chatbot_id: botId },
        });
        if (response.data.code === 1) {
          setList(response.data.data);
          setCount(response.data.total);
        }
      } catch (err) {
        if (err?.response?.data.code === 0) tokenExpired();
      } finally {
        setLoading(false);
      }
    };
    getList();
  }, [page, botId]);

  const columns = [
    {
      title: '番号',
      width: 70,
      render: (_, __, index) => index + 1 + 10 * (page - 1),
    },
    { title: 'テンプレート名', dataIndex: 'name', align: 'center' },
    { title: 'メール内容', dataIndex: 'content', align: 'center', ellipsis: true },
    {
      title: 'アクション',
      align: 'right',
      width: 200,
      render: (_, row) => (
        <Space className="admin-table-actions">
          <AdminActionButton action="edit" onClick={() => handleOpenUpdateDialog(row.id)} />
          <AdminActionButton action="delete" onClick={() => handleOpenDeleteDialog(row.id)} />
        </Space>
      ),
    },
  ];

  useAdminHeaderActions(
    <CreateSmsTemplateDialog botId={botId} resolver={handleCreateSuccess} />
  );

  return (
    <>
      <AdminPage>
        <AdminTable
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey="id"
          pagination={{
            current: page,
            total: count,
            pageSize: 10,
            onChange: setPage,
          }}
        />
      </AdminPage>

      <AdminConfirmModal
        open={openDeleteDialog}
        message="本当に削除しますか。"
        onOk={onDelete}
        onCancel={handleCloseDeleteDialog}
        okText="削除"
        danger
      />

      <UpdateSmsTemplateDialog
        botId={botId}
        resolver={handleCloseUpdateDialog}
        open={openUpdateDialog}
        id={updateId}
      />
    </>
  );
};

export default ListSmsTemplate;
