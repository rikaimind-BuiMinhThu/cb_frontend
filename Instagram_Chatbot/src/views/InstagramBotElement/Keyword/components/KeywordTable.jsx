import React, { useMemo } from 'react';
import { Switch, Tag } from 'antd';
import { AdminActionButton, AdminTable } from '../../../../components/AdminShell';
import { useKeywordSettings } from '../context/KeywordSettingsContext';
import {
  CHANNEL_OPTIONS,
  KEYWORD_PAGE_SIZE,
  SECTION_TITLES,
  TABLE_COLUMNS,
} from '../constants';
import { displayKeywords } from '../utils/keywordFormatters';

function KeywordTable() {
  const { keywords, bagLookup, openAddModal, openEditModal, openDeleteModal } =
    useKeywordSettings();

  const columns = useMemo(
    () => [
      {
        title: TABLE_COLUMNS.ACTIVE,
        dataIndex: 'is_active',
        width: 72,
        render: (_, record) => (
          <Switch
            checked={Boolean(record.is_active)}
            onChange={() => keywords.toggleActive(record)}
          />
        ),
      },
      {
        title: TABLE_COLUMNS.TITLE,
        dataIndex: 'title',
        width: 160,
        ellipsis: true,
      },
      {
        title: TABLE_COLUMNS.KEYWORDS,
        dataIndex: 'keyword',
        render: (value) => (
          <span className="keyword-table-keywords">{displayKeywords(value)}</span>
        ),
      },
      {
        title: TABLE_COLUMNS.MESSAGE,
        key: 'message',
        width: 200,
        render: (_, record) => {
          const info = bagLookup.getBagInfo(record.message_bag_id, record.message_group_name);
          return (
            <div className="keyword-table-message">
              <span className="keyword-table-group-name">{info.groupName}</span>
              <span className="keyword-table-bag-name">{info.bagName}</span>
            </div>
          );
        },
      },
      {
        title: TABLE_COLUMNS.CHANNELS,
        key: 'channels',
        width: 180,
        render: (_, record) => (
          <div className="keyword-channel-tags">
            {CHANNEL_OPTIONS.filter((option) => record[option.key]).map((option) => (
              <Tag key={option.key}>{option.label}</Tag>
            ))}
          </div>
        ),
      },
      {
        title: TABLE_COLUMNS.ACTIONS,
        key: 'actions',
        width: 120,
        render: (_, record) => (
          <>
            <AdminActionButton action="edit" onClick={() => openEditModal(record)} />
            <AdminActionButton action="delete" onClick={() => openDeleteModal(record)} />
          </>
        ),
      },
    ],
    [bagLookup, keywords.toggleActive, openDeleteModal, openEditModal]
  );

  return (
    <section className="keyword-settings-section">
      <AdminTable
        toolbar={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h2 className="keyword-settings-section-title" style={{ margin: 0 }}>
              {SECTION_TITLES.KEYWORDS}
            </h2>
            <AdminActionButton action="create" label="キーワード追加" onClick={openAddModal} />
          </div>
        }
        rowKey="id"
        columns={columns}
        dataSource={keywords.keywords}
        loading={keywords.loading || bagLookup.loading}
        pagination={{
          current: keywords.page,
          total: keywords.total,
          pageSize: KEYWORD_PAGE_SIZE,
          onChange: keywords.handlePageChange,
        }}
      />
    </section>
  );
}

export default KeywordTable;
