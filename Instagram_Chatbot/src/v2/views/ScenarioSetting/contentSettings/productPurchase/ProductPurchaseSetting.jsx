import React from 'react';
import PropTypes from 'prop-types';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import CheckboxCustom from '../../scenarioCommon/CheckboxCustom';
import InputCustom from '../../scenarioCommon/InputCustom';
import { Row, Col } from 'antd';
import { dropDownTitle } from '../../constants/scenarioFormConstants';
import {
  PRODUCT_PURCHASE_SETTING_LABELS,
  PRODUCT_PURCHASE_TYPE_OPTIONS,
  SETTING_LABELS,
  SETTING_PLACEHOLDERS,
} from '../../constants/scenarioSettingLabels';
import { PRODUCT_PURCHASE_TYPES, CONTENT_SETTING_TYPES } from '../../constants/contentTypeConstants';
import ContentSettingShell from '../shared/ContentSettingShell';
import ProductListDragDrop from './shared/ProductListDragDrop';
import { buildProductPurchaseContext } from './productPurchaseContext';
import '../../styles/contentSettings/productPurchase.css';

const ProductPurchaseSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    renderRootFaqOption,
    dataInputVar,
    setIsOpenAddVariable,
  } = props;

  const { productData, changeField } = buildProductPurchaseContext(props);

  const renderRequire = () => (
    <div className="ss-user-setting__item-bottom ss-product-purchase-setting__require-row">
      <div className="ss-product-purchase-setting__options-panel">
        <CheckboxCustom label={SETTING_LABELS.require} onChange={changeField('require')} value={productData.require} />
      </div>
    </div>
  );

  const renderTitleAndType = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-user-setting__item-select-bottom-wrapper-flex">
        <SelectCustom
          id="title"
          className="ss-product-purchase-setting__type-row"
          value={productData.title_require}
          data={dropDownTitle}
          onChange={changeField('title_require')}
          keyValue="key"
        />
        <SelectCustom
          id="type"
          allowClear={false}
          className="ss-product-purchase-setting__type-row"
          value={productData.type}
          data={PRODUCT_PURCHASE_TYPE_OPTIONS}
          onChange={changeField('type')}
          keyValue="key"
        />
      </div>
    </div>
  );

  const renderTitle = () => {
    if (productData?.title_require !== true) return null;
    return (
      <div className="ss-user-setting__item-bottom">
        <InputCustom placeholder={SETTING_PLACEHOLDERS.title} onChange={changeField('title')} value={productData.title} />
      </div>
    );
  };

  const renderDisplayOptions = () => (
    <div className="ss-user-setting__item-bottom">
      <Row className="ss-product-purchase-setting__options-panel">
        <Col xl={4} className="ss-product-purchase-setting__checkbox-col">
          <CheckboxCustom
            label={PRODUCT_PURCHASE_SETTING_LABELS.quantityDesignation}
            value={productData.quantity_designation_all}
            onChange={changeField('quantity_designation_all')}
          />
        </Col>
        <Col xl={5} className="ss-product-purchase-setting__checkbox-col">
          <CheckboxCustom
            label={PRODUCT_PURCHASE_SETTING_LABELS.productNumberDisplay}
            value={productData.product_number_display}
            onChange={changeField('product_number_display')}
          />
        </Col>
        <Col xl={3} className="ss-product-purchase-setting__checkbox-col">
          <CheckboxCustom
            label={PRODUCT_PURCHASE_SETTING_LABELS.priceDisplay}
            value={productData.price_display}
            onChange={changeField('price_display')}
          />
        </Col>
        <Col xl={4} className="ss-product-purchase-setting__checkbox-col">
          <CheckboxCustom
            label={PRODUCT_PURCHASE_SETTING_LABELS.productNameDisplay}
            value={productData.product_name_display}
            onChange={changeField('product_name_display')}
          />
        </Col>
        <Col xl={5} className="ss-product-purchase-setting__checkbox-col">
          <CheckboxCustom
            label={PRODUCT_PURCHASE_SETTING_LABELS.multiplePurchase}
            value={productData.multiple_item_purchase}
            onChange={(value) => {
              const selectArr = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection];
              if (value === false && selectArr.length > 0) {
                changeField('initial_selection')([selectArr[0]]);
              }
              changeField('multiple_item_purchase')(value);
            }}
          />
        </Col>
      </Row>
    </div>
  );

  const renderTypeBody = () => {
    switch (productData.type) {
      case PRODUCT_PURCHASE_TYPES.TEXT_WITH_THUMBNAIL_IMAGE:
      case PRODUCT_PURCHASE_TYPES.TEXT_WITH_IMAGE:
        return (
          <div className="ss-user-setting__item-bottom">
            <ProductListDragDrop props={props} showQuantityOptions showInitialSelection />
          </div>
        );
      case PRODUCT_PURCHASE_TYPES.CONSUME_API_RESPONSE:
      default:
        return null;
    }
  };

  return (
    <ContentSettingShell
      contentType={CONTENT_SETTING_TYPES.PRODUCT_PURCHASE}
      contentData={productData}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
      className="ss-product-purchase-setting"
    >
      {renderRequire()}
      {renderTitleAndType()}
      {renderTitle()}
      {renderDisplayOptions()}
      {productData.type !== PRODUCT_PURCHASE_TYPES.CONSUME_API_RESPONSE && renderTypeBody()}
    </ContentSettingShell>
  );
};

ProductPurchaseSetting.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
  onChangeValueMessageContent: PropTypes.func.isRequired,
  renderRootFaqOption: PropTypes.func,
  dataInputVar: PropTypes.array,
  setIsOpenAddVariable: PropTypes.func.isRequired,
  handleDragEndRadioCheckbox: PropTypes.func.isRequired,
  setIsOpenFileReference: PropTypes.func.isRequired,
  setVarFileReference: PropTypes.func.isRequired,
};

export default ProductPurchaseSetting;
