import TextInputSetting from './TextInputSetting';
import TextareaSetting from './TextareaSetting';
import LabelSetting from './LabelSetting';
import PullDownSetting from './PullDownSetting';
import CheckboxSetting from './CheckboxSetting';
import RadioButtonSetting from './RadioButtonSetting';

export const CONTENT_SETTING_MAP = {
  text_input: TextInputSetting,
  textarea: TextareaSetting,
  label: LabelSetting,
  pull_down: PullDownSetting,
  checkbox: CheckboxSetting,
  radio_button: RadioButtonSetting,
};

export {
  TextInputSetting,
  TextareaSetting,
  LabelSetting,
  PullDownSetting,
  CheckboxSetting,
  RadioButtonSetting,
};
