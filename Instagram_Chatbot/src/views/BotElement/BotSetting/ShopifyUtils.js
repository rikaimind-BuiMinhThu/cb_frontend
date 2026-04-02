import api from "api/api-management";

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
  const merchandiseId = state?.merchanseId;
  const email = getResponseValue(allResponses, "email", objParam.email);
  const zip_code_address = getResponseValue(allResponses, "zip_code_address", objParam.zip_code_address);

  if (merchandiseId && email && zip_code_address) {
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
      lines: [{ merchandiseId, quantity }],
      scenario_id: state.scenarioId, uuid: state.uuid
    }).then(res => {
      sessionStorage.setItem("cart", JSON.stringify(res?.data?.data));
      const url = res?.data?.data?.cartCreate?.cart?.checkoutUrl;
      if (url) {
        try {
          if (window.top && window.top !== window.self) {
            window.top.location.href = url;
          } else {
            window.location.href = url;
          }
        } catch (e) {
          window.open(url, "_top");
        }
      }
      return res;
    });
  }
};

export { createOrAddLinesCart, resolveProvinceForShopify };
