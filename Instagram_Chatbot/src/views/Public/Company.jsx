import React from 'react'
import '../../assets/css/public.css'
import Iframe from 'react-iframe'
function Company() {
  return (
    <div>
        <Iframe url="https://deel.co.jp/ec-chatbot/company.html"
        id="test"
        className=""
        display="block"
        position="relative"/>
    </div>
  )
}

export default Company