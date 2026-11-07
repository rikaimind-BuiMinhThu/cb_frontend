import React from 'react';
import PropTypes from 'prop-types';
import { agreeTermDesignPropType } from 'v2/components/BotMessages/agreeTermPropTypes';
import {
  AGREE_TERM_ALIGN,
  AGREE_TERM_BORDER_WIDTH_MAX,
  AGREE_TERM_BORDER_WIDTH_MIN,
  AGREE_TERM_CHECKBOX_SIZE_MAX,
  AGREE_TERM_CHECKBOX_SIZE_MIN,
  AGREE_TERM_LABEL_FONT_SIZE_MAX,
  AGREE_TERM_LABEL_FONT_SIZE_MIN,
  AGREE_TERM_TICK_WIDTH_MAX,
  AGREE_TERM_TICK_WIDTH_MIN,
  resolveAgreeTermDesign,
} from 'v2/components/BotMessages/agreeTermDesign';
import ScenarioModalShell from '../../components/modals/shared/ScenarioModalShell';
import ScenarioFormRow from '../../components/modals/shared/ScenarioFormRow';
import ScenarioModalCheckbox from '../../components/modals/shared/ScenarioModalCheckbox';
import { AGREE_TERM_LABELS } from '../../constants/scenarioSettingLabels';

const AGREE_TERM_DESIGN_MODAL_WIDTH = 640;

const ALIGN_OPTIONS = [
  { value: AGREE_TERM_ALIGN.LEFT, label: AGREE_TERM_LABELS.alignLeft },
  { value: AGREE_TERM_ALIGN.CENTER, label: AGREE_TERM_LABELS.alignCenter },
  { value: AGREE_TERM_ALIGN.RIGHT, label: AGREE_TERM_LABELS.alignRight },
];

