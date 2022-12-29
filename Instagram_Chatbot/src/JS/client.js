export function checkInputNumber(value, field) {
  var numRe = /^\d+$/;
  if (value === '') {
    document.getElementById(`newClient${field}ErrMsg`).style.display = 'none';
    document.getElementById(`newClient${field}ErrMsg`).innerHTML = '';
    return true;
  } else {
    if (numRe.test(value) === false) {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block';
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = `${field} は整数の必要です。`;
    } else if (numRe.test(value) === true) {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'none';
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = '';
      return true;
    }
  }
}

export function checkPhoneNumber(value, field) {
  var phoneRe = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
  if (value === '') {
    document.getElementById(`newClient${field}ErrMsg`).style.display = 'block';
    document.getElementById(`newClient${field}ErrMsg`).innerHTML = `${field} を入力してください。`;
  } else if (phoneRe.test(value) === false || parseInt(Number(value)) !== Number(value)) {
    document.getElementById(`newClient${field}ErrMsg`).style.display = 'block';
    document.getElementById(`newClient${field}ErrMsg`).innerHTML =
      '電話番号の形式で入力してください。';
  } else {
    document.getElementById(`newClient${field}ErrMsg`).style.display = 'none';
    document.getElementById(`newClient${field}ErrMsg`).innerHTML = '';
    return true;
  }
}

export function checkDateToday(dateInput) {
  let date = new Date();
  var dateToday = parseInt(date.toISOString().split('T')[0].replaceAll('-', ''));
  var dateIn = parseInt(dateInput.replaceAll('-', ''));
  if (dateIn < dateToday) {
    document.getElementById(`newClientStartErrMsg`).style.display = 'block';
    document.getElementById(
      `newClientStartErrMsg`
    ).innerHTML = `開始日は当日の前ではない必要です。`;
  } else {
    document.getElementById(`newClientStartErrMsg`).style.display = 'none';
    document.getElementById(`newClientStartErrMsg`).innerHTML = ``;
    return true;
  }
}

export function checkDateEndIn(endDateIn, inputStartDate) {
  var startDate = parseInt(inputStartDate.replaceAll('-', ''));
  var endDate = parseInt(endDateIn.replaceAll('-', ''));
  if (inputStartDate === '' && endDateIn === '') {
    // document.getElementById(`newClientEndErrMsg`).style.display = 'block';
    // document.getElementById(
    //   `newClientEndErrMsg`
    // ).innerHTML = `終了日は開始日の前ではない必要です。`;
    document.getElementById(`newClientEndErrMsg`).style.display = 'none';
    document.getElementById(`newClientEndErrMsg`).innerHTML = ``;
    return true;
  } else if (inputStartDate !== '' && endDateIn !== '' && startDate > endDate) {
    document.getElementById(`newClientEndErrMsg`).style.display = 'block';
    document.getElementById(
      `newClientEndErrMsg`
    ).innerHTML = `終了日を開始日の前に設定することはできません`;
  } else {
    document.getElementById(`newClientEndErrMsg`).style.display = 'none';
    document.getElementById(`newClientEndErrMsg`).innerHTML = ``;
    return true;
  }
}

export function checkDateEnd(startDateIn, endDateIn) {
  var startDate = parseInt(startDateIn.replaceAll('-', ''));
  var endDate = parseInt(endDateIn.replaceAll('-', ''));
  if (startDateIn !== '' && endDateIn !== '' && startDate > endDate) {
    document.getElementById(`dateCheckErrMsg`).style.display = 'block';
    document.getElementById(`dateCheckErrMsg`).innerHTML = `終了日を開始日の前に設定することはできません`;
  } else {
    document.getElementById(`dateCheckErrMsg`).style.display = 'none';
    document.getElementById(`dateCheckErrMsg`).innerHTML = ``;
    return true;
  }
}

export function checkFieldAdd(value, field) {
  if (value === '') {
    document.getElementById(`new${field}ErrMsg`).style.display = 'block';
    document.getElementById(`new${field}ErrMsg`).innerHTML = `入力してください。`;
  } else {
    document.getElementById(`new${field}ErrMsg`).style.display = 'none';
    document.getElementById(`new${field}ErrMsg`).innerHTML = '';
    return true;
  }
}

export function checkSelectStatus() {
  if (
    document.getElementById('in_contract').checked === false ||
    document.getElementById('pause_contract').checked === false ||
    document.getElementById('finished_contract').checked === false ||
    document.getElementById('trial_contract').checked === false
  ) {
    document.getElementById(`newClientStatusErrMsg`).style.display = 'block';
    document.getElementById(`newClientStatusErrMsg`).innerHTML = `ステータスを選択してください。`;
  } else {
    document.getElementById(`newClientStatusErrMsg`).style.display = 'none';
    document.getElementById(`newClientStatusErrMsg`).innerHTML = '';
    return true;
  }
}
