import React from 'react'
import './html.css'
import * as utils from './htmlTest.js' ;
var __html = require('./html.js');
var template = { __html: __html };
 function HtmlScreen() {
  return (
    <div>
<span dangerouslySetInnerHTML={template} />
    </div>
  )
}
export default HtmlScreen