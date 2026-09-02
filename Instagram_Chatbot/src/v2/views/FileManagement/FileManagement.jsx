import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal, Space } from 'antd';
import noImage from 'v2/assets/img/no-image.jpg';
import api from 'v2/api/api-management';
import axios from 'axios';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  AdminPage,
  AdminTable,
  AdminConfirmModal,
  AdminActionButton,
  useAdminHeaderActions,
} from 'v2/components/AdminShell';
import 'v2/assets/css/file-mng.css';
import {
  ALLOWED_FILE_TYPES,
  API_SUCCESS_CODE,
  BYTES_PER_KB,
  CLOSE_BUTTON,
  COL_ACTIONS,
  COL_ACTIONS_WIDTH,
  COL_NUMBER,
  COL_NUMBER_WIDTH,
  COL_TYPE,
  COL_TYPE_WIDTH,
  COL_URL,
  DELETE_CONFIRM_MESSAGE,
  EMPTY_DURATION,
  ERROR_FILE_ADD,
  ERROR_FILE_DELETE,
  ERROR_FILE_TYPE,
  ERROR_IMAGE_SIZE,
  ERROR_PDF_SIZE,
  ERROR_VIDEO_DURATION,
  FILE_TYPE_MP4,
  FILE_TYPE_PDF,
  FILES_API_PATH,
  FILES_UPLOAD_PATH,
  IMAGE_MAX_MB,
  IMAGE_PREVIEW_TYPES,
  INITIAL_PAGE,
  MIME_APPLICATION_PDF,
  MIME_IMAGE_PREFIX,
  MIME_VIDEO_MP4,
  PAGE_SIZE,
  PDF_MAX_MB,
  PREVIEW_MODAL_WIDTH,
  PREVIEW_TITLE,
  S3_FILE_BASE_URL,
  SUCCESS_FILE_ADDED,
  SUCCESS_FILE_DELETED,
  SUCCESS_URL_COPIED,
  TOKEN_EXPIRED_CODE,
  VIDEO_MAX_SECONDS,
} from './constants';

const buildS3Url = (fileUrl) => `${S3_FILE_BASE_URL}/${fileUrl}`;

const getFileExtension = (fileName) => fileName.split('.')[1]?.toLowerCase();

const getUploadMimeType = (type) => {
  if (type === FILE_TYPE_MP4) return MIME_VIDEO_MP4;
  if (type === FILE_TYPE_PDF) return MIME_APPLICATION_PDF;
  return `${MIME_IMAGE_PREFIX}${type}`;
};

