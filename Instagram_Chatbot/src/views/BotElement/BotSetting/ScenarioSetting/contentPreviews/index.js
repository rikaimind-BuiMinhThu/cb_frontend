import TextInputPreview from './TextInputPreview';
import TextareaPreview from './TextareaPreview';
import LabelPreview from './LabelPreview';
import PullDownPreview from './PullDownPreview';
import CheckboxPreview from './CheckboxPreview';
import RadioButtonPreview from './RadioButtonPreview';
import { withContentPreviewContext } from './withContentPreviewContext';

export const PREVIEW_MAP = {
  text_input: withContentPreviewContext(TextInputPreview),
  textarea: withContentPreviewContext(TextareaPreview),
  label: withContentPreviewContext(LabelPreview),
  pull_down: withContentPreviewContext(PullDownPreview),
  checkbox: withContentPreviewContext(CheckboxPreview),
  radio_button: withContentPreviewContext(RadioButtonPreview),
};

export {
  TextInputPreview,
  TextareaPreview,
  LabelPreview,
  PullDownPreview,
  CheckboxPreview,
  RadioButtonPreview,
};
