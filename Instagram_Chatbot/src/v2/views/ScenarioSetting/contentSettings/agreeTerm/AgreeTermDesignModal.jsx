import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AgreeTermDetailBody from 'v2/components/BotMessages/AgreeTermDetailBody';
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

const AGREE_TERM_DESIGN_MODAL_WIDTH = 720;

const ALIGN_OPTIONS = [
  { value: AGREE_TERM_ALIGN.LEFT, label: AGREE_TERM_LABELS.alignLeft },
  { value: AGREE_TERM_ALIGN.CENTER, label: AGREE_TERM_LABELS.alignCenter },
  { value: AGREE_TERM_ALIGN.RIGHT, label: AGREE_TERM_LABELS.alignRight },
];

const filledOrSample = (value, sample) => {
  const text = value ?? '';
  if (text.trim()) return text;
  return sample;
};

const DesignSection = ({ title, children, className }) => (
  <section className={`ss-agree-term-design-modal__card ${className}`.trim()}>
    {title ? <div className="ss-agree-term-design-modal__section">{title}</div> : null}
    {children}
  </section>
);

DesignSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

DesignSection.defaultProps = {
  title: '',
  className: '',
};

const ColorControl = ({ value, onChange }) => (
  <label className="ss-agree-term-design-modal__swatch">
    <input
      type="color"
      className="ss-agree-term-design-modal__color"
      value={value}
      onChange={onChange}
    />
    <span className="ss-agree-term-design-modal__hex">{value}</span>
  </label>
);

ColorControl.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const NumberControl = ({
  value,
  min,
  max,
  onChange,
}) => (
  <input
    type="number"
    className="ss-agree-term-design-modal__number"
    min={min}
    max={max}
    value={value}
    onChange={onChange}
  />
);

NumberControl.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

