import React from 'react';
import { Card } from 'antd';

function AdminPage({ description, children, card = true, className = '' }) {
  const content = card ? (
    <Card bordered={false} className="admin-page-card">
      {children}
    </Card>
  ) : (
    children
  );

  return (
    <div className={`admin-page${className ? ` ${className}` : ''}`}>
      {description && <p className="admin-page-description">{description}</p>}
      {content}
    </div>
  );
}

export default AdminPage;
