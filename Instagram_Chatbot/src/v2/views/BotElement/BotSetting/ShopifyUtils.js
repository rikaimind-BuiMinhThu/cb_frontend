import api from 'v2/api/api-management';
import { shortestDeliverableDateJpFromOrderClockJst } from "./deliveryDateRules";
import {
  isCalendarPreviewRelativeOn,
  mergeCalendarForPreviewRelativeRange,
} from "./PreviewComponent/UserMessageComponent/Calendar";

const findLastScenarioUserResponseRow = (state, dataInputName) => {
  const rows = state.scenarioUserResponses;
  if (!Array.isArray(rows) || rows.length === 0) return undefined;
  const want = String(dataInputName);
  const reversedRows = [...rows].reverse();
  const match = reversedRows.find((row) => {
    if (row == null) return false;
    const key = row.data_input_name ?? row.dataInputName;
    return String(key) === want;
  });
  return match;
};

const findCrossSellRadioInMessages = (state) => {
  for (const msg of state.messagesList || []) {
    if (msg.belong_to !== "user") continue;
    for (const c of msg.message_content || []) {
      const rb = c.radio_button;
      if (c.type !== "radio_button" || rb?.save_input_content !== "cross_sell_option") continue;
      return rb;
    }
  }
  return null;
};

const crossSellOptionItems = (rb) => {
  if (!rb) return [];
  return [
    ...(rb.radio_button_img || []),
    ...(rb.default || []),
    ...(Array.isArray(rb[rb.type]) ? rb[rb.type] : []),
  ];
};

const resolveCrossSellOptionFromMessages = (state) => {
  const rb = findCrossSellRadioInMessages(state);
  if (!rb) return undefined;
  const items = crossSellOptionItems(rb);
  const sel = (() => {
    const initial = rb.initial_selection;
    if (initial == null || String(initial).trim() === '') {
      return items[0]?.value ?? items[0]?.id;
    }
    return initial;
  })();
  if (sel == null || String(sel).trim() === '') return undefined;
  const hit = items.find(
    (o) => String(o?.id) === String(sel) || String(o?.value) === String(sel)
  );
  const raw = hit?.value ?? hit?.id ?? sel;
  const out = raw != null ? String(raw).trim() : '';
  return out || undefined;
};

const findSkipDeliveryRadioInMessages = (state) => {
  for (const msg of state.messagesList || []) {
    for (const c of msg.message_content || []) {
      if (c?.radio_button?.save_input_content === "skip_delivery_datetime")
        return c.radio_button;
    }
  }
  return null;
};

const resolveSkipDeliveryChoiceFromMessages = (state) => {
  const rb = findSkipDeliveryRadioInMessages(state);
  if (!rb) return undefined;
  const sel = String(rb.initial_selection ?? "").trim();
  if (sel === "1" || sel === "2") return sel;
};

const skipDeliveryChoice = (state) => {
  const row = findLastScenarioUserResponseRow(state, "skip_delivery_datetime");
  const fromRow = String(row?.string_value ?? row?.stringValue ?? "").trim();
  if (fromRow === "1" || fromRow === "2") return fromRow;
  const fromMessages = resolveSkipDeliveryChoiceFromMessages(state);
  if (fromMessages === "1" || fromMessages === "2") return fromMessages;
  return "2";
};

const resolveSkipDeliveryDatetime = (state) => skipDeliveryChoice(state) === "1";

const getResponseValue = (state, name) => {
  const row = findLastScenarioUserResponseRow(state, name);
  if (row) {
    const sv = row.string_value ?? row.stringValue;
    const tv = row.text_value ?? row.textValue;
    if (sv != null && String(sv).trim() !== "") return sv;
    if (tv != null && String(tv).trim() !== "") return tv;
    const iv = row.integer_value ?? row.integerValue;
    if (iv != null) return String(iv);
  }
  const p = state.objParam || {};
  if (p[name] != null && p[name] !== "") return p[name];
  if (name === "zip_code_address") {
    for (const k of ["zipcode_address", "zip_code", "post_code"]) {
      if (p[k] != null && p[k] !== "") return p[k];
    }
  }
  if (name === "cross_sell_option") {
    const fromMessages = resolveCrossSellOptionFromMessages(state);
    if (fromMessages != null && fromMessages !== "") return fromMessages;
  }
  return undefined;
};

const parseQuantity = (ti) => {
  if (ti?.save_input_content !== "quantity") return null;
  const n = Number.parseInt(String(ti.text?.value ?? "").trim(), 10);
  if (Number.isNaN(n)) return null;
  return Math.max(1, n);
};

