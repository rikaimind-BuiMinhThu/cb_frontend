import React from 'react';
import PropTypes from 'prop-types';
import { Input, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AdminActionButton from './AdminActionButton';
import { ACTION_SEARCH, SEARCH_FILTER_SPACE_SIZE, SEARCH_PLACEHOLDER } from './constants';

const AdminSearchBar = ({
  searchValue,
  onSearchChange,
  onSearch,
  searchPlaceholder = SEARCH_PLACEHOLDER,
  filters = [],
  extra,
}) => {
  const showSearch = onSearchChange != null || onSearch != null;

  return (
    <div className="admin-search-bar">
      {showSearch && (
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          onPressEnter={onSearch}
          prefix={<SearchOutlined className="admin-search-bar-icon" />}
          allowClear
          className="admin-search-bar-input"
        />
      )}
      {filters.map((filter) => (
        <Space key={filter.key} size={SEARCH_FILTER_SPACE_SIZE}>
          {filter.label && (
            <span className="admin-search-bar-filter-label">{filter.label}</span>
          )}
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
      {onSearch && <AdminActionButton action={ACTION_SEARCH} onClick={onSearch} />}
      {extra}
    </div>
  );
};

AdminSearchBar.propTypes = {
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  onSearch: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  filters: PropTypes.arrayOf(PropTypes.object),
  extra: PropTypes.node,
};

export default AdminSearchBar;
