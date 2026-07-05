import React, { useState } from "react";
import "../Popup/modal.css";
import ReactDom from 'react-dom'
import { Button } from "react-bootstrap";

const MODAL_STYLES = {
  width: '45%',
  position: 'fixed',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 1000,
  border: '2px solid gray',
  borderRadius: '5px',
  maxHeight: '70%', 
  overflowY: 'scroll',
  overflowX: 'hidden',
}

const OVERLAY_STYLES = {
  // opacity: '0.05',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  // backgroundColor: "grey",
  zIndex: 1000
}

export default function Modal({ open, children, onClose }) {
  if (!open) return null

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} onClick={onClose} />
      <div style={MODAL_STYLES}>
      <i className="nc-icon nc-simple-remove" onClick={onClose} style={{ color: "black" , float:"right", marginTop:"-30px", marginRight:"-30px"}} />
        {children}
      </div>
    </>,
    document.getElementById('portal')
  )
}