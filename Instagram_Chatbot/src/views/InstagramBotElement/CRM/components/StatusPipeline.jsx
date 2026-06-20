import React from 'react';
import { USER_STATUSES } from '../constants';

function StatusPipeline({ currentStatus, onStatusChange, disabled }) {
  return (
    <div className="crm-status-pipeline">
      <div className="crm-status-pipeline__track">
        <div className="crm-status-pipeline__line" />
        <div className="crm-status-pipeline__steps">
          {USER_STATUSES.map((status) => {
            const isActive = currentStatus === status.key;
            return (
              <div
                key={status.key}
                className="crm-status-pipeline__step"
                onClick={() => !disabled && onStatusChange?.(status.key)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                    onStatusChange?.(status.key);
                  }
                }}
              >
                <span className="crm-status-pipeline__step-label">{status.label}</span>
                <div
                  className={`crm-status-pipeline__step-circle${
                    isActive ? ' crm-status-pipeline__step-circle--active' : ''
                  }`}
                >
                  {status.step}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StatusPipeline;
