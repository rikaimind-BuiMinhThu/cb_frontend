export const isTokyoDeveloLP = (url) => {
  const tokyoDeveloDomains = [
    // Comment out if you want to test tokyoDevelo in localhost
    // "localhost:8000",
    // "commerceforce.co.jp",
    "tokyo-develo.co.jp",
  ];
  
  return tokyoDeveloDomains.some(domain => url.includes(domain));
}

const TOKYO_DEVELO_LP_CONFIRM_MESSAGE_JS_CODE = String(`
  setTimeout(() => {
    const firstName = document.getElementById("txtName1")?.value || "";
    const lastName = document.getElementById("txtName2")?.value || "";

    const firstNameKana = document.getElementById("txtKana1")?.value || "";
    const lastNameKana = document.getElementById("txtKana2")?.value || "";

    const name = \`\${firstName} \${lastName} (\${firstNameKana} \${lastNameKana})\`;
    const leftPostCode = document.getElementById("txtZip1")?.value || "";
    const rightPostCode = document.getElementById("txtZip2")?.value || "";
    const postCode = \`\${leftPostCode}-\${rightPostCode}\`;

    const address1 = document.getElementById("txtAddress")?.value || "";
    const address2 = document.getElementById("txtAddress1")?.value || "";
    const address3 = document.getElementById("txtAddress2")?.value || "";

    const prefecture = document.querySelector("button[data-id='drpPrefecture']")?.title || "";

    const address = \`\${prefecture} \${address1} \${address2} \${address3}\`.replace(/^s+|s+$/g, '');
    const mobile = document.getElementById("txtTel")?.value || "";
    const email = document.getElementById("txtMail")?.value || "";

    const paymentMethod = document.querySelector('input[name="grpPayment"]:checked')?.closest('label')?.textContent?.trim() || '';

    const subTotal = document.querySelector("#lp-1step-confirm-container > div.card.cart-table > div:nth-child(2) > div > div.col-md-2.col-xs-9.col-xs-offset-3.text-md-center")?.innerText?.trim()?.replace('金額：', '');
    const quantity = document.querySelector("#lp-1step-confirm-container > div.card.cart-table > div:nth-child(2) > div > div:nth-child(3)")?.innerText?.trim()?.replace('数量：', '');
    const shippingFee = document.querySelector("#lp-1step-confirm-container > div:nth-child(4) > div.col-md-6 > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(4)")?.innerText?.trim();

    const total = document.querySelector("#lp-1step-confirm-container > div:nth-child(4) > div.col-md-6 > div.card.card-light-inverse > div > text")?.innerText?.trim();

    let message = \`
◆入力情報の確認◆
【名前】\${name}
【住所】\${postCode} \${address}
【電話番号】\${mobile}
【メールアドレス】\${email}

◆お支払い方法◆
\${paymentMethod}
\`;


    if (subTotal && shippingFee && quantity && total) {
      message += \`
◆注文内容◆
【単価(税込)】\${subTotal}+送料\${shippingFee}
【数量】\${quantity}
【合計金額】\${total}
日本郵便でポストにお届けします。
\`;
    }
    else {
      message += '<div style="color: red;">ご入力注文情報は一部利用できません。ご修正いただくようお願い申し上げます</div>';
    }

    message = message.trim().replaceAll("\\n", "<br>");

    const sendMessageToChatbot = (actionData, action) => {
      let data = {action: action, actionData: actionData};

      const iframe = document.getElementById('previewSdk');
      if (!iframe) return;

      iframe.contentWindow.postMessage(data, "*");
    }

    sendMessageToChatbot(message, 'getPreviewOrderContent');

  }, 2000);
`);

