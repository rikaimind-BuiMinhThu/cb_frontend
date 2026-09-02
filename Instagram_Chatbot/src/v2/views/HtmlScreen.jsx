import React from 'react'
import './html.css'
import Iframe from 'react-iframe'

 function HtmlScreen() {
  return (
    <div>
{/* <span dangerouslySetInnerHTML={template} /> */}
<Iframe url="https://deel.co.jp/ecchatbot_9/"
        id="test"
        className=""
        display="block"
        position="relative"/>
    </div>
  )
}
export default HtmlScreen