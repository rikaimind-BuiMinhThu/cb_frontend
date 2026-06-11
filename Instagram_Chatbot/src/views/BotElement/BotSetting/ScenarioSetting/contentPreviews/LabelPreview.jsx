import React from 'react';
import { Checkbox } from 'antd';
import SelectCustom from '../scenarioComon/SelectCustom';

const LabelPreview = ({ label, }) => {
  if (!label?.lbl_content) return null;
  return (
                                                            <div style={{ marginBottom: '10px' }}>
                                                              <div className="ss-message__content--user-label-top">
                                                                <span className="ss-message__content--user-label-title">
                                                                  {label.lbl_content}
                                                                </span>
                                                                {label?.require === true &&
                                                                  <span className="ss-message__content--user-required">
                                                                    ※必須
                                                                  </span>
                                                                }
                                                              </div>
                                                            </div>
  );
};

export default LabelPreview;
