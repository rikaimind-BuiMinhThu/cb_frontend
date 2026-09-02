import React from 'react';
import PropTypes from 'prop-types';

const ContentPreviewShell = ({ className = '', children }) => (
  <div className={`ss-content-preview-shell ${className}`.trim()}>
    {children}
  </div>
);

ContentPreviewShell.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ContentPreviewShell;
