import React, { useEffect } from 'react';
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import { Button } from 'react-bootstrap';
import { useRef } from 'react';
import { useState } from 'react';
import ModalShort from './../../../views/Popup/ModalShort';
import noImage from './../../../assets/img/no-image.jpg';
import './../../../assets/css/file-mng.css';
import api from '../../../api/api-management';
import axios from 'axios';
import ModalDetail from 'views/Popup/Modal';
import { tokenExpired } from 'api/tokenExpired';
import ModalNoti from 'views/Popup/ModalNoti';
import { Pagination } from '@material-ui/lab';

function FileManagement() {
  // states
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [typeFilePreview, setTypeFilePreview] = useState('');
  const [srcPreview, setSrcPreview] = useState('');
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const inputRef = useRef(null);
  const [fileError, setFileError] = useState('');
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [idFile, setIdFile] = useState();
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);

  // side effects
  useEffect(() => {
    api
      .get(`/api/v1/managements/file?page=1`)
      .then((res) => {
        // console.log('file management: ', res.data);
        setFiles(res.data?.data);
        setTotalPage(Math.ceil(res.data?.total / 25));
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  function handleUpload() {
    inputRef.current.click();
    setFileError('');
  }

  function reload(pageIndex) {
    api
      .get(`/api/v1/managements/file?page=${pageIndex}`)
      .then((res) => {
        // console.log('file management: ', res.data);
        setFiles(res.data?.data);
        setTotalPage(Math.ceil(res.data?.total / 25));
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  // handle change page
  const handleChangePage = (event, value) => {
    if (totalPage > 1) {
      setPage(parseInt(value));
      setPageIndex(value);
      reload(value);
      document.querySelector('.main-panel').scrollTop = 0;
    }
  };

  function handleChangeFile(e) {
    setNewFile(e.target.files[0]);
  }

  //'jpeg', 'jpg', 'png': <=2mb
  //pdf: <=3mb
  //mp4: 15s
  function handleSave() {
    console.log(newFile);
    const type = newFile.name.split('.')[1].toLowerCase();
    const trueFile = ['jpeg', 'jpg', 'png', 'pdf', 'mp4'].includes(type);
    let file;
    if (trueFile) {
      if (type != 'pdf' && type != 'mp4' && newFile.size / 1024 / 1024 > 2) {
        setFileError(`2MB以下のファイルをアップロードしてください。`);
        return;
      } else if (type === 'pdf' && newFile.size / 1024 / 1024 > 3) {
        setFileError(`3MB以下のファイルをアップロードしてください。`);
        return;
      } else if (type === 'mp4') {
        const vid = document.getElementById('preview-video');
        console.log(vid.duration);
        if (vid.duration > 15) {
          setFileError(`15秒以下のビデオをアップロードしてください。`);
          return;
        }
      }
      const video = document.getElementById('preview-video');
      file = {
        user_file: {
          file_type: type,
          size: newFile.size,
          timeplay: `${type == 'mp4' ? video.duration : ''}`,
        },
      };
      api
        .post(`/api/v1/managements/file/upload`, file)
        .then((res) => {
          // console.log('res upload file type: ', res);
          const urlFile = res.data.data.url;
          let filePost = { user_file: { file_type: type, file_url: res.data.data.path } };
          let typeUpload = '';
          if (type == 'mp4') {
            typeUpload = 'video/mp4';
          } else if (type == 'pdf') {
            typeUpload = 'application/pdf';
          } else {
            typeUpload = `image/${type}`;
          }

          axios
            .put(urlFile, newFile, {
              headers: {
                'Content-Type': typeUpload,
              },
            })
            .then((res) => {
              console.log('response`: ', res);
              api
                .post(`/api/v1/managements/file`, filePost)
                .then((res) => {
                  if (res.data.code == 1) {
                    reload();
                    setMsgNoti(`正常にファイル追加されました！`);
                    setIsOpenNoti(true);
                    setNewFile(null);
                    setTimeout(() => {
                      setIsOpenNoti(false);
                      setMsgNoti(``);
                    }, 2000);
                  } else {
                    setMsgNoti(`ファイルの追加ができませんでした。`);
                    setIsOpenNoti(true);
                    setTimeout(() => {
                      setIsOpenNoti(false);
                      setMsgNoti(``);
                    }, 2000);
                  }
                })
                .catch((err) => {
                  console.log(err);
                  if (err.response?.data.code === 0) {
                    tokenExpired();
                  }
                });
            })
            .catch((err) => {
              console.log('err: ', err);
              if (err.response?.data.code === 0) {
                tokenExpired();
              }
            });
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.data.code === 0) {
            tokenExpired();
          }
        });
    } else {
      setFileError(`jpeg/ jpg/ png/ pdf/ mp4のファイルを入力が必要です。`);
    }
  }

  function handlePreview(file) {
    console.log(file);
    setSrcPreview(`https://ec-chatbot.s3.ap-northeast-1.amazonaws.com/${file.file_url}`);
    setTypeFilePreview(file.file_url.split('.')[1].toLowerCase());
    setIsOpenPreview(true);
  }

  function openDelete(id) {
    setIsOpenDelete(true);
    setIdFile(id);
  }

  function handleDelete() {
    api
      .delete(`/api/v1/managements/file/${idFile}`)
      .then((res) => {
        if (res.data.code == 1) {
          setIsOpenDelete(false);
          setMsgNoti(`正常に削除されました！`);
          setIsOpenNoti(true);
          reload();
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``);
          }, 2000);
        } else {
          setMsgNoti(`削除できませんでした。`);
          setIsOpenNoti(true);
          setTimeout(() => {
            setIsOpenNoti(false);
            setMsgNoti(``);
          }, 2000);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function handleCopy(file_url) {
    navigator.clipboard.writeText(file_url);
    setMsgNoti(`正常にURLをコピーしました！`);
    setIsOpenNoti(true);
    setTimeout(() => {
      setIsOpenNoti(false);
      setMsgNoti(``);
    }, 2000);
  }

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <Button
                  className={newFile !== null ? 'disabled' : ''}
                  onClick={() => {
                    handleUpload();
                  }}
                >
                  ファイル追加
                </Button>
                <input
                  hidden
                  ref={inputRef}
                  type="file"
                  onChange={(e) => handleChangeFile(e)}
                ></input>
                <div>
                  {newFile !== null ? (
                    <>
                      <div className="file-mng__preview">
                        {['jpeg', 'jpg', 'png'].includes(newFile.name.split('.')[1]) ? (
                          <img src={URL.createObjectURL(newFile)} alt={newFile.name} />
                        ) : (
                          <>
                            {newFile.name.split('.')[1] == 'mp4' ? (
                              <div className="file-mng__preview-video">
                                <video id="preview-video" controls>
                                  <source src={URL.createObjectURL(newFile)} type="video/mp4" />
                                </video>
                              </div>
                            ) : (
                              <img src={noImage} alt="" />
                            )}
                          </>
                        )}
                        <p className="file-mng__preview-name">{newFile.name}</p>
                        <p className="file-mng__preview-type">{newFile.name.split('.')[1]}</p>
                        <button
                          className="btn btn-outline-default"
                          onClick={() => {
                            setNewFile(null);
                          }}
                        >
                          ファイル追加
                        </button>
                        <button className="btn btn-outline-primary" onClick={() => handleSave()}>
                        保存
                        </button>
                      </div>
                      <span className="file-mng__error">{fileError}</span>
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </CardHeader>
              <CardBody>
                <Table>
                  <thead className="text-primary">
                    <tr>
                      <th style={{ width: '10%' }}>No.</th>
                      <th style={{ width: '15%' }}>タイプ</th>
                      <th style={{ width: '70%' }}>URL</th>
                      <th style={{ width: '250px', minWidth: '250px' }}>アアクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, i) => (
                      <tr key={i}>
                        <td className="file-mng__border-table">{i + 1 + 25 * (pageIndex - 1)}</td>
                        <td className="file-mng__border-table">{file.file_type}</td>
                        <td className="file-mng__border-table">{`https://ec-chatbot.s3.ap-northeast-1.amazonaws.com/${file.file_url}`}</td>
                        <td className="file-mng__border-table file-mng__action-table">
                          <div className="file-mng__action-wrapper">
                            <button
                              className="file-mng__btn-preview"
                              onClick={() => handlePreview(file)}
                            >
                              プレビュー
                            </button>
                            <button
                              className="file-mng__btn-copy"
                              onClick={() => {
                                handleCopy(
                                  `https://ec-chatbot.s3.ap-northeast-1.amazonaws.com/${file.file_url}`
                                );
                              }}
                            >
                              コピー
                            </button>
                            <button
                              className="file-mng__btn-delete"
                              onClick={() => openDelete(file.id)}
                            >
                              削除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination
                  count={totalPage}
                  variant="outlined"
                  page={page}
                  onChange={handleChangePage}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <ModalDetail open={isOpenPreview} onClose={() => setIsOpenPreview(false)}>
          <div className="file-mng__preview_img">
            {typeFilePreview == 'mp4' ? (
              <video style={{ width: '100%' }} controls>
                <source src={srcPreview} type="video/mp4" />
              </video>
            ) : (
              <>
                {typeFilePreview == 'pdf' ? (
                  <embed style={{ width: '100%', height: '90%' }} src={srcPreview} />
                ) : (
                  <img src={srcPreview} alt="" />
                )}
              </>
            )}
            <Button onClick={() => setIsOpenPreview(false)}>閉じる</Button>
          </div>
        </ModalDetail>

        <ModalShort open={isOpenDelete} onClose={() => setIsOpenDelete(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>本当にファイルを削除しますか。</h4>
            <Button onClick={() => handleDelete()}>はい</Button>
            <Button onClick={() => setIsOpenDelete(false)}>いいえ</Button>
          </div>
        </ModalShort>

        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <span style={{ fontSize: '16px' }}>{msgNoti}</span>
          </div>
        </ModalNoti>
      </div>
    </>
  );
}

export default FileManagement;
