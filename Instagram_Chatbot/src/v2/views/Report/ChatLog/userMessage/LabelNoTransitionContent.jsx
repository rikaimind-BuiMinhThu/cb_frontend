/* cSpell: disable */
import React from 'react';
import PropTypes from 'prop-types';

const LabelNoTransitionContent = ({
  content,
}) => {
  const labelNoTransition = content.label_no_transition;
  if (!labelNoTransition) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {labelNoTransition.value}
                  </div>
  );
};

LabelNoTransitionContent.propTypes = {
  content: PropTypes.object,
};

export default LabelNoTransitionContent;
