import React from 'react';
import SelectCustom from "./scenarioCommon/SelectCustom";

const ShopifyReferenceSelect = ({listProductVariants, value, onChange, placeholder}) => {
    return (
        <SelectCustom
            value={value}
            data={listProductVariants}
            onChange={value => onChange(value)}
            keyValue="key"
            nameValue="value"
            placeholder={placeholder}
        />
    )
}

export default ShopifyReferenceSelect

