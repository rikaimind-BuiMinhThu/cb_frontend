import api from "api/api-management";

const findShopifyProduct = (allResponses, state) => {
  const types = ["product_purchase", "product_purchase_select_option", "text_with_thumbnail_image"];
  const match = (p, v) => [p.id, p.productVariantId, p.item_number].includes(v);

  const resp = allResponses.findLast(x => types.includes(x.data_input_name));
  if (resp?.text_value) {
    const d = JSON.parse(resp.text_value);
    const p = d.products?.find(x => match(x, d.value || d.initial_selection?.[0]));
    if (p) return p;
  }

  const content = state.messagesList.find(m => m.message_content.some(c => types.includes(c.type)))
    ?.message_content.find(c => types.includes(c.type));
  if (content) {
    const d = content[content.type], v = state.objParam[d?.save_input_content] || d?.value || d?.initial_selection?.[0];
    return d.products?.find(x => match(x, v));
  }
  return null;
};

const getResponseValue = (responses, name, param) =>
  responses.findLast(x => x.data_input_name === name)?.string_value ||
  responses.findLast(x => x.data_input_name === name)?.text_value ||
  param;

const resolveProvinceForShopify = (obj, prefecturesList) => {
  const raw = obj?.value_prefecture ?? obj?.prefecture;
  const list = Array.isArray(prefecturesList) ? prefecturesList : [];

  const shouldResolveById =
    obj?.value_prefecture_type === "id" || typeof raw === "number";

  if (shouldResolveById && raw != null && raw !== "" && list.length) {
    const id = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isNaN(id)) {
      const found = list.find((p) => p.id === id || String(p.id) === String(raw));
      if (found?.name) return found.name;
    }
  }

  if (raw === null || raw === undefined) return "";
  return String(raw);
};

const parseAddress = (zip_code_address, prefecturesList) => {
  if (!zip_code_address) return {};
  try {
    const obj = typeof zip_code_address === "string" ? JSON.parse(zip_code_address) : zip_code_address;
    return {
      zip: obj.value_post_code || (obj.value_post_code_left + obj.value_post_code_right) || obj.post_code || "",
      province: resolveProvinceForShopify(obj, prefecturesList),
      city: obj.value_municipality || obj.municipality || "",
      address1: obj.value_address || obj.address || "",
      address2: obj.value_building_name || obj.building_name || ""
    };
  } catch (e) { return {}; }
};

const parseName = (allResponses, objParam) => {
  let first = getResponseValue(allResponses, "first_name", '');
  let last = getResponseValue(allResponses, "last_name", '');

  if (!first || !last) {
    const uName = getResponseValue(allResponses, "user_name", objParam.user_name);

    const parse = (v) => {
      if (typeof v === "string" && v.startsWith("{")) {
        try { return JSON.parse(v); } catch (e) { return null; }
      }
      return v;
    };

    const n = parse(uName);
    if (n) {
      if (!first) first = n?.valueRight;
      if (!last) last = n?.valueLeft;
    }
  }

  return { firstName: first || "", lastName: last || "" };
};

const createOrAddLinesCart = async (allResponses, state) => {
  const { objParam } = state;
  const product = findShopifyProduct(allResponses, state);
  const email = getResponseValue(allResponses, "email", objParam.email);
  const zip_code_address = getResponseValue(allResponses, "zip_code_address", objParam.zip_code_address);

  if (product && email && zip_code_address) {
    const phone = getResponseValue(allResponses, "phone_number", objParam.phone_number);
    let phoneNumber = phone;
    if (phone && typeof phone !== "string") {
      phoneNumber = phone.value || (phone.value1 + phone.value2 + phone.value3);
    } else if (typeof phone === "string" && phone.startsWith("{")) {
      try {
        const p = JSON.parse(phone);
        phoneNumber = p.value || (p.value1 + p.value2 + p.value3) || phone;
      } catch (e) { }
    }

    const { firstName, lastName } = parseName(allResponses, objParam);
    const { zip, province, city, address1, address2 } = parseAddress(
      zip_code_address,
      state.prefecturesList
    );
    const quantity = allResponses.findLast(x => x.data_input_name === "quantity")?.integer_value || objParam.quantity || 1;

    return api.post("/api/v1/shopify/cart_create", {
      first_name: firstName, last_name: lastName, email, phone: phoneNumber,
      zip, province, city, address1, address2,
      lines: [{ merchandiseId: product.productVariantId || product.id, quantity }],
      scenario_id: state.scenarioId, uuid: state.uuid
    }).then(res => {
      sessionStorage.setItem("cart", JSON.stringify(res?.data?.data));
      const url = res?.data?.data?.cartCreate?.cart?.checkoutUrl;
      if (url) {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
      }
      return res;
    });
  }
};

export { createOrAddLinesCart, resolveProvinceForShopify };
