import React from 'react';
import { Input, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AdminActionButton from './AdminActionButton';

function AdminSearchBar({
  searchValue,
  onSearchChange,
  onSearch,
  searchPlaceholder = '検索...',
  filters = [],
  extra,
}) {
  const showSearch = onSearchChange != null || onSearch != null;

  return (
    <div className="admin-search-bar">
      {showSearch && (
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onPressEnter={onSearch}
          prefix={<SearchOutlined className="admin-search-bar-icon" />}
          allowClear
          className="admin-search-bar-input"
        />
      )}
      {filters.map((filter) => (
        <Space key={filter.key} size={4}>
          {filter.label && <span className="admin-search-bar-filter-label">{filter.label}</span>}
          <Select
            value={filter.value}
            onChange={filter.onChange}
            options={filter.options}
            placeholder={filter.placeholder}
            allowClear={filter.allowClear}
            className="admin-search-bar-select"
          />
        </Space>
      ))}
      {onSearch && <AdminActionButton action="search" onClick={onSearch} />}
      {extra}
    </div>
  );
}

export default AdminSearchBar;
