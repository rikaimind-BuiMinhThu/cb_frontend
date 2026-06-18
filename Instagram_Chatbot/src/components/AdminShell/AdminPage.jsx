import React from 'react';
import { Card } from 'antd';

function AdminPage({ title, description, toolbar, children, card = true, className = '' }) {
  const content = card ? (
    <Card bordered={false} className="admin-page-card">
      {children}
    </Card>
  ) : (
    children
  );

  return (
    <div className={`admin-page${className ? ` ${className}` : ''}`}>
      {(title || toolbar) && (
        <div className="admin-page-header">
          <div className="admin-page-header-text">
            {title && <h1>{title}</h1>}
            {description && <p>{description}</p>}
          </div>
          {toolbar && <div className="admin-page-toolbar">{toolbar}</div>}
        </div>
      )}
      {content}
    </div>
  );
}

export default AdminPage;
