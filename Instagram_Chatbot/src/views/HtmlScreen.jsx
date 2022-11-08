import React from 'react'
import './html.css'
import * as utils from './htmlTest.js' ;
import Iframe from 'react-iframe'

var __html = require('./html.js');
var template = { __html: __html };
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