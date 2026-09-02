import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { EMPTY_VALUE } from './constants';

const AdminPage = ({ description, children, card = true, className = EMPTY_VALUE }) => {
  const content = card ? (
    <Card bordered={false} className="admin-page-card">
      {children}
    </Card>
  ) : (
    children
  );

  return (
    <div className={`admin-page${className ? ` ${className}` : EMPTY_VALUE}`}>
      {description && <p className="admin-page-description">{description}</p>}
      {content}
    </div>
  );
};

AdminPage.propTypes = {
  description: PropTypes.node,
  children: PropTypes.node,
  card: PropTypes.bool,
  className: PropTypes.string,
};

export default AdminPage;
