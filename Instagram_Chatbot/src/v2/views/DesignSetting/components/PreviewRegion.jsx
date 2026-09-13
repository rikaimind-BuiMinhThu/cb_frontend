import React from 'react';
import PropTypes from 'prop-types';

const PreviewRegion = ({
  sectionId,
  activeSectionId,
  onSectionSelect,
  className,
  children,
}) => {
  if (!onSectionSelect) {
    return <div className={className}>{children}</div>;
  }

  const isActive = activeSectionId === sectionId;

  const handleActivate = (event) => {
    event.stopPropagation();
    onSectionSelect(sectionId);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      handleActivate(event);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-theme-section={sectionId}
      className={`theme-preview-region${isActive ? ' theme-preview-region--active' : ''}${className ? ` ${className}` : ''}`}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};

PreviewRegion.propTypes = {
  sectionId: PropTypes.string.isRequired,
  activeSectionId: PropTypes.string,
  onSectionSelect: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

PreviewRegion.defaultProps = {
  activeSectionId: '',
  onSectionSelect: null,
  className: '',
};

export default PreviewRegion;
