import React from 'react';

function AdminFormRow({ label, required, children, hint }) {
  return (
    <div className="admin-form-row">
      {label && (
        <label className="admin-form-row-label">
          {label}
          {required && <span className="required-badge">必須</span>}
        </label>
      )}
      {children}
      {hint && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export default AdminFormRow;
