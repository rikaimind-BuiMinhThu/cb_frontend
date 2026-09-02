import React, { useState, useEffect } from 'react';
import api from 'v2/api/api-management';
import {
  S3_UPLOAD_URL,
} from '../../../../variables/constants';
import iconPdf from 'v2/assets/img/icons8-pdf-80.png';
import { tokenExpired } from 'v2/api/tokenExpired';
import Pagination from '@material-ui/lab/Pagination';
import ScenarioModalFooter from './components/modals/shared/ScenarioModalFooter';

const FileReferencePopup = ({ onCancel, onReferFile, acceptFile = ['image', 'pdf', 'mp4'] }) => {
  const [fileType, setFileType] = useState('image');
  const [dataFile, setDataFile] = useState([]);
  const [fileChose, setFileChose] = useState('');
  const [totalPage, setTotalPage] = useState();
  const [page, setPage] = useState(1);

  useEffect(() => {
    getListFile(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileType]);

  const getListFile = (pgIndex) => {
    api.get(`/api/v1/managements/file?page=${pgIndex}&file_type=${fileType}`).then((res) => {
      setDataFile(res.data.data);
      const pages = Math.ceil(res?.data?.total / 25);
      setTotalPage(pages);
    }).catch((error) => {
      if (error.response?.data.code === 0) {
        tokenExpired();
      }
    });
  };

  const handleChange = (event, value) => {
    if (totalPage > 1) {
      setPage(parseInt(value, 10));
      getListFile(value);
    }
  };

  const tabClass = (type) => (
    `fr-popup-header-type${fileType === type ? ' fr-popup-header-type--active' : ''}`
  );

  return (
    <div className="ss-settings-file-ref">
      <div className="fr-popup-container">
        <div className="fr-popup-header" id="fr-popup-header">
          {acceptFile.map((item, index) => (
            <React.Fragment key={index}>
              {item === 'image' && (
                <div
                  className={tabClass('image')}
                  onClick={() => {
                    setFileType('image');
                    setPage(1);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setFileType('image')}
                >
                  画像
                </div>
              )}
              {item === 'pdf' && (
                <div
                  className={tabClass('pdf')}
                  onClick={() => {
                    setFileType('pdf');
                    setPage(1);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setFileType('pdf')}
                >
                  PDF
                </div>
              )}
              {item === 'mp4' && (
                <div
                  className={tabClass('mp4')}
                  onClick={() => {
                    setFileType('mp4');
                    setPage(1);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setFileType('mp4')}
                >
                  ビデオ
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="ss-file-ref-pagination">
          <Pagination
            count={totalPage}
            variant="outlined"
            page={page}
            onChange={handleChange}
          />
        </div>
        <div id="fr-popup-body" className="fr-popup-body">
          {dataFile && dataFile.map((item, index) => {
            if (fileType === 'image' && item.file_type === 'image') {
              return (
                <div
                  key={index}
                  className={`fr-popup-body-container${fileChose === item.file_url ? ' fr-popup-body-container--selected' : ''}`}
                  onClick={() => setFileChose(item.file_url)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setFileChose(item.file_url)}
                >
                  <div className="fr-popup-body-img">
                    <img src={S3_UPLOAD_URL + item.file_url} alt="" />
                  </div>
                  <div className="fr-popup-body-name-img">{item.file_url.split('/')[2]}</div>
                </div>
              );
            }
            if (fileType === 'pdf' && item.file_type === 'pdf') {
              return (
                <div
                  key={index}
                  className={`fr-popup-body-container${fileChose === item.file_url ? ' fr-popup-body-container--selected' : ''}`}
                  onClick={() => setFileChose(item.file_url)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setFileChose(item.file_url)}
                >
                  <div className="fr-popup-body-img">
                    <img src={iconPdf} alt="" />
                  </div>
                  <div className="fr-popup-body-name-img">{item.file_url.split('/')[2]}</div>
                </div>
              );
            }
            if (fileType === 'mp4' && item.file_type === 'mp4') {
              return (
                <div
                  key={index}
                  className={`fr-popup-body-container${fileChose === item.file_url ? ' fr-popup-body-container--selected' : ''}`}
                  onClick={() => setFileChose(item.file_url)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setFileChose(item.file_url)}
                >
                  <div className="fr-popup-body-img">
                    <video src={S3_UPLOAD_URL + item.file_url} controls className="ss-media--cover" />
                  </div>
                  <div className="fr-popup-body-name-img">{item.file_url.split('/')[2]}</div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
      <ScenarioModalFooter
        onClose={onCancel}
        onConfirm={() => onReferFile(S3_UPLOAD_URL + fileChose)}
        closeLabel="キャンセル"
        confirmLabel="ファイル参照"
      />
    </div>
  );
}

export default FileReferencePopup;
