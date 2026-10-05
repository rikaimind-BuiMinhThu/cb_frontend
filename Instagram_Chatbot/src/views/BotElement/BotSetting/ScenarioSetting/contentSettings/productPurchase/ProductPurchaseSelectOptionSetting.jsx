import React from 'react';
import PropTypes from 'prop-types';
import { MDBIcon } from 'mdbreact';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import InputCustom from '../../scenarioComon/InputCustom';
import InputNum from '../../scenarioComon/InputNum';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import SelectCustom from '../../scenarioComon/SelectCustom';
import { dropDownTitle } from '../../constants/scenarioFormConstants';
import ShopifyReferenceSelect from '../../ShopifyReferenceSelect';
import shopifIcon from '../../../../../../assets/img/shopify-icon.png';
import {
  PRODUCT_PURCHASE_SETTING_LABELS,
  SETTING_LABELS,
  SETTING_PLACEHOLDERS,
} from '../../constants/scenarioSettingLabels';
import { PRODUCT_PURCHASE_TYPES } from '../../constants/contentTypeConstants';
import { buildProductPurchaseContext } from './productPurchaseContext';
import '../../styles/contentSettings/productPurchase.css';

const ProductPurchaseSelectOptionSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    handleDragEndProduct,
    handleRemoveItemProductPullDown,
    handleAddItemProductPullDown,
    setIsOpenFileReference,
    setVarFileReference,
    listProductVariants,
  } = props;

  const { productData, changeField, changeProductField } = buildProductPurchaseContext(props);

  const renderRequire = () => (
    <div className="ss-user-setting__item-text_input-top">
      <CheckboxCustom label={SETTING_LABELS.require} onChange={changeField('require')} value={productData.require} />
    </div>
  );

  const renderTitleRequire = () => (
    <div className="ss-user-setting__item-bottom">
      <SelectCustom
        id="title"
        value={productData?.title_require}
        data={dropDownTitle}
        placeholder={SETTING_PLACEHOLDERS.title}
        onChange={changeField('title_require')}
      />
    </div>
  );

  const renderTitle = () => {
    if (productData.title_require !== true) return null;
    return (
      <div className="ss-user-setting__item-bottom">
        <InputCustom placeholder={SETTING_PLACEHOLDERS.title} value={productData.title} onChange={changeField('title')} />
      </div>
    );
  };

  const renderThumbnailProducts = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-setting-panel-muted ss-product-purchase-setting__default-option-panel">
        <InputCustom
          label={SETTING_LABELS.defaultOption}
          className="ss-product-purchase-setting__default-option-input"
          placeholder={SETTING_PLACEHOLDERS.comment}
          value={productData?.display_unselected}
          onChange={changeField('display_unselected')}
        />
        <DragDropContext onDragEnd={(result) => handleDragEndProduct(result, content.id, content.type, 'products')}>
          <Droppable droppableId="customize-pull-down">
            {(provided) => (
              <div className="ss-user-setting-item-pull-down-drag" {...provided.droppableProps} ref={provided.innerRef}>
                {Array.isArray(productData?.products) &&
                  productData.products.map((itemPullDown, indexPullDown, array) => (
                    <Draggable draggable key={itemPullDown.id} draggableId={String(itemPullDown.id)} index={indexPullDown}>
                      {(dragProvided) => (
                        <div {...dragProvided.draggableProps} {...dragProvided.dragHandleProps} ref={dragProvided.innerRef}>
                          <div className="ss-setting-panel-muted ss-product-purchase-setting__drag-item">
                            <div className="ss-user-setting-product-purchase-file-img">
                              <InputCustom
                                className="ss-mg-bottom-5"
                                value={itemPullDown.img_url}
                                onChange={changeProductField(indexPullDown, 'img_url')}
                              />
                              <MDBIcon
                                className="ss-mg-bottom-5"
                                fas
                                icon="folder-open"
                                onClick={() => {
                                  setIsOpenFileReference(true);
                                  setVarFileReference({
                                    indexContent,
                                    contentType: content.type,
                                    subContentType: 'products',
                                    indexSubContent: indexPullDown,
                                    img: 'img_url',
                                  });
                                }}
                              />
                            </div>
                            <div className="ss-user-setting-product-purchase-infor-product">
                              <InputCustom
                                placeholder={SETTING_PLACEHOLDERS.title}
                                className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-left ss-product-purchase-input-left"
                                value={itemPullDown.title}
                                onChange={changeProductField(indexPullDown, 'title')}
                              />
                              <InputCustom
                                placeholder={PRODUCT_PURCHASE_SETTING_LABELS.itemNumber}
                                className="ss-mg-bottom-5 ss-user-setting-product-purchase-input-middle ss-product-purchase-input-middle"
                                value={itemPullDown.item_number}
                                onChange={changeProductField(indexPullDown, 'item_number')}
                              />
                              <InputNum
                                placeholder={PRODUCT_PURCHASE_SETTING_LABELS.price}
                                className="ss-mg-bottom-5 ss-user-setting-input-limit-character ss-product-purchase-input-price"
                                value={itemPullDown.item_price}
                                onChange={changeProductField(indexPullDown, 'item_price')}
                              />
                            </div>
                            <div className="ss-user-setting-product-purchase-file-img">
                              <ShopifyReferenceSelect
                                placeholder={PRODUCT_PURCHASE_SETTING_LABELS.variantId}
                                listProductVariants={listProductVariants}
                                value={itemPullDown.productVariantId}
                                onChange={changeProductField(indexPullDown, 'productVariantId')}
                              />
                              <div className="ss-mg-bottom-5 ss-shopify-icon ss-product-purchase-setting__shopify-icon">
                                <img src={shopifIcon} alt="" />
                              </div>
                            </div>
                            {array.length >= 2 && (
                              <MDBIcon
                                fas
                                className="ss-product-purchase-remove-icon"
                                icon="times-circle"
                                onClick={() =>
                                  handleRemoveItemProductPullDown(
                                    indexMessageSelect,
                                    indexContent,
                                    content.type,
                                    productData.type,
                                    indexPullDown,
                                  )
                                }
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="ss-user-setting__item-bottom ss-product-purchase-setting__add-icon-row">
          <MDBIcon
            fas
            icon="plus-circle"
            className="ss-plus-circle-option-icon"
            onClick={() => handleAddItemProductPullDown(indexMessageSelect, indexContent, content.type, productData.type)}
          />
        </div>
      </div>
    </div>
  );

  const renderTypeBody = () => {
    switch (productData.type) {
      case PRODUCT_PURCHASE_TYPES.TEXT_WITH_THUMBNAIL_IMAGE:
        return renderThumbnailProducts();
      default:
        return null;
    }
  };

  return (
    <>
      {renderRequire()}
      {renderTitleRequire()}
      {renderTitle()}
      {renderTypeBody()}
    </>
  );
};

ProductPurchaseSelectOptionSetting.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  onChangeValueMessageContent: PropTypes.func.isRequired,
  handleDragEndProduct: PropTypes.func.isRequired,
  handleRemoveItemProductPullDown: PropTypes.func.isRequired,
  handleAddItemProductPullDown: PropTypes.func.isRequired,
  setIsOpenFileReference: PropTypes.func.isRequired,
  setVarFileReference: PropTypes.func.isRequired,
  listProductVariants: PropTypes.array,
};

export default ProductPurchaseSelectOptionSetting;
