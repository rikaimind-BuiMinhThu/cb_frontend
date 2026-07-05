const field = document.getElementById.bind(document);

export function checkEmail(inputId, errId, label) {
  var regex = /^[a-zA-Z0-9]+[a-zA-Z0-9]+([._+-])*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;
  if (!regex.test(field(inputId).value) && field(inputId).value != '') {
    field(errId).style.display = 'block';
    field(errId).innerHTML = `${label}項目は正しくありません。`;
    return false;
  } else {
    field(errId).style.display = 'none';
    field(errId).innerHTML = ``;
    return true;
  }
}
export function checkUrl(inputId, errId, label) {
  var regex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  if (!regex.test(field(inputId).value) && field(inputId).value != '') {
    field(errId).style.display = 'block';
    field(errId).innerHTML = `${label}フォーマとは正しくありません。`;
    return false;
  } else {
    field(errId).style.display = 'none';
    field(errId).innerHTML = ``;
    return true;
  }
}

export function checkMaxLength(inputId, errId, label, length) {
  if (field(inputId).value.length > length && field(inputId).value != '') {
    field(errId).style.display = 'block';
    field(errId).innerHTML = `${label}を${length}文字以下入力してください。`;
    return false;
  } else {
    field(errId).style.display = 'none';
    field(errId).innerHTML = ``;
    return true;
  }
}

export function checkRequired(inputId, errId, label) {
  if (field(inputId).value === '') {
    field(errId).style.display = 'block';
    field(errId).innerHTML = `${label}は、必ず指定してください。`;
    return false;
  } else {
    field(errId).style.display = 'none';
    field(errId).innerHTML = ``;
    return true;
  }
}

export function checkSelect(inputId, errId, label) {
  if (field(inputId).value === '') {
    field(errId).style.display = 'block';
    field(errId).innerHTML = `${label}はすでに選択されました！`;
    return false;
  } else {
    field(errId).style.display = 'none';
    field(errId).innerHTML = ``;
    return true;
  }
}

export function checkInput(inputId, errId, label) {
  checkMaxLength(inputId, errId, label, 50);
  checkRequired(inputId, errId, label);
  if (checkRequired(inputId, errId, label) && checkMaxLength(inputId, errId, label, 50))
    return true;
}

export function checkEmailRequired(inputId, errId, label) {
  checkEmail(inputId, errId, label);
  checkRequired(inputId, errId, label);
  if (checkRequired(inputId, errId, label) && checkEmail(inputId, errId, label)) return true;
}

export function checkTel(inputId, errId, label) {
  checkMaxLength(inputId, errId, label, 12);
  checkRequired(inputId, errId, label);
  if (checkRequired(inputId, errId, label) && checkMaxLength(inputId, errId, label, 12)) {
    return true;
  }
}
export const validateImageURLWithDimension = (url, options = {}) => {
  const {
     maxWidth = 800,
     maxHeight = 800,
     callback = () => {}
  } = options;

  const pattern = /\.(jpg|jpeg|png)$/i;

  if (!pattern.test(url)) {
      callback({ valid: false, message: '画像URLはjpg、jpeg、png形式のみ対応しています' }); // "URL only support jpg, jpeg, png"
      return;
    }
    // Check image dimensions
    const img = new Image();
    
    img.onload = function() {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      
      if (width > maxWidth || height > maxHeight) {
        callback({ 
          valid: false, 
          message: `画像サイズが${maxWidth}x${maxHeight}ピクセルを超えています。現在のサイズ：${width}x${height}ピクセル` // "Message wwhen Size of image over"
        });
      } else {
        callback({ valid: true });
      }
    };
    
    img.onerror = function() {
      callback({ valid: false, message: '画像URLが無効です' }); // "URL image not acepted"
    };
    
    img.src = url;
};
