import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../../../scenarioComon/InputCustom';
import InputNum from '../../../scenarioComon/InputNum';
import CheckboxCustom from '../../../scenarioComon/CheckboxCustom';
import ShopifyReferenceSelect from '../../../ShopifyReferenceSelect';
import shopifIcon from '../../../../../../../assets/img/shopify-icon.png';
import {
  PRODUCT_PURCHASE_SETTING_LABELS,
  SETTING_BUTTON_LABELS,
  SETTING_PLACEHOLDERS,
} from '../../../constants/scenarioSettingLabels';
import { buildProductPurchaseContext } from '../productPurchaseContext';

const ProductListDragDrop = ({
  props,
  showQuantityOptions = true,
  showShopifyVariant = false,
  showInitialSelection = true,
}) => {
  const {
    content,
    handleDragEndRadioCheckbox,
    setIsOpenFileReference,
    setVarFileReference,
    listProductVariants,
  } = props;

  const { productData, changeProductField, addProduct, removeProduct, toggleInitialSelection } =
    buildProductPurchaseContext(props);

  const renderProductItem = (itemProduct, indexProduct, array) => (
    <Draggable draggable key={itemProduct.id} draggableId={String(itemProduct.id)} index={indexProduct}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <div
            className={`ss-user-setting-product-purchase-container ${array.length > 1 ? 'ss-product-purchase-setting__product-container--spaced' : ''}`.trim()}
          >
            <div className="ss-user-setting-product-purchase-file-img">
              <InputCustom
                className="ss-mg-bottom-5"
                value={itemProduct.img_url}
                onChange={changeProductField(indexProduct, 'img_url')}
              />
              <MDBIcon
                className="ss-mg-bottom-5"
                fas
                icon="folder-open"
                onClick={() => {
                  setIsOpenFileReference(true);
                  setVarFileReference({
                    indexContent: props.indexContent,
                    contentType: content.type,
                    subContentType: 'products',
                    indexSubContent: indexProduct,
                    img: 'img_url',
                  });
                }}
              />
            </div>
            <div className="ss-user-setting-product-purchase-infor-product">
              <InputCustom
                placeholder={SETTING_PLACEHOLDERS.title}
                className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-left ss-product-purchase-input-left"
                value={itemProduct.title}
                onChange={changeProductField(indexProduct, 'title')}
              />
              <InputCustom
                placeholder={PRODUCT_PURCHASE_SETTING_LABELS.itemNumber}
                className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-middle ss-product-purchase-input-middle"
                value={itemProduct.item_number}
                onChange={changeProductField(indexProduct, 'item_number')}
              />
              <InputNum
                placeholder={PRODUCT_PURCHASE_SETTING_LABELS.price}
                className="ss-mg-bottom-5 ss-user-setting-input-limit-character ss-product-purchase-input-price"
                value={itemProduct.item_price}
                onChange={changeProductField(indexProduct, 'item_price')}
              />
            </div>
            {showQuantityOptions && (
              <div className="ss-user-setting-product-purchase-sub-infor">
                <div className="ss-product-purchase-setting__half-col">
                  <InputNum
                    className="ss-user-setting-input-limit-character ss-mg-bottom-5 ss-product-purchase-quantity-limit"
                    label={PRODUCT_PURCHASE_SETTING_LABELS.quantityLimit}
                    value={itemProduct.quantity_limit}
                    onChange={changeProductField(indexProduct, 'quantity_limit')}
                  />
                </div>
                {productData.price_display && (
                  <div className="ss-product-purchase-setting__half-col">
                    <InputCustom
                      className="ss-mg-bottom-5"
                      label={PRODUCT_PURCHASE_SETTING_LABELS.priceDisplayCustom}
                      value={itemProduct.price_display_custom}
                      onChange={changeProductField(indexProduct, 'price_display_custom')}
                    />
                  </div>
                )}
              </div>
            )}
            {showQuantityOptions && (
              <div className="ss-user-setting-product-purchase-sub-infor">
                {showInitialSelection && (
                  <div className="ss-product-purchase-setting__half-col">
                    <CheckboxCustom
                      label={PRODUCT_PURCHASE_SETTING_LABELS.initialSelection}
                      value={productData.initial_selection.includes(itemProduct.id)}
                      onChange={() => toggleInitialSelection(itemProduct.id, productData.multiple_item_purchase)}
                    />
                  </div>
                )}
                {productData.quantity_designation_all === false && (
                  <div className="ss-product-purchase-setting__half-col">
                    <CheckboxCustom
                      label={PRODUCT_PURCHASE_SETTING_LABELS.quantityDesignation}
                      value={itemProduct.is_quantity_designation}
                      onChange={changeProductField(indexProduct, 'is_quantity_designation')}
                    />
                  </div>
                )}
              </div>
            )}
            {showShopifyVariant && (
              <div className="ss-user-setting-product-purchase-file-img">
                <ShopifyReferenceSelect
                  placeholder={PRODUCT_PURCHASE_SETTING_LABELS.variantId}
                  listProductVariants={listProductVariants}
                  value={itemProduct.productVariantId}
                  onChange={changeProductField(indexProduct, 'productVariantId')}
                />
                <div className="ss-mg-bottom-5 ss-shopify-icon ss-product-purchase-setting__shopify-icon">
                  <img src={shopifIcon} alt="" />
                </div>
              </div>
            )}
            {array.length > 1 && (
              <div className="ss-user-setting-product-purchase-times-icons">
                <MDBIcon fas icon="times-circle" onClick={() => removeProduct(indexProduct, itemProduct.id)} />
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );

  const renderDragList = () => (
    <DragDropContext onDragEnd={(result) => handleDragEndRadioCheckbox(result, content.id, content.type, 'products')}>
      <Droppable droppableId="product-purchase">
        {(provided) => (
          <div className="ss-user-setting-item-product-purchase" {...provided.droppableProps} ref={provided.innerRef}>
            {Array.isArray(productData?.products) && productData.products.map(renderProductItem)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  const renderAddButton = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-product-purchase-setting__add-wrap">
        <Button className="ss-product-purchase-setting__add-btn" onClick={() => addProduct()}>
          {SETTING_BUTTON_LABELS.add}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {renderDragList()}
      {renderAddButton()}
    </>
  );
};

ProductListDragDrop.propTypes = {
  props: PropTypes.object.isRequired,
  showQuantityOptions: PropTypes.bool,
  showShopifyVariant: PropTypes.bool,
  showInitialSelection: PropTypes.bool,
};

export default ProductListDragDrop;