const AgreeTermDesignModal = ({
  open,
  onClose,
  design,
  title,
  term,
  termsText,
  canCollapse,
  onChange,
}) => {
  const resolved = resolveAgreeTermDesign(design);
  const [sampleChecked, setSampleChecked] = useState(false);
  const showDefaultCollapse = canCollapse && resolved.collapse.enabled;
  const sampleTitle = filledOrSample(title, AGREE_TERM_LABELS.sampleTitle);
  const sampleTerm = filledOrSample(term, AGREE_TERM_LABELS.sampleTerm);
  const sampleContent = filledOrSample(termsText, AGREE_TERM_LABELS.sampleContent);

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

  return (
    <ScenarioModalShell
      open={open}
      onClose={onClose}
      title={AGREE_TERM_LABELS.designModalTitle}
      width={AGREE_TERM_DESIGN_MODAL_WIDTH}
    >
      <div className="ss-agree-term-design-modal">
        <DesignSection title={AGREE_TERM_LABELS.sampleLabel} className="ss-agree-term-design-modal__sample">
          <AgreeTermDetailBody
            title={sampleTitle}
            titleRequire
            content={sampleContent}
            term={sampleTerm}
            design={resolved}
            isAgree={sampleChecked}
            onAgreeChange={setSampleChecked}
          />
        </DesignSection>

        <DesignSection title={AGREE_TERM_LABELS.designTitleSection}>
          <ScenarioFormRow label={AGREE_TERM_LABELS.titleColor}>
            <div className="ss-agree-term-design-modal__inline">
              <ColorControl
                value={resolved.title.color}
                onChange={changeColor('title', 'color')}
              />
              <ScenarioModalCheckbox
                checked={resolved.title.bold}
                onChange={(bold) => patchGroup('title', { bold })}
                label={AGREE_TERM_LABELS.bold}
              />
            </div>
          </ScenarioFormRow>
        </DesignSection>

        <DesignSection title={AGREE_TERM_LABELS.collapseSection}>
          <div className="ss-agree-term-design-modal__check">
            <ScenarioModalCheckbox
              checked={canCollapse && resolved.collapse.enabled}
              disabled={!canCollapse}
              onChange={changeCollapseEnabled}
              label={AGREE_TERM_LABELS.collapseEnable}
            />
          </div>
          {!canCollapse && (
            <p className="ss-agree-term-design-modal__hint">{AGREE_TERM_LABELS.collapseNeedsTitle}</p>
          )}
          {showDefaultCollapse && (
            <div className="ss-agree-term-design-modal__check">
              <ScenarioModalCheckbox
                checked={resolved.collapse.default_collapsed}
                onChange={(defaultCollapsed) => patchGroup('collapse', { default_collapsed: defaultCollapsed })}
                label={AGREE_TERM_LABELS.collapseDefault}
              />
            </div>
          )}
        </DesignSection>

        <DesignSection title={AGREE_TERM_LABELS.checkboxSection}>
          <div className="ss-agree-term-design-modal__pair">
            <ScenarioFormRow label={AGREE_TERM_LABELS.checkboxBackground}>
              <ColorControl
                value={resolved.checkbox.background_color}
                onChange={changeColor('checkbox', 'background_color')}
              />
            </ScenarioFormRow>
            <ScenarioFormRow label={AGREE_TERM_LABELS.checkboxBorderColor}>
              <ColorControl
                value={resolved.checkbox.border_color}
                onChange={changeColor('checkbox', 'border_color')}
              />
            </ScenarioFormRow>
          </div>
          <div className="ss-agree-term-design-modal__pair">
            <ScenarioFormRow label={AGREE_TERM_LABELS.checkboxBorderWidth}>
              <div className="ss-agree-term-design-modal__number-group">
                <NumberControl
                  value={resolved.checkbox.border_width}
                  min={AGREE_TERM_BORDER_WIDTH_MIN}
                  max={AGREE_TERM_BORDER_WIDTH_MAX}
                  onChange={changeNumber(
                    'checkbox',
                    'border_width',
                    AGREE_TERM_BORDER_WIDTH_MIN,
                    AGREE_TERM_BORDER_WIDTH_MAX,
                  )}
                />
                <span className="ss-agree-term-design-modal__unit">{AGREE_TERM_LABELS.pxUnit}</span>
              </div>
            </ScenarioFormRow>
            <ScenarioFormRow label={AGREE_TERM_LABELS.checkboxSize}>
              <div className="ss-agree-term-design-modal__number-group">
                <NumberControl
                  value={resolved.checkbox.size}
                  min={AGREE_TERM_CHECKBOX_SIZE_MIN}
                  max={AGREE_TERM_CHECKBOX_SIZE_MAX}
                  onChange={changeNumber(
                    'checkbox',
                    'size',
                    AGREE_TERM_CHECKBOX_SIZE_MIN,
                    AGREE_TERM_CHECKBOX_SIZE_MAX,
                  )}
                />
                <span className="ss-agree-term-design-modal__unit">{AGREE_TERM_LABELS.pxUnit}</span>
              </div>
            </ScenarioFormRow>
          </div>
          <div className="ss-agree-term-design-modal__pair">
            <ScenarioFormRow label={AGREE_TERM_LABELS.tickColor}>
              <ColorControl
                value={resolved.checkbox.tick_color}
                onChange={changeColor('checkbox', 'tick_color')}
              />
            </ScenarioFormRow>
            <ScenarioFormRow label={AGREE_TERM_LABELS.tickWidth}>
              <div className="ss-agree-term-design-modal__number-group">
                <NumberControl
                  value={resolved.checkbox.tick_width}
                  min={AGREE_TERM_TICK_WIDTH_MIN}
                  max={AGREE_TERM_TICK_WIDTH_MAX}
                  onChange={changeNumber(
                    'checkbox',
                    'tick_width',
                    AGREE_TERM_TICK_WIDTH_MIN,
                    AGREE_TERM_TICK_WIDTH_MAX,
                  )}
                />
                <span className="ss-agree-term-design-modal__unit">{AGREE_TERM_LABELS.pxUnit}</span>
              </div>
            </ScenarioFormRow>
          </div>
        </DesignSection>

        <DesignSection title={AGREE_TERM_LABELS.labelSection}>
          <ScenarioFormRow label={AGREE_TERM_LABELS.labelFontSize}>
            <div className="ss-agree-term-design-modal__inline">
              <div className="ss-agree-term-design-modal__number-group">
                <NumberControl
                  value={resolved.label.font_size}
                  min={AGREE_TERM_LABEL_FONT_SIZE_MIN}
                  max={AGREE_TERM_LABEL_FONT_SIZE_MAX}
                  onChange={changeNumber(
                    'label',
                    'font_size',
                    AGREE_TERM_LABEL_FONT_SIZE_MIN,
                    AGREE_TERM_LABEL_FONT_SIZE_MAX,
                  )}
                />
                <span className="ss-agree-term-design-modal__unit">{AGREE_TERM_LABELS.pxUnit}</span>
              </div>
              <ScenarioModalCheckbox
                checked={resolved.label.bold}
                onChange={(bold) => patchGroup('label', { bold })}
                label={AGREE_TERM_LABELS.bold}
              />
            </div>
          </ScenarioFormRow>
          <ScenarioFormRow label={AGREE_TERM_LABELS.labelColor}>
            <ColorControl
              value={resolved.label.color}
              onChange={changeColor('label', 'color')}
            />
          </ScenarioFormRow>
        </DesignSection>

        <DesignSection>
          <ScenarioFormRow label={AGREE_TERM_LABELS.alignSection}>
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
          </ScenarioFormRow>
        </DesignSection>
      </div>
    </ScenarioModalShell>
  );
};

AgreeTermDesignModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  design: agreeTermDesignPropType,
  title: PropTypes.string,
  term: PropTypes.string,
  termsText: PropTypes.string,
  canCollapse: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

AgreeTermDesignModal.defaultProps = {
  design: undefined,
  title: '',
  term: '',
  termsText: '',
};

export default AgreeTermDesignModal;
