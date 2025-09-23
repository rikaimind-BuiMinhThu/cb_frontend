// TODO: Need refactor this file
// This code is used for only Shopify cart system, and using Shopify API
// 2025/09/24, there is no customer using shopify cart system
// -> Not need refactor this file for now

const createOrAddLinesCart = async (res) => {
  const newArr = state.scenarioUserResponses.concat(res.data?.data || [])
  setScenarioUserResponses([...newArr])

  const products = JSON.parse(newArr.findLast(x => x.data_input_name === "text_with_thumbnail_image")?.text_value || null)
  const quantity = newArr.findLast(x => x.data_input_name === "quantity")?.integer_value || 1
  const product = products?.products?.findLast(x => x?.id === products?.initial_selection || x?.productVariantId === products?.value)

  const email = newArr.findLast(x => x.data_input_name === "email")?.string_value || null
  const phone = newArr.findLast(x => x.data_input_name === "phone_number")?.string_value || null
  const user_name = newArr.findLast(x => x.data_input_name === "user_name")?.string_value || null
  const user_name_kana = newArr.findLast(x => x.data_input_name === "user_name_kana")?.string_value || null

  const zip_code_address = newArr.findLast(x => x.data_input_name === "zip_code_address")?.text_value || null

  if (product && quantity && user_name && user_name_kana && email && zip_code_address) {
    let phoneNumber;
    try {
      phoneNumber = `${JSON.parse(phone)?.value1 || ""}${JSON.parse(phone)?.value2 || ""}${JSON.parse(phone)?.value3 || ""}`
    } catch (e) {
      phoneNumber = phone || ""
    }
    await api
      .post('/api/v1/shopify/cart_create', {
        first_name: JSON.parse(user_name)?.valueRight || JSON.parse(user_name_kana)?.valueRight,
        last_name: JSON.parse(user_name)?.valueLeft || JSON.parse(user_name_kana)?.valueLeft,
        email: email || "example@gmail.com",
        phone: phoneNumber,
        zip: JSON.parse(zip_code_address)?.value_post_code || (JSON.parse(zip_code_address)?.value_post_code_left + JSON.parse(zip_code_address)?.value_post_code_right),
        province: JSON.parse(zip_code_address)?.value_prefecture,
        city: JSON.parse(zip_code_address)?.value_municipality,
        address1: JSON.parse(zip_code_address)?.value_address,
        address2: JSON.parse(zip_code_address)?.value_building_name,
        lines: [
          {
            "merchandiseId": product.productVariantId,
            "quantity": quantity
          }
        ],
        scenario_id: state.scenarioId,
        uuid: state.uuid
      })
      .then(async res => {
        sessionStorage.setItem("cart", JSON.stringify(res?.data?.data))
        setCheckoutUrl(res?.data?.data?.cartCreate?.cart?.checkoutUrl)
      })
      .catch(e => {
        console.log(e)
      })
  }
};

export { createOrAddLinesCart };