import React from 'react'
import './html.css'
import Iframe from 'react-iframe'

const IFRAME_URL = 'https://deel.co.jp/ecchatbot_9/'
const IFRAME_ID = 'test'
const IFRAME_DISPLAY = 'block'
const IFRAME_POSITION = 'relative'

const HtmlScreen = () => (
  <div>
    <Iframe
      url={IFRAME_URL}
      id={IFRAME_ID}
      className=""
      display={IFRAME_DISPLAY}
      position={IFRAME_POSITION}
    />
  </div>
)

export default HtmlScreen
