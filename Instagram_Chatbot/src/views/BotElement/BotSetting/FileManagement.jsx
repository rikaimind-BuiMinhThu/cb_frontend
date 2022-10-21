import React from 'react';
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col } from 'reactstrap';
import { Button } from 'react-bootstrap';
import { useRef } from 'react';
import { useState } from 'react';
import ModalShort from './../../../views/Popup/ModalShort';
import noImage from './../../../assets/img/no-image.jpg';


function FileManagement() {

    const [files, setFiles] = useState([]);
    const [src, setSrc] = React.useState('');
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const inputRef = useRef(null);

    function handleUpload() {
        inputRef.current.click();
    }

    function handleChangeFile(e) {
        console.log(e.target.files[0]);
        if (files == []) setFiles([e.target.files[0]]);
        else {
            setFiles([...files, e.target.files[0]]);
        }
        console.log(files);
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
                                <Button onClick={() => { handleUpload() }}>Upload File</Button>
                                <input hidden ref={inputRef} type='file' onChange={(e) => handleChangeFile(e)}></input>
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
                                                <td className="border-table-bot">{i}</td>
                                                <td className="border-table-bot">{file.name}</td>
                                                <td className="border-table-bot">{file.type}</td>
                                                <td className="border-table-bot">{file.size}</td>
                                                <td className="border-table-bot">{URL.createObjectURL(file)}</td>
                                                <td className="border-table-bot action-table-bot">
                                                    <div className="action-wrapper">
                                                        <button className="btn-edit-bot" onClick={() => handlePreview(file)}>Preview</button>
                                                        <button className="btn-stop-bot">Copy</button>
                                                        <button className="btn-delete-bot" onClick={() => handleDelete(file)}>Delete</button>
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