const parsePullDownQuantity = (pd) => {
  const saveKey = pd?.save_input_content ?? pd?.["save_input_content"];
  if (saveKey !== "quantity") return null;
  const cust = pd?.customization;
  if (!cust) return null;
  const sel =
    cust.value != null && String(cust.value).trim() !== ""
      ? String(cust.value).trim()
      : undefined;
  if (!sel) return null;
  const opts = cust.is_comment
    ? cust.options_with_comment || []
    : cust.options_without_comment || [];
  const opt = (() => {
    const directMatch = opts.find(
      (option) =>
        String(option.id) === sel
        || String(option.value) === sel
        || String(option.text) === sel
    );
    if (directMatch) return directMatch;
    const idx = parseInt(sel, 10);
    if (Number.isNaN(idx)) return undefined;
    if (idx >= 1 && opts[idx - 1]) return opts[idx - 1];
    return opts[idx];
  })();
  const val = opt?.value ?? opt?.text;
  const n = Number.parseInt(String(val ?? "").trim(), 10);
  if (Number.isNaN(n)) return null;
  return Math.max(1, n);
};

const collectQuantityQueueFromState = (state) => {
  const qtyQueue = [];
  for (const msg of state.messagesList || []) {
    for (const c of msg.message_content || []) {
      if (c.type === "text_input") {
        const ti = c.text_input;
        const saveKey = ti?.save_input_content ?? ti?.["save_input_content"];
        if (saveKey !== "quantity") continue;
        const raw = parseQuantity(ti);
        qtyQueue.push(raw != null ? raw : 1);
      }
      if (c.type === "pull_down") {
        const pd = c.pull_down;
        const saveKey = pd?.save_input_content ?? pd?.["save_input_content"];
        if (saveKey !== "quantity") continue;
        const raw = parsePullDownQuantity(pd);
        qtyQueue.push(raw != null ? raw : 1);
      }
    }
  }
  if (qtyQueue.length === 0) {
    const fromApi = getResponseValue(state, "quantity");
    const n = Number.parseInt(String(fromApi ?? "").trim(), 10);
    if (!Number.isNaN(n)) qtyQueue.push(Math.max(1, n));
  }
  return qtyQueue;
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
  const fromResponses = {
    first: getResponseValue(state, 'first_name') || '',
    last: getResponseValue(state, 'last_name') || '',
  };

  const fromMessages = (state.messagesList || []).reduce((acc, msg) => {
    if (msg.belong_to !== 'user') return acc;
    return (msg.message_content || []).reduce((nameAcc, content) => {
      if (content.type !== 'text_input' || !content.text_input?.text?.isSplitInput) return nameAcc;
      const textInput = content.text_input;
      if (textInput.save_input_content !== 'user_name') return nameAcc;
      const vl = String(textInput.text.valueLeft ?? '').trim();
      const vr = String(textInput.text.valueRight ?? '').trim();
      return {
        first: vl || nameAcc.first,
        last: vr || nameAcc.last,
      };
    }, acc);
  }, fromResponses);

  return { firstName: fromMessages.first, lastName: fromMessages.last };
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

  const fromMessages = (state.messagesList || []).reduce((phone, msg) => {
    if (msg.belong_to !== 'user') return phone;
    return (msg.message_content || []).reduce((currentPhone, content) => {
      if (content.type !== 'text_input' || content.text_input?.type !== 'phone_number') return currentPhone;
      const out = join(content.text_input.phone_number);
      return out || currentPhone;
    }, phone);
  }, '');

  if (fromMessages) return fromMessages;

  const parsedPhone = (() => {
    const rawPhone = state.objParam?.phone_number;
    if (typeof rawPhone === 'string' && rawPhone.trim().startsWith('{')) {
      try {
        return JSON.parse(rawPhone);
      } catch (e) {
        return null;
      }
    }
    return typeof rawPhone === 'object' ? rawPhone : null;
  })();

  return join(parsedPhone) || '';
};

const jpFromIso = (v) => {
  const m = String(v ?? "").trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  return m ? `${m[1]}年${+m[2]}月${+m[3]}日` : undefined;
};

const jpFromYmdBucket = (b) => {
  if (!b || typeof b !== "object") return undefined;
  const { valueYear: y, valueMonth: mo, valueDay: d } = b;
  if (y == null || mo == null || d == null) return undefined;
  if (!String(y).trim() || !String(mo).trim() || !String(d).trim()) return undefined;
  return `${y}年${+mo}月${+d}日`;
};

const deliveryJpFromPullDown = (pd) =>
  jpFromYmdBucket(
    pd?.type === "date_ymd" ? pd.date_ymd : pd?.dob_ymd || pd?.date_ymd || {}
  );

