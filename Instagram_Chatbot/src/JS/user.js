export function checkFieldAdd(value, field) {
  if (value === '') {
    document.getElementById(`newUser${field}ErrMsg`).style.display = 'block';
    document.getElementById(`newUser${field}ErrMsg`).innerHTML = `入力してください。`;
  } else {
    document.getElementById(`newUser${field}ErrMsg`).style.display = 'none';
    document.getElementById(`newUser${field}ErrMsg`).innerHTML = '';
    return true;
  }
}

export function checkInputEmail(value, field) {
  var phoneRe =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (value === '') {
    document.getElementById(`newUser${field}ErrMsg`).style.display = 'block';
    document.getElementById(`newUser${field}ErrMsg`).innerHTML = `${field} を入力してください。`;
  } else if (value && value.length > 35) {
    document.getElementById(`newUser${field}ErrMsg`).style.display = 'block';
    document.getElementById(`newUser${field}ErrMsg`).innerHTML = '35文字以下入力してください。';
  } else if (phoneRe.test(value) === false) {
    document.getElementById(`newUser${field}ErrMsg`).style.display = 'block';
    document.getElementById(`newUser${field}ErrMsg`).innerHTML =
      'メールの正しい形式で入力してください：abc@abc.com';
  } else {
    document.getElementById(`newUser${field}ErrMsg`).style.display = 'none';
    document.getElementById(`newUser${field}ErrMsg`).innerHTML = '';
    return true;
  }
}

export function checkUserNameInputAdd(value, field) {
  if (value === '') {
    document.getElementById(`newUser${field}ErrMsg`).style.display = 'block';
    document.getElementById(`newUser${field}ErrMsg`).innerHTML = `入力してください。`;
  } else if (value && value.length > 35) {
    document.getElementById(`newUser${field}ErrMsg`).style.display = 'block';
    document.getElementById(`newUser${field}ErrMsg`).innerHTML = '35文字以下入力してください。';
  } else {
    document.getElementById(`newUser${field}ErrMsg`).style.display = 'none';
    document.getElementById(`newUser${field}ErrMsg`).innerHTML = '';
    return true;
  }
}

export function checkPasswordInputAdd(value, field) {
  if (value === '') {
    document.getElementById(`newUser${field}ErrMsg`).style.display = 'block';
    document.getElementById(`newUser${field}ErrMsg`).innerHTML = `入力してください。`;
  } else if ((value && value.length > 24) || (value && value.length < 6)) {
    document.getElementById(`newUser${field}ErrMsg`).style.display = 'block';
    document.getElementById(`newUser${field}ErrMsg`).innerHTML =
      '24文字以下入力してください。6文字以上入力してください。';
  } else {
    document.getElementById(`newUser${field}ErrMsg`).style.display = 'none';
    document.getElementById(`newUser${field}ErrMsg`).innerHTML = '';
    return true;
  }
}

export function checkUserNameInputUpdate(value, field) {
  if (value === '') {
    document.getElementById(`${field}ErrMsg`).style.display = 'block';
    document.getElementById(`${field}ErrMsg`).innerHTML = `入力してください。`;
  } else if (value && value.length > 35) {
    document.getElementById(`${field}ErrMsg`).style.display = 'block';
    document.getElementById(`${field}ErrMsg`).innerHTML = '35文字以下入力してください。';
  } else {
    document.getElementById(`${field}ErrMsg`).style.display = 'none';
    document.getElementById(`${field}ErrMsg`).innerHTML = '';
    return true;
  }
}

export function checkPasswordInputUpdate(value, field) {
  if (value === '') {
    document.getElementById(`${field}ErrMsg`).style.display = 'block';
    document.getElementById(`${field}ErrMsg`).innerHTML = `入力してください。`;
  } else if ((value && value.length > 24) || (value && value.length < 6)) {
    document.getElementById(`${field}ErrMsg`).style.display = 'block';
    document.getElementById(`${field}ErrMsg`).innerHTML =
      '24文字以下入力してください。6文字以上入力してください。';
  } else {
    document.getElementById(`${field}ErrMsg`).style.display = 'none';
    document.getElementById(`${field}ErrMsg`).innerHTML = '';
    return true;
  }
}
