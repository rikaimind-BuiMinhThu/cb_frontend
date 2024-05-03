import React, {useState, useEffect} from 'react';
import api from '../../../../api/api-management';
import {
    Button
} from 'reactstrap';
import {tokenExpired} from 'api/tokenExpired';
import {Radio} from "antd";

function ShopifyReferencePopup({onCancel, onReferProductVariant}) {
    const [productVariantSelected, setProductVariantSelected] = useState(null);
    const [listProductVariants, setListProductVariants] = useState([]);

    useEffect(() => {
        getListProductVariants(null);
    }, [])

    const getListProductVariants = (cursor) => {
        const query = cursor? `cursor=${cursor}` : ""
        api.get(`/api/v1/shopify/product_variants?${query}`).then(res => {
            setListProductVariants(prev => prev.concat(res?.data?.data?.productVariants?.edges));
            const next = res?.data?.data?.productVariants?.pageInfo?.hasNextPage;
            const endCursor = res?.data?.data?.productVariants?.pageInfo?.endCursor;
            if (next) setTimeout(() => getListProductVariants(endCursor), 1000);
        }).catch((error) => {
            console.log(error);
            if (error.response?.data.code === 0) {
                tokenExpired();
            }
        });
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
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            maxHeight: '400px',
                            overflow: 'auto'
                        }}>
                    >
                        {listProductVariants.map(item =>
                            <Radio value={item?.node?.id}>
                                {item?.node?.displayName}
                            </Radio>
                        )}
                    </Radio.Group>
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

