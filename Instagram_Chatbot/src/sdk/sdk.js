
function displayPopup(){
    var body = document.getElementsByTagName("BODY")[0]
var popup_chat = document.createElement('div')
popup_chat.style.height = "620px"
popup_chat.style.width = "380px"
// popup_chat.style.float = "right"
popup_chat.style.position = "absolute"
popup_chat.style.bottom = "0"
popup_chat.style.right = "0"
popup_chat.style.backgroundColor = "aqua"
body.appendChild(popup_chat)

}
displayPopup()