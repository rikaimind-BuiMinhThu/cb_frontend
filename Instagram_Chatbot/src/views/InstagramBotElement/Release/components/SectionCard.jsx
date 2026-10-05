import React from 'react';
import { Card, Switch, Typography } from 'antd';

export default function SectionCard({
  title,
  enabled,
  onToggle,
  toggleLoading = false,
  disabled = false,
  extra,
  children,
}) {
  return (
    <Card
      className="release-section-card"
      title={<Typography.Text strong>{title}</Typography.Text>}
      extra={(
        <SpaceLike>
          {extra}
          <Switch
            checked={enabled}
            loading={toggleLoading}
            disabled={disabled}
            onChange={onToggle}
          />
        </SpaceLike>
      )}
    >
      {children}
    </Card>
  );
}

function SpaceLike({ children }) {
  return <div className="release-section-card__extra">{children}</div>;
}
