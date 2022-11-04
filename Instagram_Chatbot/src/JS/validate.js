const field = document.getElementById.bind(document);

export function checkEmail(inputId, errId, label) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
  if (!regex.test(field(inputId).value) && field(inputId).value != '') {
    field(errId).style.display = 'block';
    field(errId).innerHTML = `${label} incorrect.`;
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
    field(errId).innerHTML = `${label} must be less than ${length} characters.`;
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
    field(errId).innerHTML = `${label} field is required.`;
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
    field(errId).innerHTML = `${label} hasn't been selected yet.`;
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
