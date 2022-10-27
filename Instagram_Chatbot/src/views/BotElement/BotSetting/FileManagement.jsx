import React from 'react';
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import { Button } from 'react-bootstrap';
import { useRef } from 'react';
import { useState } from 'react';
import ModalShort from './../../../views/Popup/ModalShort';
import noImage from './../../../assets/img/no-image.jpg';
import './../../../assets/css/file-mng.css'


function FileManagement() {

    const [files, setFiles] = useState([]);
    const [newFile, setNewFile] = useState(null);
    const [src, setSrc] = React.useState('');
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const inputRef = useRef(null);

    function handleUpload() {
        inputRef.current.click();
    }

    function handleChangeFile(e) {
        // if (files == []) setFiles([e.target.files[0]]);
        // else {
        //     setFiles([...files, e.target.files[0]]);
        // }

        setNewFile(e.target.files[0]);
    }

    function handleSave() {
        console.log(newFile);
    }


    function handlePreview(file) {
        console.log(file);
        console.log(URL.createObjectURL(file));

        const imageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        if (imageTypes.includes(file.type)) {
            setSrc(URL.createObjectURL(file));
        } else {
            setSrc(noImage)
        }
        setIsOpenPreview(true);
    }

    function handleDelete(file) {

    }

    return (
        <>
            <div className="content">
                <Row id="screenAll">
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <Button className={newFile !== null ? 'disabled' : ''} onClick={() => { handleUpload() }}>Upload File</Button>
                                <input hidden ref={inputRef} type='file' onChange={(e) => handleChangeFile(e)}></input>
                                <div>
                                    {newFile !== null ? (
                                        <div className='file-mng__preview'>
                                            {['image/gif', 'image/jpeg', 'image/png'].includes(newFile.type) ?
                                                (
                                                    <img src={URL.createObjectURL(newFile)} alt={newFile.name} />
                                                ) : <img src={noImage} alt="" />}
                                            <p className='file-mng__preview-name'>{newFile.name}</p>
                                            <p className='file-mng__preview-type'>{newFile.type}</p>
                                            <button className='btn btn-outline-default' onClick={() => { setNewFile(null) }}>Cancle</button>
                                            <button className='btn btn-outline-primary' onClick={() => handleSave()}>Save</button>
                                        </div>
                                    ) : ''}

                                </div>
                            </CardHeader>
                            <CardBody>
                                <Table>
                                    <thead className="text-primary">
                                        <tr>
                                            <th style={{ width: '10%' }}>ID</th>
                                            <th style={{ width: '20%' }}>File name</th>
                                            <th style={{ width: '15%' }}>Type</th>
                                            <th style={{ width: '20%' }}>Size</th>
                                            <th style={{ width: '20%' }}>Url</th>
                                            <th style={{ width: '250px', minWidth: '250px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {files.map((file, i) => (
                                            <tr key={i}>
                                                <td className="file-mng__border-table">{i}</td>
                                                <td className="file-mng__border-table">{file.name}</td>
                                                <td className="file-mng__border-table">{file.type}</td>
                                                <td className="file-mng__border-table">{file.size}</td>
                                                <td className="file-mng__border-table">{URL.createObjectURL(file)}</td>
                                                <td className="file-mng__border-table file-mng__action-table">
                                                    <div className="file-mng__action-wrapper">
                                                        <button className="file-mng__btn-edit" onClick={() => handlePreview(file)}>Preview</button>
                                                        <button className="file-mng__btn-stop">Copy</button>
                                                        <button className="file-mng__btn-delete" onClick={() => handleDelete(file)}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tbody>
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <ModalShort open={isOpenPreview} onClose={() => setIsOpenPreview(false)}>
                    <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
                        <img src={src} />
                    </div>
                </ModalShort>
            </div>
        </>
    );
}

export default FileManagement;