const deliveryJpFromCalendar = (cal) => {
  if (!cal || cal.save_input_content !== "delivery_date") return undefined;
  const { type: t, date_select: ds, start_date_select: a, end_date_select: b } = cal;
  if (t === "date_selection" || t === "embedded") {
    if (ds != null && String(ds).trim() !== "") return jpFromIso(ds) || String(ds).trim();
  }
  if (t === "start_end_date") {
    const ja = a != null && String(a).trim() ? jpFromIso(a) || String(a).trim() : "";
    const jb = b != null && String(b).trim() ? jpFromIso(b) || String(b).trim() : "";
    if (ja && jb) return `${ja} ～ ${jb}`;
    return ja || jb || undefined;
  }
  return undefined;
};

const normalizeSavedDeliveryDate = (raw) => {
  if (raw == null || String(raw).trim() === "") return undefined;
  const t = String(raw).trim();
  if (/\d+年\d+月\d+日/.test(t)) return t;
  const iso = jpFromIso(t);
  if (iso) return iso;
  try {
    const o =
      typeof raw === "string" && t.startsWith("{")
        ? JSON.parse(raw)
        : typeof raw === "object"
          ? raw
          : null;
    const jp = jpFromYmdBucket(o);
    if (jp) return jp;
  } catch (e) {
    /* ignore */
  }
  return t;
};

const findLastDeliveryCalendarFromMessages = (state) => (
  (state.messagesList || []).reduce((lastCalendar, msg) => {
    if (msg.belong_to !== 'user') return lastCalendar;
    return (msg.message_content || []).reduce((currentCalendar, content) => {
      if (content.type === 'calendar' && content.calendar?.save_input_content === 'delivery_date') {
        return content.calendar;
      }
      return currentCalendar;
    }, lastCalendar);
  }, undefined)
);

const formatSkipDeliveryDateLikeCalendarPreview = (state) => {
  const cal = findLastDeliveryCalendarFromMessages(state);
  if (!cal) return shortestDeliverableDateJpFromOrderClockJst();
  const effectiveCal = isCalendarPreviewRelativeOn(cal)
    ? mergeCalendarForPreviewRelativeRange(cal)
    : cal;
  const startStr = String(effectiveCal?.start_date ?? "").trim();
  const jp = jpFromIso(startStr);
  return jp || shortestDeliverableDateJpFromOrderClockJst(undefined, cal);
};

const formatDeliveryDateFromPullDown = (state) => {
  if (resolveSkipDeliveryDatetime(state)) {
    return formatSkipDeliveryDateLikeCalendarPreview(state);
  }
  const last = (state.messagesList || []).reduce((latestValue, msg) => {
    if (msg.belong_to !== 'user') return latestValue;
    return (msg.message_content || []).reduce((messageLatest, content) => {
      const calendarValue = content.type === 'calendar' && content.calendar?.save_input_content === 'delivery_date'
        ? deliveryJpFromCalendar(content.calendar)
        : undefined;
      const pullDownValue = !calendarValue && content.pull_down?.save_input_content === 'delivery_date'
        ? deliveryJpFromPullDown(content.pull_down)
        : undefined;
      const resolved = calendarValue || pullDownValue;
      return resolved || messageLatest;
    }, latestValue);
  }, undefined);
  return last || normalizeSavedDeliveryDate(getResponseValue(state, 'delivery_date'));
};

const formatDeliveryTimeFromPullDown = (state) => {
  if (resolveSkipDeliveryDatetime(state)) return "指定しない";
  const v = getResponseValue(state, "delivery_time");
  if (v == null || String(v).trim() === "") return "指定しない";
  return String(v).trim();
};

const collectCartAttributesFromMessages = (state) => {
  const attrs = [];
  const deliveryDate = formatDeliveryDateFromPullDown(state);
  const deliveryTime = formatDeliveryTimeFromPullDown(state);
  if (deliveryDate)
    attrs.push({ key: "配送希望日", value: deliveryDate });
  attrs.push({ key: "配送希望時間", value: deliveryTime });
  return attrs;
};

const collectShopLinePropertyAttributesFromMessages = (state) => {
  const value = getResponseValue(state, "option_variant");
  if (value == null || String(value).trim() === "") return [];
  return [{ key: "着せ替えシート", value: String(value).trim() }];
};

const collectShopifyCartLinesFromMessages = (state) => {
  const qtyQueue = collectQuantityQueueFromState(state);
  const qtyCursor = { index: 0 };
  const nextQty = () => (qtyCursor.index < qtyQueue.length ? qtyQueue[qtyCursor.index++] : 1);
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

  if (state.isUsedCrosssell) {
    const configuredVariantId = String(state.productIdCrossSell || '').trim();
    const choice = String(getResponseValue(state, 'cross_sell_option') || '').trim();
    const crossMerchandiseId = choice === '1' && configuredVariantId ? configuredVariantId : '';
    if (
      crossMerchandiseId &&
      !lines.some((l) => l.merchandiseId === crossMerchandiseId)
    ) {
      lines.push({ merchandiseId: crossMerchandiseId, quantity: nextQty() });
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
  const linesWithAttrs = collectShopifyCartLinesFromMessages(state);
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
