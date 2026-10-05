import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import './modal.css';

const PORTAL_ELEMENT_ID = 'portal';

const ModalNoti = ({ open, children, onClose }) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    setPortalElement(document.getElementById(PORTAL_ELEMENT_ID));
  }, []);

  if (!open || !portalElement) return null;

  return ReactDom.createPortal(
    <>
      <div className="preview-modal-overlay" onClick={onClose} />
      <div className="preview-modal-content">
        <i className="nc-icon nc-simple-remove preview-modal-close" onClick={onClose} />
        {children}
      </div>
    </>,
    portalElement,
  );
};

ModalNoti.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.node,
  onClose: PropTypes.func,
};

export default ModalNoti;
