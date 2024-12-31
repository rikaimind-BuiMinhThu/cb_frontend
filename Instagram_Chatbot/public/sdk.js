let botId = sessionStorage.getItem("bot_id");
let chatbotBottom = sessionStorage.getItem("chatbotBottom");
let chatbotH = sessionStorage.getItem("chatbotH");
let chatbotRight = sessionStorage.getItem("chatbotRight");
let chatbotW = sessionStorage.getItem("chatbotW");
let scenarioId = "";
let displayErrorMessage = {
 
  isDisplay: "false",
  seachMode: "",
  searchValue: ""

}
let head = document.getElementsByTagName("head")[0];
let script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
head.appendChild(script);

function getEnvironment() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params.env || "production";
}

function getDebugFlag() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  return params.debug || true;
}

function log(message) {
  let debugFlag = getDebugFlag();

  if (debugFlag) {
    console.log(message);
  }
}

function getEcChatBotApiServerBaseUrl() {
  const environment = getEnvironment();
  switch (environment) {
    case "staging":
    case "test":
      return "https://ec-chatbot-test1.com";
    case "production":
      return "https://ec-chatbot-test.com";
    case "local":
      return "http://localhost:3000";
    default:
      return "http://localhost:3000";
  }
}

function getEcChatBotFrontEndBaseUrl() {
  const environment = getEnvironment();

  switch (environment) {
    case "staging":
    case "test":
      return "https://ec-chatbot1.com";
    case "production":
      return "https://ec-chatbot.com";
    case "local":
      return "http://localhost:3001";
    default:
      return "http://localhost:3001";
  }
}
let globalIframe
function sendMessageToChatbot(mm)
{
  const message = { text: String(mm) };
  globalIframe.contentWindow.postMessage(message, "*");
}