const AgreeTermDesignModal = ({
  open,
  onClose,
  design,
  canCollapse,
  onChange,
}) => {
  const resolved = resolveAgreeTermDesign(design);

  const emit = (nextDesign) => {
    onChange(resolveAgreeTermDesign(nextDesign));
  };

  const patchGroup = (group, partial) => {
    emit({
      ...resolved,
      [group]: {
        ...resolved[group],
        ...partial,
      },
    });
  };

  const changeColor = (group, key) => (event) => {
    patchGroup(group, { [key]: event.target.value });
  };

  const changeNumber = (group, key, min, max) => (event) => {
    const parsed = Number.parseInt(event.target.value, 10);
    if (!Number.isFinite(parsed)) return;
    const nextValue = Math.min(max, Math.max(min, parsed));
    patchGroup(group, { [key]: nextValue });
  };

  const changeCollapseEnabled = (enabled) => {
    if (enabled && !canCollapse) return;
    patchGroup('collapse', { enabled });
  };

  const alignButtonClass = (value) => {
    if (resolved.align === value) {
      return 'ss-agree-term-design-modal__align-btn ss-agree-term-design-modal__align-btn--active';
    }
    return 'ss-agree-term-design-modal__align-btn';
  };

  const showDefaultCollapse = canCollapse && resolved.collapse.enabled;

  return (
    <ScenarioModalShell
      open={open}
      onClose={onClose}
      title={AGREE_TERM_LABELS.designModalTitle}
      width={AGREE_TERM_DESIGN_MODAL_WIDTH}
    >
      <div className="ss-agree-term-design-modal__section">{AGREE_TERM_LABELS.designTitleSection}</div>
      <ScenarioFormRow label={AGREE_TERM_LABELS.titleColor}>
        <input
          type="color"
          className="ss-agree-term-design-modal__color"
          value={resolved.title.color}
          onChange={changeColor('title', 'color')}
        />
      </ScenarioFormRow>
      <ScenarioModalCheckbox
        checked={resolved.title.bold}
        onChange={(bold) => patchGroup('title', { bold })}
        label={AGREE_TERM_LABELS.bold}
      />

      <div className="ss-agree-term-design-modal__section">{AGREE_TERM_LABELS.collapseSection}</div>
      <ScenarioModalCheckbox
        checked={canCollapse && resolved.collapse.enabled}
        disabled={!canCollapse}
        onChange={changeCollapseEnabled}
        label={AGREE_TERM_LABELS.collapseEnable}
      />
      {!canCollapse && (
        <p className="ss-agree-term-design-modal__hint">{AGREE_TERM_LABELS.collapseNeedsTitle}</p>
      )}
      {showDefaultCollapse && (
        <ScenarioModalCheckbox
          checked={resolved.collapse.default_collapsed}
          onChange={(defaultCollapsed) => patchGroup('collapse', { default_collapsed: defaultCollapsed })}
          label={AGREE_TERM_LABELS.collapseDefault}
        />
      )}

      <div className="ss-agree-term-design-modal__section">{AGREE_TERM_LABELS.checkboxSection}</div>
      <ScenarioFormRow label={AGREE_TERM_LABELS.checkboxBackground}>
        <input
          type="color"
          className="ss-agree-term-design-modal__color"
          value={resolved.checkbox.background_color}
          onChange={changeColor('checkbox', 'background_color')}
        />
      </ScenarioFormRow>
      <ScenarioFormRow label={AGREE_TERM_LABELS.checkboxBorderColor}>
        <input
          type="color"
          className="ss-agree-term-design-modal__color"
          value={resolved.checkbox.border_color}
          onChange={changeColor('checkbox', 'border_color')}
        />
      </ScenarioFormRow>
      <ScenarioFormRow label={AGREE_TERM_LABELS.checkboxBorderWidth}>
        <input
          type="number"
          className="ss-input-value ss-agree-term-design-modal__number"
          min={AGREE_TERM_BORDER_WIDTH_MIN}
          max={AGREE_TERM_BORDER_WIDTH_MAX}
          value={resolved.checkbox.border_width}
          onChange={changeNumber(
            'checkbox',
            'border_width',
            AGREE_TERM_BORDER_WIDTH_MIN,
            AGREE_TERM_BORDER_WIDTH_MAX,
          )}
        />
      </ScenarioFormRow>
      <ScenarioFormRow label={AGREE_TERM_LABELS.checkboxSize}>
        <input
          type="number"
          className="ss-input-value ss-agree-term-design-modal__number"
          min={AGREE_TERM_CHECKBOX_SIZE_MIN}
          max={AGREE_TERM_CHECKBOX_SIZE_MAX}
          value={resolved.checkbox.size}
          onChange={changeNumber(
            'checkbox',
            'size',
            AGREE_TERM_CHECKBOX_SIZE_MIN,
            AGREE_TERM_CHECKBOX_SIZE_MAX,
          )}
        />
      </ScenarioFormRow>
      <ScenarioFormRow label={AGREE_TERM_LABELS.tickColor}>
        <input
          type="color"
          className="ss-agree-term-design-modal__color"
          value={resolved.checkbox.tick_color}
          onChange={changeColor('checkbox', 'tick_color')}
        />
      </ScenarioFormRow>
      <ScenarioFormRow label={AGREE_TERM_LABELS.tickWidth}>
        <input
          type="number"
          className="ss-input-value ss-agree-term-design-modal__number"
          min={AGREE_TERM_TICK_WIDTH_MIN}
          max={AGREE_TERM_TICK_WIDTH_MAX}
          value={resolved.checkbox.tick_width}
          onChange={changeNumber(
            'checkbox',
            'tick_width',
            AGREE_TERM_TICK_WIDTH_MIN,
            AGREE_TERM_TICK_WIDTH_MAX,
          )}
        />
      </ScenarioFormRow>

      <div className="ss-agree-term-design-modal__section">{AGREE_TERM_LABELS.labelSection}</div>
      <ScenarioFormRow label={AGREE_TERM_LABELS.labelFontSize}>
        <input
          type="number"
          className="ss-input-value ss-agree-term-design-modal__number"
          min={AGREE_TERM_LABEL_FONT_SIZE_MIN}
          max={AGREE_TERM_LABEL_FONT_SIZE_MAX}
          value={resolved.label.font_size}
          onChange={changeNumber(
            'label',
            'font_size',
            AGREE_TERM_LABEL_FONT_SIZE_MIN,
            AGREE_TERM_LABEL_FONT_SIZE_MAX,
          )}
        />
      </ScenarioFormRow>
      <ScenarioModalCheckbox
        checked={resolved.label.bold}
        onChange={(bold) => patchGroup('label', { bold })}
        label={AGREE_TERM_LABELS.bold}
      />
      <ScenarioFormRow label={AGREE_TERM_LABELS.labelColor}>
        <input
          type="color"
          className="ss-agree-term-design-modal__color"
          value={resolved.label.color}
          onChange={changeColor('label', 'color')}
        />
      </ScenarioFormRow>

      <div className="ss-agree-term-design-modal__section">{AGREE_TERM_LABELS.alignSection}</div>
      <div className="ss-agree-term-design-modal__align">
        {ALIGN_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={alignButtonClass(option.value)}
            onClick={() => emit({ ...resolved, align: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>
    </ScenarioModalShell>
  );
};

AgreeTermDesignModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  design: agreeTermDesignPropType,
  canCollapse: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

AgreeTermDesignModal.defaultProps = {
  design: undefined,
};

export default AgreeTermDesignModal;
