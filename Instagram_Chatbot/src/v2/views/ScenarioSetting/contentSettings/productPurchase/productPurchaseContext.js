export const buildProductPurchaseContext = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    onChangeValueMessageContent,
    dataMessages,
    setDataMessages,
  } = props;

  const contentKey = content.type;
  const productData = content[contentKey];

  const changeField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, field);

  const changeProductField = (indexProduct, field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, field);

  const addProduct = (defaults = {}) => {
    const products = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].products];
    const idMax = products.length !== 0 ? Math.max(...products.map((item) => item.id)) + 1 : 1;
    products.push({ id: idMax, quantity_select: 1, is_quantity_designation: false, ...defaults });
    dataMessages[indexMessageSelect].message_content[indexContent][content.type].products = products;
    setDataMessages([...dataMessages]);
  };

  const removeProduct = (indexProduct, itemId) => {
    const products = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].products];
    const nextProducts = products.filter((_, index) => index !== indexProduct);
    dataMessages[indexMessageSelect].message_content[indexContent][content.type].products = nextProducts;
    dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection =
      dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection.filter((item) => item !== itemId);
    setDataMessages([...dataMessages]);
  };

  const toggleInitialSelection = (itemId, multiple) => {
    const current = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection];
    if (multiple) {
      const next = current.includes(itemId) ? current.filter((item) => item !== itemId) : [...current, itemId];
      dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection = next;
    } else {
      dataMessages[indexMessageSelect].message_content[indexContent][content.type].initial_selection =
        current.includes(itemId) ? [] : [itemId];
    }
    setDataMessages([...dataMessages]);
  };

  return {
    productData,
    changeField,
    changeProductField,
    addProduct,
    removeProduct,
    toggleInitialSelection,
  };
};
