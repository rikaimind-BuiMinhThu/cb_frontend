import React, { useState, useEffect } from 'react';
import api from '../../../../api/api-management';
import Cookies from 'js-cookie';
import {
    S3_UPLOAD_URL
} from '../../../../variables/constants';
import iconPdf from '../../../../assets/img/icons8-pdf-80.png';
import {
    Button
} from 'reactstrap';

function FileReferencePopup({ onCancel, onReferFile, acceptFile = ['image', 'pdf', 'mp4'] }) {

    const [fileType, setFileType] = useState('IMAGE');
    const [dataDataFile, setDataFile] = useState([]);
    const [fileChose, setFileChose] = useState('');

    useEffect(() => {
        api.get(`/api/v1//managements/file`).then(res => {
            console.log(res);
            setDataFile(res.data.data);
        })
    }, [])
    console.log(acceptFile)
    return (
        <React.Fragment>
            <div className="fr-popup-container">
                <div className="fr-popup-header" id="fr-popup-header">
                    {
                        acceptFile.map((item, index) => {
                            return <React.Fragment key={index}>
                                {item === 'image' &&
                                    <div className="fr-popup-header-type"
                                        style={fileType === 'IMAGE' ? { color: '#fff', backgroundColor: '#347AED' } : {}}
                                        onClick={() => setFileType('IMAGE')}
                                    >
                                        画像
                                    </div>}
                                {item === 'pdf' &&
                                    <div className="fr-popup-header-type"
                                        style={fileType === 'PDF' ? { color: '#fff', backgroundColor: '#347AED' } : {}}
                                        onClick={() => setFileType('PDF')}
                                    >
                                        PDF
                                    </div>}
                                {item === 'mp4' &&
                                    <div className="fr-popup-header-type"
                                        style={fileType === 'MP4' ? { color: '#fff', backgroundColor: '#347AED' } : {}}
                                        onClick={() => setFileType('MP4')}
                                    >
                                        ビデオ
                                    </div>
                                }
                            </React.Fragment>;
                        })}
                </div>
                <div className="fr-popup-body">
                    {/* {fileType === 'IMAGE' && */}
                    <React.Fragment>
                        {dataDataFile && dataDataFile.map((item, index) => {
                            console.log(item.file_url === fileChose)
                            if (fileType === 'IMAGE' && item.file_type === 'image') {
                                return (
                                    <div
                                        key={index}
                                        className="fr-popup-body-container"
                                        onClick={() => setFileChose(item.file_url)}
                                        style={fileChose === item.file_url ? { boxShadow: '0 0 5px 5px #93D8FE', border: '1px solid #337BED' } : {}}
                                    >
                                        <div className="fr-popup-body-img">
                                            <img src={S3_UPLOAD_URL + item.file_url} />
                                        </div>
                                        <div className="fr-popup-body-name-img">{item.file_url.split('/')[2]}</div>
                                    </div>
                                )
                            } else if (fileType === 'PDF' && item.file_type === 'pdf') {
                                return (
                                    <div
                                        key={index}
                                        className="fr-popup-body-container"
                                        onClick={() => setFileChose(item.file_url)}
                                        style={fileChose === item.file_url ? { boxShadow: '0 0 5px 5px #93D8FE', border: '1px solid #337BED' } : {}}
                                    >
                                        <div className="fr-popup-body-img">
                                            <img src={iconPdf} />
                                        </div>
                                        <div className="fr-popup-body-name-img">{item.file_url.split('/')[2]}</div>
                                    </div>
                                )
                            } else if (fileType === 'MP4' && item.file_type === 'mp4') {
                                return (
                                    <div
                                        key={index}
                                        className="fr-popup-body-container"
                                        onClick={() => setFileChose(item.file_url)}
                                        style={fileChose === item.file_url ? { boxShadow: '0 0 5px 5px #93D8FE', border: '1px solid #337BED' } : {}}
                                    >
                                        <div className="fr-popup-body-img">
                                            <video src={S3_UPLOAD_URL + item.file_url} controls style={{ width: '100%', height: '100%' }} />
                                        </div>
                                        <div className="fr-popup-body-name-img">{item.file_url.split('/')[2]}</div>
                                    </div>
                                )
                            }
                        }

                        )}
                    </React.Fragment>
                    {/* }
                    {fileType === 'PDF' &&
                        <React.Fragment>
                            {dataDataFile && dataDataFile.map((item, index) => {
                                return (
                                    <React.Fragment></React.Fragment>
                                )
                            })}
                        </React.Fragment>
                    } */}
                </div>
            </div>
            <div className="sl-popup-create-scenario-btn-wrapper">
                <Button
                    className="ss-popup-add-variable-input-close-button"
                    onClick={() => onCancel()}
                >
                    キャンセル
                </Button>
                <Button
                    style={{ backgroundColor: '#024BB9' }}
                    className="ss-popup-add-variable-input-keep-button"
                    onClick={() => onReferFile(S3_UPLOAD_URL + fileChose)}
                >
                    ファイル参照
                </Button>
            </div>
        </React.Fragment>
    )
}

export default FileReferencePopup

