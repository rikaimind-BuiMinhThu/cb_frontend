import React from 'react';
import PropTypes from 'prop-types';

export default function MessageDetailPanel({ children }) {
  return (
    <div className="cb-layout-detail-column">
      <div className="cb-layout-detail-body">{children}</div>
    </div>
  );
}

MessageDetailPanel.propTypes = {
  children: PropTypes.node.isRequired,
};
