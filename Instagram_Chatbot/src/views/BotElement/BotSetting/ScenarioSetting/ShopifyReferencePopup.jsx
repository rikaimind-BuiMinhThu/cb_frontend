import React, {useState, useEffect} from 'react';
import api from '../../../../api/api-management';
import {
    S3_UPLOAD_URL
} from '../../../../variables/constants';
import iconPdf from '../../../../assets/img/icons8-pdf-80.png';
import {
    Button
} from 'reactstrap';
import {tokenExpired} from 'api/tokenExpired';
import Pagination from '@material-ui/lab/Pagination';
import {Radio} from "antd";

function ShopifyReferencePopup({onCancel, onReferProductVariant}) {
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPage, setTotalPage] = useState();
    const [page, setPage] = useState(1);
    const [productVariantSelected, setProductVariantSelected] = useState(null);
    const [listProductVariants, setListProductVariants] = useState([]);

    useEffect(() => {
        getListProductVariants(1);
    }, [])

    const getListProductVariants = (pgIndex) => {
        api.get(`/api/v1/shopify/product_variants`).then(res => {
            setListProductVariants(res?.data?.data?.productVariants?.edges || []);
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
            setPage(parseInt(value));
            setPageIndex(value);
            getListProductVariants(value);
        }
    }

    const onChangeProductVariant = (e) => {
        setProductVariantSelected(e.target.value);
    }

    return (
        <React.Fragment>
            <div className="fr-popup-container" style={{minHeight: '300px'}}>
                <div style={{padding: '5px'}}>
                    <Radio.Group
                        value={productVariantSelected}
                        onChange={onChangeProductVariant}
                        style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    >
                        {listProductVariants.map(item =>
                            <Radio value={item?.node?.id}>
                                {item?.node?.displayName}
                            </Radio>
                        )}
                    </Radio.Group>
                </div>
                {/*<div style={{marginTop: '10px', display: 'flex', justifyContent: 'flex-end'}}>*/}
                {/*    <Pagination*/}
                {/*        count={totalPage}*/}
                {/*        variant="outlined"*/}
                {/*        page={page}*/}
                {/*        onChange={handleChange}*/}
                {/*    />*/}
                {/*</div>*/}
            </div>
            <div className="sl-popup-create-scenario-btn-wrapper">
                <Button
                    className="ss-popup-add-variable-input-close-button"
                    onClick={() => onCancel()}
                >
                    キャンセル
                </Button>
                <Button
                    style={{backgroundColor: '#024BB9'}}
                    className="ss-popup-add-variable-input-keep-button"
                    onClick={() => onReferProductVariant(productVariantSelected)}
                >
                    設定
                </Button>
            </div>
        </React.Fragment>
    )
}

export default ShopifyReferencePopup

