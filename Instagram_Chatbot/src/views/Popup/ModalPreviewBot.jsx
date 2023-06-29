import React from "react";
import "../Popup/modal.css";
import ReactDom from 'react-dom'

const ADMIN_MODAL_STYLES = {
  backgroundColor: "rgb(255, 255, 255)",
  padding: "15px",
  zIndex: 1000,
  border: "2px solid gray",
  borderRadius: "5px",
  position: "fixed",
  bottom: "432px",
  right: "20px",
  width: "360px",
  height: "117.19px",
  borderTopLeftRadius: "5px",
  borderTopRightRadius: "5px",
}

const ADMIN_OVERLAY_STYLES = {
  opacity: "0.5",
  backgroundColor: "rgb(0, 0, 0)",
  position: "fixed",
  bottom: 0,
  right: "10px",
  width: "380px",
  height: "620px",
  borderTopLeftRadius: "5px",
  borderTopRightRadius: "5px",
  zIndex: 900
}

export default function ModalPreviewBot({ open, children, onClose, isAdmin, isMobile, styleBot }) {

  if (!open) return null
  
  let MODAL_STYLES = {
    position: 'relative',
    border: '2px solid gray',
    zIndex: 1000,
    padding: '15px',
    borderRadius: '5px',
    maxHeight: '70%', 
    overflowY: 'scroll',
    backgroundColor: '#FFF',
    overflowX: 'hidden'
  };

  let OVERLAY_STYLES = {
    opacity: '0.5',
    position: 'fixed',
    backgroundColor: "#000",
    zIndex: 1000,
    ...styleBot
  }

  if (isMobile) {
    MODAL_STYLES = {
      width: '100%',
      top: '70px',
      let: 0,
      ...MODAL_STYLES
    } 
  } else {
    MODAL_STYLES = {
      width: '90%',
      top: '70px',
      left: '50%',
      transform: 'translateX(-50%)',
      ...MODAL_STYLES
    } 
  }

  return ReactDom.createPortal(
    <>
      <div style={isAdmin ? ADMIN_OVERLAY_STYLES : OVERLAY_STYLES } onClick={onClose} />
      <div style={!isAdmin ? {...styleBot, position: 'absolute'} : {} }>
        <div style={isAdmin ? ADMIN_MODAL_STYLES : MODAL_STYLES}>
          {children}
        </div>
      </div>
    </>,
    document.getElementById('portal')
  )
}