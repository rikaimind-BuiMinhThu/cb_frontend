export function checkFieldAdd(value, field) {
    if (value === '') {
      document.getElementById(`newUser${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = `This field cannot be empty`
    } else {
      document.getElementById(`newUser${field}ErrMsg`).style.display = 'none'
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = ""
      return true
    }
  }

  export function checkInputEmail(value, field) {
    var phoneRe = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (value === '') {
      document.getElementById(`newUser${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = `${field} cannot be empty`
    } else if (phoneRe.test(value) === false) {
      document.getElementById(`newUser${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = "Please input right email format: abc@abc.com"
    } else {
      document.getElementById(`newUser${field}ErrMsg`).style.display = 'none'
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = ""
      return true
    }
  }