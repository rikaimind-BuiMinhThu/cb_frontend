import api from "api/api-management";

const getResponseValue = (state, name) => {
  const row = (state.scenarioUserResponses || []).findLast((x) => x.data_input_name === name);
  const fromRow = row?.string_value || row?.text_value;
  if (fromRow != null && fromRow !== "") return fromRow;
  const p = state.objParam || {};
  if (p[name] != null && p[name] !== "") return p[name];
  if (name === "zip_code_address") {
    for (const k of ["zipcode_address", "zip_code", "post_code"]) {
      if (p[k] != null && p[k] !== "") return p[k];
    }
  }
  return undefined;
};

const parseQuantity = (ti) => {
  if (ti?.save_input_content !== "quantity") return null;
  const n = Number.parseInt(String(ti.text?.value ?? "").trim(), 10);
  if (Number.isNaN(n)) return null;
  return Math.max(1, n);
};

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

const parseName = (state) => {
  let first = getResponseValue(state, "first_name") || "";
  let last = getResponseValue(state, "last_name") || "";
  for (const msg of state.messagesList || []) {
    if (msg.belong_to !== "user") continue;
    for (const c of msg.message_content || []) {
      if (c.type !== "text_input" || !c.text_input?.text?.isSplitInput) continue;
      const ti = c.text_input;
      if (ti.save_input_content !== "user_name") continue;
      const vl = String(ti.text.valueLeft ?? "").trim();
      const vr = String(ti.text.valueRight ?? "").trim();
      if (vl) first = vl || "";
      if (vr) last = vr || "";
    }
  }
  return { firstName: first, lastName: last };
};

const formatPhoneForCart = (state) => {
  const join = (pn) => {
    if (!pn || typeof pn !== "object") return "";
    const a = String(pn.value1 ?? "").trim();
    const b = String(pn.value2 ?? "").trim();
    const c = String(pn.value3 ?? "").trim();
    if (!a && !b && !c) return "";
    return pn.withHyphen ? `${a}-${b}-${c}` : `${a}${b}${c}`;
  };

  let s = "";
  for (const msg of state.messagesList || []) {
    if (msg.belong_to !== "user") continue;
    for (const c of msg.message_content || []) {
      if (c.type !== "text_input" || c.text_input?.type !== "phone_number") continue;
      const out = join(c.text_input.phone_number);
      if (out) s = out;
    }
  }
  if (s) return s;

  let p = state.objParam?.phone_number;
  if (typeof p === "string" && p.trim().startsWith("{")) {
    try {
      p = JSON.parse(p);
    } catch (e) {
      p = null;
    }
  }
  return join(typeof p === "object" ? p : null) || "";
};

const selectionTextFromPullDownCustomization = (pd) => {
  const cust = pd?.customization;
  if (!cust) return null;
  const fromValue =
    cust.value != null && String(cust.value).trim() !== ""
      ? String(cust.value).trim()
      : "";
  const fromInitial =
    pd?.initial_selection != null && String(pd.initial_selection).trim() !== ""
      ? String(pd.initial_selection).trim()
      : "";
  const sel = fromValue || fromInitial;
  if (!sel) return null;
  const opts = cust.is_comment
    ? cust.options_with_comment || []
    : cust.options_without_comment || [];
  let opt = opts.find(
    (o) => String(o.id) === sel || String(o.value) === sel
  );
  if (!opt) {
    const idx = parseInt(sel, 10);
    if (!Number.isNaN(idx)) {
      if (idx >= 1 && opts[idx - 1]) opt = opts[idx - 1];
      if (!opt && opts[idx]) opt = opts[idx];
    }
  }
  const text = opt?.text;
  if (text != null && String(text).trim() !== "") return String(text).trim();
  if (opt?.value != null && String(opt.value).trim() !== "")
    return String(opt.value).trim();
  return sel;
};

const formatDeliveryDateFromPullDown = (pd) => {
  const bucket =
    pd?.type === "date_ymd"
      ? pd.date_ymd
      : pd?.dob_ymd || pd?.date_ymd || {};
  const y = bucket?.valueYear;
  const m = bucket?.valueMonth;
  const d = bucket?.valueDay;
  if (y == null || m == null || d == null) return undefined;
  if (String(y).trim() === "" || String(m).trim() === "" || String(d).trim() === "")
    return undefined;
  return `${y}年${parseInt(String(m), 10)}月${parseInt(String(d), 10)}日`;
};

