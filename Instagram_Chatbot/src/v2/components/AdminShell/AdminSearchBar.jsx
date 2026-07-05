import React from 'react';
import { Button, Input, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function AdminSearchBar({
  searchValue,
  onSearchChange,
  onSearch,
  searchPlaceholder = '検索...',
  filters = [],
  extra,
}) {
  return (
    <div className="admin-search-bar">
      <Input
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
        onPressEnter={onSearch}
        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
        allowClear
        style={{ width: 220 }}
      />
      {filters.map((filter) => (
        <Space key={filter.key} size={4}>
          {filter.label && <span style={{ color: '#6b7280', fontSize: 13 }}>{filter.label}</span>}
          <Select
            value={filter.value}
            onChange={filter.onChange}
            options={filter.options}
            style={{ minWidth: 120 }}
          />
        </Space>
      ))}
      {onSearch && (
        <Button type="primary" onClick={onSearch}>
          検索
        </Button>
      )}
      {extra}
    </div>
  );
}

export default AdminSearchBar;
