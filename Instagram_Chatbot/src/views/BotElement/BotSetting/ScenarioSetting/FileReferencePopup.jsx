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
import { tokenExpired } from 'api/tokenExpired';
import Pagination from '@material-ui/lab/Pagination';

function FileReferencePopup({ onCancel, onReferFile, acceptFile = ['image', 'pdf', 'mp4'] }) {

    const [fileType, setFileType] = useState('image');
    const [dataFile, setDataFile] = useState([]);
    const [fileChose, setFileChose] = useState('');
    var [pageIndex, setPageIndex] = useState(1);
    var [totalPage, setTotalPage] = useState();
    var [page, setPage] = useState(1);

    useEffect(() => {
        getListFile(1);
    }, [fileType])

    const getListFile = (pgIndex) => {
        api.get(`/api/v1//managements/file?page=${pgIndex}&file_type=${fileType}`).then(res => {
            console.log(res);
            setDataFile(res.data.data);
            let totalPage = Math.ceil(res?.data?.total / 25);
            setTotalPage(totalPage);
        }).catch((error) => {
            console.log(error);
            if (error.response?.data.code === 0) {
                tokenExpired();
            }
        });
    }

    function handleChange(event, value) {
        console.log(value);
        if (totalPage > 1) {
            // console.log('pageIndex: ', value);
            setPage(parseInt(value));
            setPageIndex(value);
            getListFile(value);
            // window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    return (
        <React.Fragment>
            <div className="fr-popup-container">
                <div className="fr-popup-header" id="fr-popup-header">
                    {
                        acceptFile.map((item, index) => {
                            return <React.Fragment key={index}>
                                {item === 'image' &&
                                    <div className="fr-popup-header-type"
                                        style={fileType === 'image' ? { color: '#fff', backgroundColor: '#347AED' } : {}}
                                        onClick={() => {
                                            setFileType('image');
                                            setPage(1);
                                        }}
                                    >
                                        画像
                                    </div>}
                                {item === 'pdf' &&
                                    <div className="fr-popup-header-type"
                                        style={fileType === 'pdf' ? { color: '#fff', backgroundColor: '#347AED' } : {}}
                                        onClick={() => {
                                            setFileType('pdf');
                                            setPage(1);
                                        }}
                                    >
                                        PDF
                                    </div>}
                                {item === 'mp4' &&
                                    <div className="fr-popup-header-type"
                                        style={fileType === 'mp4' ? { color: '#fff', backgroundColor: '#347AED' } : {}}
                                        onClick={() => {
                                            setFileType('mp4');
                                            setPage(1);
                                        }}
                                    >
                                        ビデオ
                                    </div>
                                }
                            </React.Fragment>;
                        })}
                </div>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Pagination
                        count={totalPage}
                        variant="outlined"
                        page={page}
                        onChange={handleChange}
                    />
                </div>
                <div id="fr-popup-body" className="fr-popup-body">

                    {/* {fileType === 'image' && */}
                    <React.Fragment>
                        {dataFile && dataFile.map((item, index) => {
                            console.log(item.file_url === fileChose)
                            if (fileType === 'image' && item.file_type === 'image') {
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
                            } else if (fileType === 'pdf' && item.file_type === 'pdf') {
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
                            } else if (fileType === 'mp4' && item.file_type === 'mp4') {
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
                    {fileType === 'pdf' &&
                        <React.Fragment>
                            {dataFile && dataFile.map((item, index) => {
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

