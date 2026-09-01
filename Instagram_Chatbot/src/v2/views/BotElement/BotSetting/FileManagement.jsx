import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space } from 'antd';
import noImage from './../../../assets/img/no-image.jpg';
import api from 'api/api-management';
import axios from 'axios';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  AdminPage,
  AdminTable,
  AdminConfirmModal,
  AdminActionButton,
  useAdminHeaderActions,
} from '../../../components/AdminShell';

function FileManagement() {
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [typeFilePreview, setTypeFilePreview] = useState('');
  const [srcPreview, setSrcPreview] = useState('');
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const inputRef = useRef(null);
  const [fileError, setFileError] = useState('');
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [idFile, setIdFile] = useState();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchFiles = (pageIndex) => {
    setLoading(true);
    api
      .get(`/api/v1/managements/file?page=${pageIndex}`)
      .then((res) => {
        if (res.data.data !== [] && res.data.total !== 0) {
          setFiles(res.data?.data || []);
          setTotal(res.data?.total || 0);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) tokenExpired();
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFiles(1);
  }, []);

  function handleChangeFile(e) {
    setNewFile(e.target.files[0]);
    setFileError('');
  }

  function handleSave() {
    if (!newFile) return;
    const type = newFile.name.split('.')[1].toLowerCase();
    const trueFile = ['jpeg', 'jpg', 'png', 'pdf', 'mp4', 'gif'].includes(type);
    if (!trueFile) {
      setFileError('jpeg/ jpg/ png/ pdf/ mp4/ gifのファイルを入力が必要です。');
      return;
    }
    if (type !== 'pdf' && type !== 'mp4' && newFile.size / 1024 / 1024 > 2) {
      setFileError('2MB以下のファイルをアップロードしてください。');
      return;
    }
    if (type === 'pdf' && newFile.size / 1024 / 1024 > 3) {
      setFileError('3MB以下のファイルをアップロードしてください。');
      return;
    }
    const video = document.getElementById('preview-video');
    if (type === 'mp4' && video?.duration > 15) {
      setFileError('15秒以下のビデオをアップロードしてください。');
      return;
    }
    const file = {
      user_file: {
        file_type: type,
        size: newFile.size,
        timeplay: `${type === 'mp4' ? video.duration : ''}`,
      },
    };
    api
      .post(`/api/v1/managements/file/upload`, file)
      .then((res) => {
        const urlFile = res.data.data.url;
        const filePost = { user_file: { file_type: type, file_url: res.data.data.path } };
        let typeUpload = type === 'mp4' ? 'video/mp4' : type === 'pdf' ? 'application/pdf' : `image/${type}`;
        axios
          .put(urlFile, newFile, { headers: { 'Content-Type': typeUpload } })
          .then(() => {
            api.post(`/api/v1/managements/file`, filePost).then((res) => {
              if (res.data.code == 1) {
                message.success('正常にファイル追加されました！');
                fetchFiles(page);
                setNewFile(null);
              } else {
                message.error('ファイルの追加ができませんでした。');
              }
            });
          });
      })
      .catch((err) => {
        if (err.response?.data.code === 0) tokenExpired();
      });
  }

  function handlePreview(file) {
    setSrcPreview(`https://ec-chatbot.s3.ap-northeast-1.amazonaws.com/${file.file_url}`);
    setTypeFilePreview(file.file_url.split('.')[1].toLowerCase());
    setIsOpenPreview(true);
  }

  function handleDelete() {
    api
      .delete(`/api/v1/managements/file/${idFile}`)
      .then((res) => {
        setIsOpenDelete(false);
        if (res.data.code == 1) {
          message.success('正常に削除されました！');
          fetchFiles(page);
        } else {
          message.error('削除できませんでした。');
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) tokenExpired();
      });
  }

  function handleCopy(file_url) {
    navigator.clipboard.writeText(file_url);
    message.success('正常にURLをコピーしました！');
  }

  useAdminHeaderActions(
    <AdminActionButton
      action="upload"
      disabled={newFile !== null}
      onClick={() => inputRef.current?.click()}
    />
  );

  const columns = [
    {
      title: '番号',
      width: 70,
      render: (_, __, i) => i + 1 + 25 * (page - 1),
    },
    { title: 'タイプ', dataIndex: 'file_type', width: 100 },
    {
      title: 'URL',
      dataIndex: 'file_url',
      render: (url) => `https://ec-chatbot.s3.ap-northeast-1.amazonaws.com/${url}`,
      ellipsis: true,
    },
    {
      title: 'アクション',
      width: 260,
      render: (_, file) => {
        const fullUrl = `https://ec-chatbot.s3.ap-northeast-1.amazonaws.com/${file.file_url}`;
        return (
          <Space wrap className="admin-table-actions">
            <AdminActionButton action="preview" iconOnly onClick={() => handlePreview(file)} />
            <AdminActionButton action="copy" iconOnly onClick={() => handleCopy(fullUrl)} />
            <AdminActionButton action="delete" iconOnly onClick={() => { setIsOpenDelete(true); setIdFile(file.id); }} />
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <AdminPage>
        <input hidden ref={inputRef} type="file" onChange={handleChangeFile} />
        <AdminTable
          loading={loading}
          columns={columns}
          dataSource={files}
          rowKey="id"
          toolbar={
            newFile ? (
              <div className="admin-variable-new-row" style={{ margin: 0 }}>
                {['jpeg', 'jpg', 'png', 'gif'].includes(newFile.name.split('.')[1]) ? (
                  <img src={URL.createObjectURL(newFile)} alt={newFile.name} style={{ maxHeight: 120 }} />
                ) : newFile.name.split('.')[1] === 'mp4' ? (
                  <video id="preview-video" controls style={{ maxWidth: 300 }}>
                    <source src={URL.createObjectURL(newFile)} type="video/mp4" />
                  </video>
                ) : (
                  <img src={noImage} alt="" style={{ maxHeight: 120 }} />
                )}
                <p>{newFile.name}</p>
                <Space className="admin-form-actions">
                  <AdminActionButton action="cancel" onClick={() => setNewFile(null)} />
                  <AdminActionButton action="save" onClick={handleSave} />
                </Space>
                {fileError && <div className="admin-client-form-error">{fileError}</div>}
              </div>
            ) : null
          }
          pagination={{
            current: page,
            total,
            pageSize: 25,
            onChange: (p) => {
              setPage(p);
              fetchFiles(p);
              window.scrollTo(0, 0);
            },
          }}
        />
      </AdminPage>

      <Modal open={isOpenPreview} onCancel={() => setIsOpenPreview(false)} footer={<Button onClick={() => setIsOpenPreview(false)}>閉じる</Button>} width={720} title="プレビュー">
        {typeFilePreview === 'mp4' ? (
          <video style={{ width: '100%' }} controls><source src={srcPreview} type="video/mp4" /></video>
        ) : typeFilePreview === 'pdf' ? (
          <embed style={{ width: '100%', height: 500 }} src={srcPreview} />
        ) : (
          <img src={srcPreview} alt="" style={{ width: '100%' }} />
        )}
      </Modal>

      <AdminConfirmModal
        open={isOpenDelete}
        message="本当にファイルを削除しますか。"
        onOk={handleDelete}
        onCancel={() => setIsOpenDelete(false)}
        danger
      />
    </>
  );
}

export default FileManagement;