async function displayPopup() {
  const device =
    !tabletCheck() && !mobileCheck()
      ? "pc"
      : tabletCheck()
        ? "tablet"
        : "smartphone";
  const response = await fetch(
    `${getEcChatBotApiServerBaseUrl()}/api/v1/managements/chatbots/${botId}/get_scenario_selected`,
    // `https://ec-chatbot-test1.com/api/v1/managements/chatbots/${botId}/get_scenario_selected`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  scenarioId = data.data.id;
  let uuid =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  let body = document.getElementsByTagName("BODY")[0];
  let iframe = document.createElement("iframe");

  if (mobileCheck()) {
    iframe.width = "100%";
    iframe.style.maxWidth = "100%";
    iframe.style.right = "0";
  } else {
    iframe.width =
      chatbotW && chatbotRight
        ? `${parseInt(chatbotW) + parseInt(chatbotRight)}px`
        : "360px";
    iframe.style.right = "10px";
  }

  iframe.id = "previewSdk";
  iframe.style.position = "fixed";
  iframe.style.bottom = "0";
  iframe.height =
    chatbotH && chatbotBottom
      ? `${parseInt(chatbotH) + parseInt(chatbotBottom)}px`
      : "0px";

  iframe.style.border = "none";
  iframe.style.padding = "0";
  iframe.style.margin = "0";
  iframe.style.borderRadius = "0px";
  // iframe.style.display = "none";
  iframe.style.zIndex = "999999";
  iframe.src = `${getEcChatBotFrontEndBaseUrl()}/preview-customer?bot_id=${botId}&scenario_id=${scenarioId}&urlReceive=${window.location.origin
    }&deviceReceive=${device}&uuid=${uuid}&env=${getEnvironment()}&debug=${getDebugFlag()}&cartSystem=${data.cart_system}`;
  currentIframe = iframe
  body.appendChild(iframe);

  window.addEventListener(
    "message",
    function (e) {
      chatbotW = e.data.widthPc
      chatbotH = e.data.heightPc
      chatbotRight = e.data.chatbotRight
      chatbotBottom = e.data.chatbotBottom
      if (e.data.fukushashikiResponse) {
        fillDataFromMessage(e.data.fukushashikiResponse)
      }
      if(e.data.getErrorMessage)
      {
        processErrorMessage(e.data.getErrorMessage)
      }
      if (e.data.isOpen && mobileCheck()) {
        iframe.width = "100%";
        // iframe.height = "620px";
        iframe.height = "100%";
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      } else if (e.data.isOpen) {
        iframe.width =
          chatbotW && (chatbotRight !== null)
            ? `${parseInt(chatbotW) + parseInt(chatbotRight)}px`
            : "460px";
        iframe.height =
          chatbotH && (chatbotBottom !== null)
            ? `${parseInt(chatbotH) + parseInt(chatbotBottom)}px`
            : "700px";
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      } else if (!e.data.isOpen && mobileCheck()) {
        iframe.width = "250px";
        iframe.height = "58px";
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      } else if (!e.data.isOpen) {
        iframe.width =
          chatbotRight
            ? `${parseInt(chatbotRight) + 360}px`
            : "360px";
        iframe.height = chatbotBottom ? `${parseInt(chatbotBottom) + 77}px` : "77px";
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
      }
      globalIframe = iframe;

      if (e.data.action === 'clickButton') {
        var button = document.getElementById(e.data.id_value);
        if (button) {          
          button.click(); 
        }
      }
    },
    false
  );

  function processErrorMessage(obj)
  {
    displayErrorMessage.isDisplay = obj.isDisplay
    displayErrorMessage.searchValue = obj.searchValue
    displayErrorMessage.seachMode = obj.seachMode
    if(displayErrorMessage.isDisplay)
    {
      var element = getElementByAddress(displayErrorMessage.seachMode, displayErrorMessage.searchValue)
      if(element)
      {
        var contentMessage = element.innerHTML;
        sendMessageToChatbot(contentMessage);
        // const iframe = document.getElementById('previewSdk');
        // if (iframe) {
        //   const currentIframe = iframe.contentWindow;
        //   if (currentIframe) {
        //     currentIframe.postMessage(
        //       { errorMessageContent: "Hello from parent!" },
        //       '*'
        //     );
        //   } else {
        //     console.error('Iframe contentWindow is null.');
        //   }
        // } else {
        //   console.error('Iframe not found!');
        // }
      }
    }
  }

  function fillDataFromMessage(obj) {
    const initialSelectionItem = obj.find((item) => item.type === "initial_selection");
    if (initialSelectionItem != undefined) {
      try {
        var typeElementSelector = getElementByAddress(initialSelectionItem.bindingMode, initialSelectionItem.bindingAddress)
        typeElementSelector.value = initialSelectionItem.bindingValue;
        const event = new Event('change', { bubbles: true });
        typeElementSelector.dispatchEvent(event);

        try {
          setTimeout(() => {
            const cardNumberItem = obj.find((item) => item.type === "card_number");
            if (cardNumberItem) {
              const inputCardNumber = getElementByAddress(cardNumberItem.bindingMode, cardNumberItem.bindingAddress);
              if (inputCardNumber) {
                inputCardNumber.focus();
                inputCardNumber.value = cardNumberItem.bindingValue;
                const inputEvent = new Event('input', { bubbles: true });
                const changeEvent = new Event('change', { bubbles: true });
                inputCardNumber.dispatchEvent(inputEvent);
                inputCardNumber.dispatchEvent(changeEvent);
                inputCardNumber.blur();
              }
            }            

          }, 4000);
        }
        catch (e) {
          console.log(e)
        }

      }
      catch (e) {
        console.log(e)
      }
    }
   
      obj.forEach((item) => {
        switch (item.type) {
          case "card_payment_radio_button":     
          case "text_input":
            {
              if (item.bindingMode == 1) {
                fillDataWithId(item.bindingAddress, item.bindingValue)
              }
              else if (item.bindingMode == 2) {
                fillDataWithCssSelector(item.bindingAddress, item.bindingValue)
              }
              else {
                fillDataWithXPath(item.bindingAddress, item.bindingValue)
              }
              break;
            }
  
          case 'dropdown_prefecture':
            {
              fillDataWithTextInSelector(item.bindingMode, item.bindingAddress, item.bindingValue)
              break;
            }
  
          case "zip_code_address":
            {
              if (item.bindingMode == 1) {
                fillDataWithId(item.bindingAddress, item.bindingValue)
              }
              else if (item.bindingMode == 2) {
                fillDataWithCssSelector(item.bindingAddress, item.bindingValue)
              }
              else {
                fillDataWithXPath(item.bindingAddress, item.bindingValue)
              }
              break;
            }
          case "agree_term":
            {
              if (item.bindingMode == 1) {
                fillDataAgreementWithId(item.bindingAddress, item.bindingValue)
              }
              else if (item.bindingMode == 2) {
                fillDataAgreementWithCssSelector(item.bindingAddress, item.bindingValue)
              }
              else {
                fillDataAgreementWithXPath(item.bindingAddress, item.bindingValue)
              }
              break;
            }
          case "slider":
            {
              if (item.bindingMode == 1) {
                fillDataWithId(item.bindingAddress, item.bindingValue)
              }
              else if (item.bindingMode == 2) {
                fillDataWithCssSelector(item.bindingAddress, item.bindingValue)
              }
              else {
                fillDataWithXPath(item.bindingAddress, item.bindingValue)
              }
            }
  
          case "pull_down":
            {
              if (item.bindingMode !== undefined) {
                if (item.bindingMode == 1) {
                  let element = document.getElementById(item.bindingAddress);
                  fillDataWithId(item.bindingAddress, item.bindingValue)
                  element.dispatchEvent(new Event('change', { bubbles: true }));
                }
                else if (item.bindingMode == 2) {
                  let element = document.querySelector(item.bindingAddress);
                  fillDataWithCssSelector(item.bindingAddress, item.bindingValue)
                  element.dispatchEvent(new Event('change', { bubbles: true }));
                }
                else {
                  let element = document.evaluate(item.bindingAddress, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                  fillDataWithXPath(item.bindingAddress, item.bindingValue)
                  element.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }
              break;
            }
  
          case "textarea":
            {
              if (item.bindingMode == 1) {
                fillDataWithId(item.bindingAddress, item.bindingValue)
              }
              else if (item.bindingMode == 2) {
                fillDataWithCssSelector(item.bindingAddress, item.bindingValue)
              }
              else {
                fillDataWithXPath(item.bindingAddress, item.bindingValue)
              }
              break;
            }
          default:
            return;
        }
  
      })
    

  }

  function getElementByAddress(mode, address) {
    if (mode == 1) {
      const element = document.getElementById(address);
      return element;
    }
    else if (mode == 2) {
      const element = document.querySelector(address);
      return element;
    }
    else {
      const element = document.evaluate(address, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return element;
    }
  }

  function fillDataWithTextInSelector(mode, address, value) {
    const element = getElementByAddress(mode, address);
    if (element.tagName === 'SELECT') {
      const optionToSelect = Array.from(element.options).find(option => option.text === value);
      if (optionToSelect) {
        fillDataToElement(element, optionToSelect.value);
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      fillDataToElement(element, value);
    }
  }

  function fillDataWithId(id, value) {
    let element = document.getElementById(id);
    if (element) {
      fillDataToElement(element, value)
    }

  }

  function removeLeadingZero(value) {
    let strValue = value.toString();
    let result = strValue.replace(/^0+/, '');
    return typeof value === 'number' ? Number(result) : result;
  }

  function removeFirstTwoChars(input) {
    const str = input.toString();
    if (str.length > 2) {
      return str.slice(2);
    } else {
      return '';
    }
  }

  function fillDataToElement(element, value) {
    element.value = value;
    if (element.value == undefined || element.value == "") {
      element.value = removeLeadingZero(value);
    }
    if (element.value == undefined || element.value == "") {
      element.value = removeFirstTwoChars(value);
    }
  }

  function fillDataWithCssSelector(cssSelector, value) {
    let element = document.querySelector(cssSelector);
    if (element) {
      fillDataToElement(element, value)
    }

  }

  function fillDataWithXPath(xpathElement, value) {
    let element = document.evaluate(xpathElement, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
      fillDataToElement(element, value)
    }

  }

  function fillDataAgreementWithId(id, value) {
    let element = document.getElementById(id);
    if (element && element.type === 'checkbox') {
      element.checked = value === true;
    }
  }

  function fillDataAgreementWithCssSelector(cssSelector, value) {
    let element = document.querySelector(cssSelector);
    if (element && element.type === 'checkbox') {
      element.checked = value === true;
    }
  }

  function fillDataAgreementWithXPath(xpathElement, value) {
    let element = document.evaluate(xpathElement, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element && element.type === 'checkbox') {
      element.checked = value === true;
    }
  }

  log("device: ", device);
  setTimeout(() => {
    let checkDevice = { scenario_data: device };
    // submitForm(url, checkDevice)
    getUser(`${getEcChatBotApiServerBaseUrl()}/api/v1/analytics/scenario_counts/${scenarioId}`, checkDevice)
  }, 5000);
}

async function getUser(url, datacount) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datacount),
  });
  const data = await response.json();
  log(data);
}

function tabletCheck() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
      userAgent
    );
  log("isTablet: " + isTablet);
  return isTablet;
}

function mobileCheck() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

displayPopup();