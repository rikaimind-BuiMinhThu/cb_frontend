export function checkInputNumber(value, field) {
    var phoneRe = /^\d+$/;
    if (value === '') {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = `${field} cannot be empty`
    } else if (phoneRe.test(value) === false) {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = "Please input number format"
    } else {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'none'
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = ""
      return true
    }
  }

  export function checkPhoneNumber(value, field) {
    var phoneRe = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    if (value === '') {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = `${field} cannot be empty`
    } else if (phoneRe.test(value) === false) {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'block'
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = "Please input phone number format"
    } else {
      document.getElementById(`newClient${field}ErrMsg`).style.display = 'none'
      document.getElementById(`newClient${field}ErrMsg`).innerHTML = ""
      return true
    }
  }

  export function checkDateToday(dateInput){
    let date = new Date()
    var dateToday =parseInt(date.toISOString().split('T')[0].replaceAll("-",""));
    var dateIn = parseInt(dateInput.replaceAll("-",""))
    if(dateIn<dateToday){
      document.getElementById(`newClientStartErrMsg`).style.display = 'block'
      document.getElementById(`newClientStartErrMsg`).innerHTML = `Start date cannot be before today`
    }else{
      document.getElementById(`newClientStartErrMsg`).style.display = 'none'
      document.getElementById(`newClientStartErrMsg`).innerHTML = ``
      return true;
    }
  }

  export function checkDateEndIn(endDateIn, inputStartDate){
    var startDate = parseInt(inputStartDate.replaceAll("-",""))
    var endDate = parseInt(endDateIn.replaceAll("-",""))
    if(startDate > endDate){
      document.getElementById(`newClientEndErrMsg`).style.display = 'block'
      document.getElementById(`newClientEndErrMsg`).innerHTML = `End date cannot be before start date`
    }else{
      document.getElementById(`newClientEndErrMsg`).style.display = 'none'
      document.getElementById(`newClientEndErrMsg`).innerHTML = ``
      return true;
    }
  }