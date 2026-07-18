import React from 'react';
import PropTypes from 'prop-types';
import UserContentCommonOptions from './UserContentCommonOptions';

const ContentSettingShell = ({
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
  beforeRequire = null,
  className = '',
  children,
}) => (
  <div className={`ss-content-setting-shell ${className}`.trim()}>
    <UserContentCommonOptions
      contentType={contentType}
      contentData={contentData}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
      beforeRequire={beforeRequire}
    />
    <div className="ss-content-setting-body">
      {children}
    </div>
  </div>
);

ContentSettingShell.propTypes = {
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
  beforeRequire: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ContentSettingShell;
