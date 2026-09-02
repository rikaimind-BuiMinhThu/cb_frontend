import React from 'react';
import { Input } from 'antd';
import { AdminActionButton, AdminFormRow } from 'v2/components/AdminShell';

const VariableCreateRow = ({
  values,
  nameError,
  creating,
  onChange,
  onSave,
  onCancel,
}) => {
  const { variable_name: variableName, default_value: defaultValue } = values;

  return (
    <div className="admin-variable-new-row">
      <p className="admin-variable-new-row__title">新しい変数を追加</p>
      <div className="admin-variable-new-row__fields">
        <div className="admin-variable-new-row__field">
          <AdminFormRow
            label="変数名"
            required
            htmlFor="new-variable-name"
            error={nameError}
            layout="stacked"
          >
            <Input
              id="new-variable-name"
              className="admin-variable-input"
              placeholder="変数名をご入力ください"
              value={variableName}
              status={nameError ? 'error' : undefined}
              onChange={(event) => onChange('variable_name', event.target.value)}
            />
          </AdminFormRow>
        </div>
        <div className="admin-variable-new-row__field">
          <AdminFormRow
            label="デフォルト値"
            htmlFor="new-variable-default"
            layout="stacked"
          >
            <Input
              id="new-variable-default"
              className="admin-variable-input"
              placeholder="変数値をご入力ください"
              value={defaultValue}
              onChange={(event) => onChange('default_value', event.target.value)}
            />
          </AdminFormRow>
        </div>
        <div className="admin-variable-new-row__actions">
          <AdminActionButton action="save" loading={creating} onClick={onSave} />
          <AdminActionButton action="cancel" onClick={onCancel} disabled={creating} />
        </div>
      </div>
    </div>
  );
};

export default VariableCreateRow;