const FileManagement = () => {
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [typeFilePreview, setTypeFilePreview] = useState('');
  const [srcPreview, setSrcPreview] = useState('');
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const inputRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const [fileError, setFileError] = useState('');
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [idFile, setIdFile] = useState();
  const [page, setPage] = useState(INITIAL_PAGE);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchFiles = (pageIndex) => {
    setLoading(true);
    api
      .get(`${FILES_API_PATH}?page=${pageIndex}`)
      .then((res) => {
        if (res.data.data !== [] && res.data.total !== 0) {
          setFiles(res.data?.data || []);
          setTotal(res.data?.total || 0);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === TOKEN_EXPIRED_CODE) tokenExpired();
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFiles(INITIAL_PAGE);
  }, []);

  const handleChangeFile = (e) => {
    setNewFile(e.target.files[0]);
    setFileError('');
  };

  const handleSave = () => {
    if (!newFile) return;
    const type = getFileExtension(newFile.name);
    const trueFile = ALLOWED_FILE_TYPES.includes(type);
    if (!trueFile) {
      setFileError(ERROR_FILE_TYPE);
      return;
    }
    const sizeMb = newFile.size / BYTES_PER_KB / BYTES_PER_KB;
    if (type !== FILE_TYPE_PDF && type !== FILE_TYPE_MP4 && sizeMb > IMAGE_MAX_MB) {
      setFileError(ERROR_IMAGE_SIZE);
      return;
    }
    if (type === FILE_TYPE_PDF && sizeMb > PDF_MAX_MB) {
      setFileError(ERROR_PDF_SIZE);
      return;
    }
    const video = videoPreviewRef.current;
    if (type === FILE_TYPE_MP4 && video?.duration > VIDEO_MAX_SECONDS) {
      setFileError(ERROR_VIDEO_DURATION);
      return;
    }
    const file = {
      user_file: {
        file_type: type,
        size: newFile.size,
        timeplay: `${type === FILE_TYPE_MP4 ? video.duration : EMPTY_DURATION}`,
      },
    };
    api
      .post(FILES_UPLOAD_PATH, file)
      .then((res) => {
        const urlFile = res.data.data.url;
        const filePost = { user_file: { file_type: type, file_url: res.data.data.path } };
        const typeUpload = getUploadMimeType(type);
        axios
          .put(urlFile, newFile, { headers: { 'Content-Type': typeUpload } })
          .then(() => {
            api.post(FILES_API_PATH, filePost).then((saveRes) => {
              if (saveRes.data.code === API_SUCCESS_CODE) {
                message.success(SUCCESS_FILE_ADDED);
                fetchFiles(page);
                setNewFile(null);
              } else {
                message.error(ERROR_FILE_ADD);
              }
            });
          });
      })
      .catch((err) => {
        if (err.response?.data.code === TOKEN_EXPIRED_CODE) tokenExpired();
      });
  };

  const handlePreview = (file) => {
    setSrcPreview(buildS3Url(file.file_url));
    setTypeFilePreview(getFileExtension(file.file_url));
    setIsOpenPreview(true);
  };

  const handleDelete = () => {
    api
      .delete(`${FILES_API_PATH}/${idFile}`)
      .then((res) => {
        setIsOpenDelete(false);
        if (res.data.code === API_SUCCESS_CODE) {
          message.success(SUCCESS_FILE_DELETED);
          fetchFiles(page);
        } else {
          message.error(ERROR_FILE_DELETE);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === TOKEN_EXPIRED_CODE) tokenExpired();
      });
  };

  const handleCopy = (fileUrl) => {
    navigator.clipboard.writeText(fileUrl);
    message.success(SUCCESS_URL_COPIED);
  };

  useAdminHeaderActions(
    <AdminActionButton
      action="upload"
      disabled={newFile !== null}
      onClick={() => inputRef.current?.click()}
    />
  );

  const columns = [
    {
      title: COL_NUMBER,
      width: COL_NUMBER_WIDTH,
      render: (_, __, i) => i + 1 + PAGE_SIZE * (page - 1),
    },
    { title: COL_TYPE, dataIndex: 'file_type', width: COL_TYPE_WIDTH },
    {
      title: COL_URL,
      dataIndex: 'file_url',
      render: (url) => buildS3Url(url),
      ellipsis: true,
    },
    {
      title: COL_ACTIONS,
      width: COL_ACTIONS_WIDTH,
      render: (_, file) => {
        const fullUrl = buildS3Url(file.file_url);
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

  const fileExtension = newFile ? newFile.name.split('.')[1] : '';

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
              <div className="admin-variable-new-row file-mng__upload-row">
                {IMAGE_PREVIEW_TYPES.includes(fileExtension) ? (
                  <img src={URL.createObjectURL(newFile)} alt={newFile.name} className="file-mng__thumb" />
                ) : fileExtension === FILE_TYPE_MP4 ? (
                  <video ref={videoPreviewRef} controls className="file-mng__video-thumb">
                    <source src={URL.createObjectURL(newFile)} type={MIME_VIDEO_MP4} />
                  </video>
                ) : (
                  <img src={noImage} alt="" className="file-mng__thumb" />
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
            pageSize: PAGE_SIZE,
            onChange: (nextPage) => {
              setPage(nextPage);
              fetchFiles(nextPage);
              window.scrollTo(0, 0);
            },
          }}
        />
      </AdminPage>

      <Modal
        open={isOpenPreview}
        onCancel={() => setIsOpenPreview(false)}
        footer={<Button onClick={() => setIsOpenPreview(false)}>{CLOSE_BUTTON}</Button>}
        width={PREVIEW_MODAL_WIDTH}
        title={PREVIEW_TITLE}
      >
        {typeFilePreview === FILE_TYPE_MP4 ? (
          <video className="file-mng__preview-media" controls>
            <source src={srcPreview} type={MIME_VIDEO_MP4} />
          </video>
        ) : typeFilePreview === FILE_TYPE_PDF ? (
          <embed className="file-mng__preview-embed" src={srcPreview} />
        ) : (
          <img src={srcPreview} alt="" className="file-mng__preview-media" />
        )}
      </Modal>

      <AdminConfirmModal
        open={isOpenDelete}
        message={DELETE_CONFIRM_MESSAGE}
        onOk={handleDelete}
        onCancel={() => setIsOpenDelete(false)}
        danger
      />
    </>
  );
};

export default FileManagement;
