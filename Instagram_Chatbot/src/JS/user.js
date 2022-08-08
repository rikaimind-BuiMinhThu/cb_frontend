export function checkFieldAdd(value, field) {
    if (value === '') {
      document.getElementById(`newUser${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = `入力してください。`
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
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = `${field} を入力してください。`
    } else if (phoneRe.test(value) === false) {
      document.getElementById(`newUser${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = "メールの正しい形式で入力してください：abc@abc.com"
    } else {
      document.getElementById(`newUser${field}ErrMsg`).style.display = 'none'
      document.getElementById(`newUser${field}ErrMsg`).innerHTML = ""
      return true
    }
  }