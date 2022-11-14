import React from 'react'
import '../../assets/css/public.css'
import Iframe from 'react-iframe'
function PrivacyPolicy() {
  return (
    <div>
       <Iframe url="https://deel.co.jp/ec-chatbot/privacypolicy.html"
        id="test"
        className=""
        display="block"
        position="relative"/> 
    </div>
  )
}

export default PrivacyPolicy