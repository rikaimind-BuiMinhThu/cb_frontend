import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const ScenarioModalShell = ({
  open,
  onClose,
  title,
  onBack,
  children,
  footer,
  width = 750,
  className = '',
}) => {
  if (!open) return null;

  const portalRoot = document.getElementById('portal');
  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <div className="ss-settings-modal-overlay" onClick={onClose} role="presentation">
      <div
        className={`ss-settings-modal-shell ${className}`.trim()}
        style={{ '--ss-modal-width': `${width}px` }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="ss-settings-modal-shell__header">
          {onBack ? (
            <button
              type="button"
              className="ss-settings-modal-shell__back"
              onClick={onBack}
            >
              ← 戻る
            </button>
          ) : (
            <span className="ss-settings-modal-shell__back-placeholder" />
          )}
          <h4 className="ss-settings-modal-shell__title">{title}</h4>
          <button
            type="button"
            className="ss-settings-modal-shell__close"
            onClick={onClose}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
        <div className="ss-settings-modal-shell__body">
          {children}
        </div>
        {footer && (
          <div className="ss-settings-modal-shell__footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    portalRoot,
  );
};

ScenarioModalShell.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onBack: PropTypes.func,
  children: PropTypes.node,
  footer: PropTypes.node,
  width: PropTypes.number,
  className: PropTypes.string,
};

export default ScenarioModalShell;