export const UPDATE_TOKYO_DEVELO_LP_PREFECTURE_JS_CODE = String(`setTimeout(() => {
    const prefs = [
        {
            "id": 1,
            "prefecture_jis_code": "01",
            "name": "北海道",
            "prefecture_name_kana": "ﾎｯｶｲﾄﾞｳ"
        },
        {
            "id": 2,
            "prefecture_jis_code": "02",
            "name": "青森県",
            "prefecture_name_kana": "ｱｵﾓﾘｹﾝ"
        },
        {
            "id": 3,
            "prefecture_jis_code": "03",
            "name": "岩手県",
            "prefecture_name_kana": "ｲﾜﾃｹﾝ"
        },
        {
            "id": 4,
            "prefecture_jis_code": "04",
            "name": "宮城県",
            "prefecture_name_kana": "ﾐﾔｷﾞｹﾝ"
        },
        {
            "id": 5,
            "prefecture_jis_code": "05",
            "name": "秋田県",
            "prefecture_name_kana": "ｱｷﾀｹﾝ"
        },
        {
            "id": 6,
            "prefecture_jis_code": "06",
            "name": "山形県",
            "prefecture_name_kana": "ﾔﾏｶﾞﾀｹﾝ"
        },
        {
            "id": 7,
            "prefecture_jis_code": "07",
            "name": "福島県",
            "prefecture_name_kana": "ﾌｸｼﾏｹﾝ"
        },
        {
            "id": 8,
            "prefecture_jis_code": "08",
            "name": "茨城県",
            "prefecture_name_kana": "ｲﾊﾞﾗｷｹﾝ"
        },
        {
            "id": 9,
            "prefecture_jis_code": "09",
            "name": "栃木県",
            "prefecture_name_kana": "ﾄﾁｷﾞｹﾝ"
        },
        {
            "id": 10,
            "prefecture_jis_code": "10",
            "name": "群馬県",
            "prefecture_name_kana": "ｸﾞﾝﾏｹﾝ"
        },
        {
            "id": 11,
            "prefecture_jis_code": "11",
            "name": "埼玉県",
            "prefecture_name_kana": "ｻｲﾀﾏｹﾝ"
        },
        {
            "id": 12,
            "prefecture_jis_code": "12",
            "name": "千葉県",
            "prefecture_name_kana": "ﾁﾊﾞｹﾝ"
        },
        {
            "id": 13,
            "prefecture_jis_code": "13",
            "name": "東京都",
            "prefecture_name_kana": "ﾄｳｷｮｳﾄ"
        },
        {
            "id": 14,
            "prefecture_jis_code": "14",
            "name": "神奈川県",
            "prefecture_name_kana": "ｶﾅｶﾞﾜｹﾝ"
        },
        {
            "id": 15,
            "prefecture_jis_code": "15",
            "name": "新潟県",
            "prefecture_name_kana": "ﾆｲｶﾞﾀｹﾝ"
        },
        {
            "id": 16,
            "prefecture_jis_code": "16",
            "name": "富山県",
            "prefecture_name_kana": "ﾄﾔﾏｹﾝ"
        },
        {
            "id": 17,
            "prefecture_jis_code": "17",
            "name": "石川県",
            "prefecture_name_kana": "ｲｼｶﾜｹﾝ"
        },
        {
            "id": 18,
            "prefecture_jis_code": "18",
            "name": "福井県",
            "prefecture_name_kana": "ﾌｸｲｹﾝ"
        },
        {
            "id": 19,
            "prefecture_jis_code": "19",
            "name": "山梨県",
            "prefecture_name_kana": "ﾔﾏﾅｼｹﾝ"
        },
        {
            "id": 20,
            "prefecture_jis_code": "20",
            "name": "長野県",
            "prefecture_name_kana": "ﾅｶﾞﾉｹﾝ"
        },
        {
            "id": 21,
            "prefecture_jis_code": "21",
            "name": "岐阜県",
            "prefecture_name_kana": "ｷﾞﾌｹﾝ"
        },
        {
            "id": 22,
            "prefecture_jis_code": "22",
            "name": "静岡県",
            "prefecture_name_kana": "ｼｽﾞｵｶｹﾝ"
        },
        {
            "id": 23,
            "prefecture_jis_code": "23",
            "name": "愛知県",
            "prefecture_name_kana": "ｱｲﾁｹﾝ"
        },
        {
            "id": 24,
            "prefecture_jis_code": "24",
            "name": "三重県",
            "prefecture_name_kana": "ﾐｴｹﾝ"
        },
        {
            "id": 25,
            "prefecture_jis_code": "25",
            "name": "滋賀県",
            "prefecture_name_kana": "ｼｶﾞｹﾝ"
        },
        {
            "id": 26,
            "prefecture_jis_code": "26",
            "name": "京都府",
            "prefecture_name_kana": "ｷｮｳﾄﾌ"
        },
        {
            "id": 27,
            "prefecture_jis_code": "27",
            "name": "大阪府",
            "prefecture_name_kana": "ｵｵｻｶﾌ"
        },
        {
            "id": 28,
            "prefecture_jis_code": "28",
            "name": "兵庫県",
            "prefecture_name_kana": "ﾋｮｳｺﾞｹﾝ"
        },
        {
            "id": 29,
            "prefecture_jis_code": "29",
            "name": "奈良県",
            "prefecture_name_kana": "ﾅﾗｹﾝ"
        },
        {
            "id": 30,
            "prefecture_jis_code": "30",
            "name": "和歌山県",
            "prefecture_name_kana": "ﾜｶﾔﾏｹﾝ"
        },
        {
            "id": 31,
            "prefecture_jis_code": "31",
            "name": "鳥取県",
            "prefecture_name_kana": "ﾄｯﾄﾘｹﾝ"
        },
        {
            "id": 32,
            "prefecture_jis_code": "32",
            "name": "島根県",
            "prefecture_name_kana": "ｼﾏﾈｹﾝ"
        },
        {
            "id": 33,
            "prefecture_jis_code": "33",
            "name": "岡山県",
            "prefecture_name_kana": "ｵｶﾔﾏｹﾝ"
        },
        {
            "id": 34,
            "prefecture_jis_code": "34",
            "name": "広島県",
            "prefecture_name_kana": "ﾋﾛｼﾏｹﾝ"
        },
        {
            "id": 35,
            "prefecture_jis_code": "35",
            "name": "山口県",
            "prefecture_name_kana": "ﾔﾏｸﾞﾁｹﾝ"
        },
        {
            "id": 36,
            "prefecture_jis_code": "36",
            "name": "徳島県",
            "prefecture_name_kana": "ﾄｸｼﾏｹﾝ"
        },
        {
            "id": 37,
            "prefecture_jis_code": "37",
            "name": "香川県",
            "prefecture_name_kana": "ｶｶﾞﾜｹﾝ"
        },
        {
            "id": 38,
            "prefecture_jis_code": "38",
            "name": "愛媛県",
            "prefecture_name_kana": "ｴﾋﾒｹﾝ"
        },
        {
            "id": 39,
            "prefecture_jis_code": "39",
            "name": "高知県",
            "prefecture_name_kana": "ｺｳﾁｹﾝ"
        },
        {
            "id": 40,
            "prefecture_jis_code": "40",
            "name": "福岡県",
            "prefecture_name_kana": "ﾌｸｵｶｹﾝ"
        },
        {
            "id": 41,
            "prefecture_jis_code": "41",
            "name": "佐賀県",
            "prefecture_name_kana": "ｻｶﾞｹﾝ"
        },
        {
            "id": 42,
            "prefecture_jis_code": "42",
            "name": "長崎県",
            "prefecture_name_kana": "ﾅｶﾞｻｷｹﾝ"
        },
        {
            "id": 43,
            "prefecture_jis_code": "43",
            "name": "熊本県",
            "prefecture_name_kana": "ｸﾏﾓﾄｹﾝ"
        },
        {
            "id": 44,
            "prefecture_jis_code": "44",
            "name": "大分県",
            "prefecture_name_kana": "ｵｵｲﾀｹﾝ"
        },
        {
            "id": 45,
            "prefecture_jis_code": "45",
            "name": "宮崎県",
            "prefecture_name_kana": "ﾐﾔｻﾞｷｹﾝ"
        },
        {
            "id": 46,
            "prefecture_jis_code": "46",
            "name": "鹿児島県",
            "prefecture_name_kana": "ｶｺﾞｼﾏｹﾝ"
        },
        {
            "id": 47,
            "prefecture_jis_code": "47",
            "name": "沖縄県",
            "prefecture_name_kana": "ｵｷﾅﾜｹﾝ"
        }
    ];

    let tryTimes = 20;
    
    const interval = setInterval(() => {
      tryTimes--;
      console.log("tryTimes", tryTimes);
      if (tryTimes < 0) {
        clearInterval(interval);
        return;
      }
      
      let prefId = document.getElementById("drpPrefecture")?.value;
      console.log("prefId", prefId);
      if (prefId) {
        let prefName = prefId;
        if (parseInt(prefId))
          prefName = prefs.find(pref => pref.id== prefId).name;

        let el = document.getElementById("lblPref");
        el.value = prefName;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));

        ${TOKYO_DEVELO_LP_CONFIRM_MESSAGE_JS_CODE}

        clearInterval(interval);
      }
    }, 500);
  }, 5000);`);