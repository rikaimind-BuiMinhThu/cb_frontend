import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import ScenarioModalCheckbox from '../../components/modals/shared/ScenarioModalCheckbox';
import ScenarioInfoTooltip from '../../components/modals/shared/ScenarioInfoTooltip';
import SelectCustom from '../../scenarioComon/SelectCustom';
import {
  SCENARIO_MODAL_TOOLTIPS,
  USER_CONTENT_OPTION_LABELS,
} from '../../components/modals/shared/scenarioModalTooltips';
import { getUserContentOptionsConfig } from './userContentOptionsConfig';

const labelWithTooltip = (text, tooltipKey) => (
  <>
    {text}
    <ScenarioInfoTooltip text={SCENARIO_MODAL_TOOLTIPS[tooltipKey]} />
  </>
);

const UserContentCommonOptions = ({
  contentType,
  contentData,
  indexMessageSelect,
  indexContent,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  renderRootFaqOption,
  dataInputVar,
  setIsOpenAddVariable,
}) => {
  const config = getUserContentOptionsConfig(contentType);

  if (!config || !contentData) {
    return null;
  }

  const selectedMessage = dataMessages[indexMessageSelect];

  const updateMessageField = (field, value) => {
    Object.assign(selectedMessage, { [field]: value });
    setDataMessages([...dataMessages]);
  };

  const updateContentField = (field, value) => {
    onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, field);
  };

  const apiSelectConfig = config.apiSelect;
  const apiSelectData = apiSelectConfig?.dataSource === 'variables' ? dataInputVar : [];

  return (
    <div className="ss-user-content-common-options">
      {config.hideWhenLoggedIn && (
        <ScenarioModalCheckbox
          checked={!!selectedMessage.not_display_when_logged_in}
          onChange={(checked) => updateMessageField('not_display_when_logged_in', checked)}
          label={labelWithTooltip(
            USER_CONTENT_OPTION_LABELS.hideWhenLoggedIn,
            'hideWhenLoggedIn',
          )}
        />
      )}

      {config.hideWhenError && (
        <ScenarioModalCheckbox
          checked={!!selectedMessage.not_display_when_have_error}
          onChange={(checked) => updateMessageField('not_display_when_have_error', checked)}
          label={labelWithTooltip(
            USER_CONTENT_OPTION_LABELS.hideWhenError,
            'hideWhenError',
          )}
        />
      )}

      {config.faq && renderRootFaqOption?.()}

      {config.noAutoScroll && (
        <ScenarioModalCheckbox
          checked={!!contentData.is_not_auto_scroll}
          onChange={(checked) => updateContentField('is_not_auto_scroll', checked)}
          label={labelWithTooltip(
            USER_CONTENT_OPTION_LABELS.noAutoScroll,
            'noAutoScroll',
          )}
        />
      )}

      {config.saveToVariable && (
        <div className="ss-user-setting-option-row">
          <div className="ss-user-setting-option-row__checkbox">
            <ScenarioModalCheckbox
              checked={!!contentData.is_save_input_content}
              onChange={(checked) => updateContentField('is_save_input_content', checked)}
              label={labelWithTooltip(
                USER_CONTENT_OPTION_LABELS.saveToVariable,
                'saveToVariable',
              )}
            />
          </div>
          {contentData.is_save_input_content && (
            <div className="ss-user-setting-option-row__controls">
              <SelectCustom
                id={`${contentType}-save-variable`}
                className="ss-user-setting-option-row__select"
                value={contentData.save_input_content}
                data={dataInputVar}
                keyValue="variable_name"
                nameValue="variable_name"
                onChange={(value) => updateContentField('save_input_content', value)}
              />
              <Button
                className="ss-user-setting__select-btn-add ss-user-setting-option-row__action"
                onClick={() => setIsOpenAddVariable(true)}
              >
                追加
              </Button>
            </div>
          )}
        </div>
      )}

      {config.apiValidation && (
        <>
          <div className="ss-user-setting-option-row">
            <div className="ss-user-setting-option-row__checkbox">
              <ScenarioModalCheckbox
                checked={!!contentData.use_api_input_value}
                onChange={(checked) => updateContentField('use_api_input_value', checked)}
                label={labelWithTooltip(
                  USER_CONTENT_OPTION_LABELS.apiValidation,
                  'apiValidation',
                )}
              />
            </div>
            {contentData.use_api_input_value && apiSelectConfig && (
              <div className="ss-user-setting-option-row__controls">
                <SelectCustom
                  id={`${contentType}-api-select`}
                  className="ss-user-setting-option-row__select"
                  value={contentData[apiSelectConfig.valueField]}
                  data={apiSelectData}
                  keyValue={apiSelectConfig.keyValue}
                  nameValue={apiSelectConfig.nameValue}
                  onChange={(value) => updateContentField(apiSelectConfig.changeField, value)}
                />
              </div>
            )}
          </div>
          {config.requireInline && (
            <ScenarioModalCheckbox
              checked={!!contentData.require}
              onChange={(checked) => updateContentField('require', checked)}
              label={labelWithTooltip(
                USER_CONTENT_OPTION_LABELS.require,
                'require',
              )}
            />
          )}
        </>
      )}

      {config.displayContinueButton && (
        <ScenarioModalCheckbox
          checked={!!contentData.displayButtonNext}
          onChange={(checked) => updateContentField('displayButtonNext', checked)}
          label={labelWithTooltip(
            USER_CONTENT_OPTION_LABELS.displayContinueButton,
            'displayContinueButton',
          )}
        />
      )}
    </div>
  );
};

UserContentCommonOptions.propTypes = {
  contentType: PropTypes.string.isRequired,
  contentData: PropTypes.object,
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
  onChangeValueMessageContent: PropTypes.func.isRequired,
  renderRootFaqOption: PropTypes.func,
  dataInputVar: PropTypes.array,
  setIsOpenAddVariable: PropTypes.func.isRequired,
};

export default UserContentCommonOptions;
