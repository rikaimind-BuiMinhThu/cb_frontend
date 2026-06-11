import TextInputPreview from './TextInputPreview';
import TextareaPreview from './TextareaPreview';
import LabelPreview from './LabelPreview';
import PullDownPreview from './PullDownPreview';
import CheckboxPreview from './CheckboxPreview';
import RadioButtonPreview from './RadioButtonPreview';

export const PREVIEW_MAP = {
  text_input: TextInputPreview,
  textarea: TextareaPreview,
  label: LabelPreview,
  pull_down: PullDownPreview,
  checkbox: CheckboxPreview,
  radio_button: RadioButtonPreview,
};

export {
  TextInputPreview,
  TextareaPreview,
  LabelPreview,
  PullDownPreview,
  CheckboxPreview,
  RadioButtonPreview,
};
