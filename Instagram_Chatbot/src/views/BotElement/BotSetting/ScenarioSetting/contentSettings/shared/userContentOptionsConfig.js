/**
 * Per-content-type configuration for UserContentCommonOptions.
 *
 * apiSelect:
 * - valueField / changeField: content data keys for the API select
 * - dataSource: 'variables' | 'empty'
 * - keyValue / nameValue: SelectCustom key props
 */
export const USER_CONTENT_OPTIONS_CONFIG = {
  image: {
    hideWhenLoggedIn: true,
    hideWhenError: true,
    faq: true,
    noAutoScroll: true,
    saveToVariable: true,
    apiValidation: true,
    requireInline: false,
    displayContinueButton: true,
    apiSelect: {
      valueField: 'use_api_input_value',
      changeField: 'use_api_input_value',
      dataSource: 'variables',
      keyValue: 'variable_name',
      nameValue: 'variable_name',
    },
  },
  text_input: {
    hideWhenLoggedIn: true,
    hideWhenError: true,
    faq: true,
    noAutoScroll: false,
    saveToVariable: true,
    apiValidation: true,
    // 必須 on its own row below the API select (not inline with API checkbox)
    requireInline: true,
    displayContinueButton: false,
    apiSelect: {
      valueField: 'data_use_api_input_value',
      changeField: 'data_use_api_input_value',
      dataSource: 'empty',
      keyValue: 'key',
    },
  },
};

export const getUserContentOptionsConfig = (contentType) =>
  USER_CONTENT_OPTIONS_CONFIG[contentType] || null;