const formatDeliveryTimeFromPullDown = (pd) => {
  const cust = pd?.customization;
  if (!cust) return undefined;
  const sel =
    cust.value != null && String(cust.value).trim() !== ""
      ? String(cust.value)
      : undefined;
  if (!sel) return undefined;
  const opts = cust.is_comment
    ? cust.options_with_comment || []
    : cust.options_without_comment || [];
  let opt = opts.find(
    (o) => String(o.id) === sel || String(o.value) === sel
  );
  if (!opt) {
    const idx = parseInt(sel, 10);
    if (!Number.isNaN(idx)) {
      if (idx >= 1 && opts[idx - 1]) opt = opts[idx - 1];
      if (!opt && opts[idx]) opt = opts[idx];
    }
  }
  const text = opt?.text;
  return text != null && String(text).trim() !== "" ? String(text).trim() : undefined;
};

const collectCartAttributesFromMessages = (state) => {
  const attrs = [];
  let deliveryDate;
  let deliveryTime;
  for (const msg of state.messagesList || []) {
    for (const c of msg.message_content || []) {
      const pd = c.pull_down;
      const key = pd?.save_input_content;
      if (key === "delivery_date" && deliveryDate == null) {
        deliveryDate = formatDeliveryDateFromPullDown(pd);
      }
      if (key === "delivery_time" && deliveryTime == null) {
        deliveryTime = formatDeliveryTimeFromPullDown(pd);
      }
    }
  }
  if (deliveryDate)
    attrs.push({ key: "配送希望日", value: deliveryDate });
  if (deliveryTime)
    attrs.push({ key: "配送希望時間", value: deliveryTime });
  return attrs;
};

const collectShopLinePropertyAttributesFromMessages = (state) => {
  const attrs = [];
  for (const msg of state.messagesList || []) {
    for (const c of msg.message_content || []) {
      const sic = c.pull_down?.save_input_content;
      if (String(sic ?? "").trim().toLowerCase() !== "option") continue;
      const pd = c.pull_down;
      if (!pd) continue;
      const t = selectionTextFromPullDownCustomization(pd);
      const value = t != null && String(t).trim() !== "" ? String(t).trim() : "";
      attrs.push({ key: "着せ替えシート", value });
    }
  }
  return attrs;
};

const collectShopifyCartLinesFromMessages = (state) => {
  const qtyQueue = [];
  for (const msg of state.messagesList || []) {
    for (const c of msg.message_content || []) {
      const ti = c.text_input;
      if (ti?.save_input_content !== "quantity") continue;
      const raw = parseQuantity(ti);
      qtyQueue.push(raw != null ? raw : 1);
    }
  }
  let qi = 0;
  const nextQty = () => (qi < qtyQueue.length ? qtyQueue[qi++] : 1);
  const mainLineAttrs = collectShopLinePropertyAttributesFromMessages(state);
  const lines = [];

  const midFromState = String(state.merchandiseId ?? "").trim();
  if (midFromState) {
    const line = { merchandiseId: midFromState, quantity: nextQty() };
    if (mainLineAttrs.length) line.attributes = mainLineAttrs;
    lines.push(line);
  }

  for (const msg of state.messagesList || []) {
    for (const c of msg.message_content || []) {
      if (c.type !== "product_purchase_select_option") continue;
      const mid = String(c?.product_purchase_select_option?.value ?? "").trim();
      if (!mid) continue;
      lines.push({ merchandiseId: mid, quantity: nextQty() });
    }
  }
  return lines;
};

const toStorefrontCartLineInput = (line) => {
  const qty = Math.max(1, parseInt(line.quantity, 10) || 1);
  const out = { merchandiseId: line.merchandiseId, quantity: qty };
  if (Array.isArray(line.attributes) && line.attributes.length) {
    out.attributes = line.attributes.map((a) => ({
      key: String(a.key),
      value: String(a.value),
    }));
  }
  return out;
};

const createOrAddLinesCart = (state) => {
  let linesWithAttrs = collectShopifyCartLinesFromMessages(state);
  const email = getResponseValue(state, "email");
  const zip_code_address = getResponseValue(state, "zip_code_address");

  if (linesWithAttrs.length && email && zip_code_address) {
    const phoneNumber = formatPhoneForCart(state);

    const { firstName, lastName } = parseName(state);
    const { zip, province, city, address1, address2 } = parseAddress(
      zip_code_address,
      state.prefecturesList
    );
    const linesPayload = linesWithAttrs.map(toStorefrontCartLineInput);

    const attributes = collectCartAttributesFromMessages(state);
    const payload = {
      first_name: firstName, last_name: lastName, email, phone: phoneNumber,
      zip, province, city, address1, address2,
      lines: linesPayload,
      scenario_id: state.scenarioId, uuid: state.uuid
    };
    if (attributes.length) payload.attributes = attributes;

    return api.post("/api/v1/shopify/cart_create", payload).then(res => {
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
