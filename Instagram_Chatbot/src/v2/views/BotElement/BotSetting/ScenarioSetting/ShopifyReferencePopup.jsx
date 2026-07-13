import React, { useState, useEffect } from 'react';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { Radio } from 'antd';
import ScenarioModalFooter from './components/modals/shared/ScenarioModalFooter';
import { AdminInfoTooltip } from '../../../../components/AdminShell';
import { SCENARIO_MODAL_TOOLTIPS } from './components/modals/shared/scenarioModalTooltips';

function ShopifyReferencePopup({ onCancel, onReferProductVariant }) {
  const [productVariantSelected, setProductVariantSelected] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [listProductVariants, setListProductVariants] = useState([]);

  useEffect(() => {
    getListProductVariants(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getListProductVariants = (cursor) => {
    const query = cursor ? `cursor=${cursor}` : '';
    api.get(`/api/v1/shopify/product_variants?${query}`).then((res) => {
      setListProductVariants((prev) => prev.concat(res?.data?.data?.productVariants?.edges));
      const next = res?.data?.data?.productVariants?.pageInfo?.hasNextPage;
      const endCursor = res?.data?.data?.productVariants?.pageInfo?.endCursor;
      if (next) setTimeout(() => getListProductVariants(endCursor), 1000);
    }).catch((error) => {
      if (error.response?.data.code === 0) {
        tokenExpired();
      }
    });
  };

  const onChangeProductVariant = (e) => {
    setDisplayName(listProductVariants.find((x) => x.node.id === e.target.value).node.displayName);
    setProductVariantSelected(e.target.value);
  };

  return (
    <div className="ss-settings-shopify-ref">
      <div className="fr-popup-container" style={{ minHeight: '300px' }}>
        <div style={{ padding: '5px 5px 12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
          <span>商品バリアントを選択</span>
          <AdminInfoTooltip text={SCENARIO_MODAL_TOOLTIPS.shopifyVariant} />
        </div>
        <div style={{ padding: '5px' }}>
          <Radio.Group
            value={productVariantSelected}
            onChange={onChangeProductVariant}
            className="ss-settings-shopify-list"
          >
            {listProductVariants.map((item) => (
              <Radio key={item?.node?.id} value={item?.node?.id}>
                {item?.node?.displayName}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </div>
      <ScenarioModalFooter
        onClose={onCancel}
        onConfirm={() => onReferProductVariant(productVariantSelected, displayName)}
        closeLabel="キャンセル"
        confirmLabel="設定"
      />
    </div>
  );
}

export default ShopifyReferencePopup;
