import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { AdminActionButton, AdminFormRow } from 'v2/components/AdminShell';
import {
  NEW_VARIABLE_TITLE,
  VARIABLE_NAME_LABEL,
  DEFAULT_VALUE_LABEL,
  PLACEHOLDER_NAME,
  PLACEHOLDER_VALUE,
} from './constants';

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
      <p className="admin-variable-new-row__title">{NEW_VARIABLE_TITLE}</p>
      <div className="admin-variable-new-row__fields">
        <div className="admin-variable-new-row__field">
          <AdminFormRow
            label={VARIABLE_NAME_LABEL}
            required
            htmlFor="new-variable-name"
            error={nameError}
            layout="stacked"
          >
            <Input
              id="new-variable-name"
              className="admin-variable-input"
              placeholder={PLACEHOLDER_NAME}
              value={variableName}
              status={nameError ? 'error' : undefined}
              onChange={(event) => onChange('variable_name', event.target.value)}
            />
          </AdminFormRow>
        </div>
        <div className="admin-variable-new-row__field">
          <AdminFormRow
            label={DEFAULT_VALUE_LABEL}
            htmlFor="new-variable-default"
            layout="stacked"
          >
            <Input
              id="new-variable-default"
              className="admin-variable-input"
              placeholder={PLACEHOLDER_VALUE}
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

VariableCreateRow.propTypes = {
  values: PropTypes.shape({
    variable_name: PropTypes.string,
    default_value: PropTypes.string,
  }).isRequired,
  nameError: PropTypes.string,
  creating: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default VariableCreateRow;
