import React from 'react';
import { USER_STATUSES } from '../constants';

function StatusPipeline({ currentStatus, onStatusChange, disabled }) {
  const activeIndex = USER_STATUSES.findIndex((status) => status.key === currentStatus);

  const handleSelect = (statusKey) => {
    if (!disabled) {
      onStatusChange?.(statusKey);
    }
  };

  return (
    <div className="crm-status-pipeline">
      <p className="crm-status-pipeline__title">ステータス</p>
      <div className="crm-status-pipeline__list">
        {USER_STATUSES.map((status, index) => {
          const isActive = currentStatus === status.key;
          const isPassed = activeIndex >= 0 && index < activeIndex;
          const isLast = index === USER_STATUSES.length - 1;

          return (
            <div
              key={status.key}
              className={`crm-status-pipeline__item${
                isActive ? ' crm-status-pipeline__item--active' : ''
              }${isPassed ? ' crm-status-pipeline__item--passed' : ''}`}
            >
              <div className="crm-status-pipeline__item-track">
                <button
                  type="button"
                  className={`crm-status-pipeline__dot${
                    isActive ? ' crm-status-pipeline__dot--active' : ''
                  }${isPassed ? ' crm-status-pipeline__dot--passed' : ''}`}
                  disabled={disabled}
                  onClick={() => handleSelect(status.key)}
                  aria-label={status.label}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {status.step}
                </button>
                {!isLast && (
                  <div
                    className={`crm-status-pipeline__connector${
                      isPassed || isActive ? ' crm-status-pipeline__connector--filled' : ''
                    }`}
                  />
                )}
              </div>
              <button
                type="button"
                className="crm-status-pipeline__label-btn"
                disabled={disabled}
                onClick={() => handleSelect(status.key)}
              >
                {status.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatusPipeline;
