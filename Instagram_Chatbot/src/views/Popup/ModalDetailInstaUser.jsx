import React, { useState } from 'react';
import '../Popup/modal.css';
import ReactDom from 'react-dom';
import { Button } from 'react-bootstrap';

const MODAL_STYLES = {
  width: '67.5%',
  position: 'fixed',
  marginLeft: '-30%',
  marginRight: '-28%',
  top: '11.5%',
  left: '50%',
  //   transform: 'translate(-40%, -50%)',
  backgroundColor: '#FFF',
  padding: '10px',
  zIndex: 1000,
  border: '2px solid gray',
  borderRadius: '5px',
  height: '72.5%',
  maxHeight: '70%',
  overflowY: 'hidden',
  overflowX: 'hidden',
};

const OVERLAY_STYLES = {
  // opacity: '0.05',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  // backgroundColor: "grey",
  zIndex: 1000,
};

export default function ModalDetailInstaUser({ open, children, onClose }) {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} onClick={onClose} />
      <div style={MODAL_STYLES}>
        {/* <i className="nc-icon nc-simple-remove" onClick={onClose} style={{ color: "black" , float:"right", marginTop:"-30px", marginRight:"-30px"}} /> */}
        <i
          className="nc-icon nc-simple-remove"
          onClick={onClose}
          style={{
            marginTop: '0px',
            marginRight: '0px',
            color: 'black',
            float: 'right',
          }}
        />
        {children}
      </div>
    </>,
    document.getElementById('portal')
  );
}
