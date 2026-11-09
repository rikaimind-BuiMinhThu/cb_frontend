import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MDBIcon } from 'mdbreact';
import { BORDER_TWINKLE_EFFECT_OPTIONS } from 'v2/views/DesignSetting/constants/designThemeConstants';
import ScenarioModalShell from '../../components/modals/shared/ScenarioModalShell';
import ScenarioModalFooter from '../../components/modals/shared/ScenarioModalFooter';
import ScenarioFormRow from '../../components/modals/shared/ScenarioFormRow';
import { RADIO_BUTTON_LABELS } from '../../constants/scenarioSettingLabels';
import {
  RADIO_OPTION_BORDER_WIDTH_MAX,
  RADIO_OPTION_BORDER_WIDTH_MIN,
  RADIO_OPTION_DESIGN_STATES,
  RADIO_OPTION_DESIGN_TYPES,
  RADIO_OPTION_PADDING_MAX,
  RADIO_OPTION_PADDING_MIN,
  RADIO_OPTION_TEXT_SIZE_MAX,
  RADIO_OPTION_TEXT_SIZE_MIN,
  buildRadioOptionDesignVars,
  getAllowedRadioOptionDesignFields,
  resolveRadioOptionDesign,
  sanitizeRadioOptionDesign,
  shouldApplyRadioOptionTwinkle,
} from '../../utils/radioOptionDesign';
import '../../styles/contentSettings/radioOptionDesignModal.css';

const RADIO_OPTION_DESIGN_MODAL_WIDTH = 960;
const COLOR_PICKER_FALLBACK = '#cccccc';
const UNIT_PX = 'px';
const EMPTY_IMAGE_ALT = '';

const STATE_SECTIONS = [
  {
    key: RADIO_OPTION_DESIGN_STATES.NORMAL,
    title: RADIO_BUTTON_LABELS.designStateNormal,
  },
  {
    key: RADIO_OPTION_DESIGN_STATES.SELECTED,
    title: RADIO_BUTTON_LABELS.designStateSelected,
  },
  {
    key: RADIO_OPTION_DESIGN_STATES.UNSELECTED,
    title: RADIO_BUTTON_LABELS.designStateUnselected,
  },
];

const cloneDesign = (design) => {
  if (!design || typeof design !== 'object') return {};
  return JSON.parse(JSON.stringify(design));
};

const DesignSection = ({ title, children }) => (
  <section className="ss-radio-option-design-modal__card">
    <div className="ss-radio-option-design-modal__section">{title}</div>
    {children}
  </section>
);

DesignSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const ColorField = ({ value, onChange, onClear }) => {
  const hasValue = typeof value === 'string' && value !== '';
  return (
    <div className="ss-radio-option-design-modal__inline">
      <label className="ss-radio-option-design-modal__swatch">
        <input
          type="color"
          className="ss-radio-option-design-modal__color"
          value={hasValue ? value : COLOR_PICKER_FALLBACK}
          onChange={onChange}
        />
        <span className="ss-radio-option-design-modal__hex">
          {hasValue ? value : RADIO_BUTTON_LABELS.designClear}
        </span>
      </label>
      {hasValue ? (
        <button
          type="button"
          className="ss-radio-option-design-modal__clear"
          onClick={onClear}
        >
          {RADIO_BUTTON_LABELS.designClear}
        </button>
      ) : null}
    </div>
  );
};

ColorField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

ColorField.defaultProps = {
  value: '',
};

const NumberField = ({
  value,
  min,
  max,
  onChange,
  onClear,
}) => {
  const hasValue = value !== undefined && value !== null && value !== '';
  return (
    <div className="ss-radio-option-design-modal__inline">
      <div className="ss-radio-option-design-modal__number-group">
        <input
          type="number"
          className="ss-radio-option-design-modal__number"
          min={min}
          max={max}
          value={hasValue ? value : ''}
          onChange={onChange}
        />
        <span className="ss-radio-option-design-modal__unit">{UNIT_PX}</span>
      </div>
      {hasValue ? (
        <button
          type="button"
          className="ss-radio-option-design-modal__clear"
          onClick={onClear}
        >
          {RADIO_BUTTON_LABELS.designClear}
        </button>
      ) : null}
    </div>
  );
};

NumberField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

NumberField.defaultProps = {
  value: '',
};

const DesignPreviewChip = ({
  designType,
  draft,
  selectionState,
  stateTitle,
  previewLabel,
  previewImage,
}) => {
  const radioButton = { type: designType };
  const option = {
    design: draft,
    text: previewLabel,
    img: previewImage,
  };
  const resolved = resolveRadioOptionDesign({
    option,
    radioButton,
    selectionState,
  });
  const style = buildRadioOptionDesignVars(resolved);
  const twinkle = shouldApplyRadioOptionTwinkle(resolved);
  const showImage = Boolean(
    resolved.image
    && designType !== RADIO_OPTION_DESIGN_TYPES.DEFAULT,
  );
  const showText = designType === RADIO_OPTION_DESIGN_TYPES.DEFAULT
    || designType === RADIO_OPTION_DESIGN_TYPES.GENDER;
  const isSelected = selectionState === RADIO_OPTION_DESIGN_STATES.SELECTED;
  const chipClassName = [
    'ss-radio-option-design-modal__preview-chip',
    isSelected ? 'ss-radio-option-design-modal__preview-chip--selected' : '',
    twinkle ? 'ss-radio-option-design-modal__preview-chip--twinkle' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="ss-radio-option-design-modal__preview-item">
      <div className="ss-radio-option-design-modal__preview-label">{stateTitle}</div>
      <div className={chipClassName} style={style}>
        {showImage ? (
          <img
            className="ss-radio-option-design-modal__preview-image"
            src={resolved.image}
            alt={EMPTY_IMAGE_ALT}
          />
        ) : null}
        {showText ? (
          <span className="ss-radio-option-design-modal__preview-text">{previewLabel}</span>
        ) : null}
      </div>
    </div>
  );
};

DesignPreviewChip.propTypes = {
  designType: PropTypes.string.isRequired,
  draft: PropTypes.object.isRequired,
  selectionState: PropTypes.string.isRequired,
  stateTitle: PropTypes.string.isRequired,
  previewLabel: PropTypes.string.isRequired,
  previewImage: PropTypes.string,
};

DesignPreviewChip.defaultProps = {
  previewImage: '',
};

const RadioOptionDesignModal = ({
  open,
  onClose,
  onSave,
  design,
  designType,
  onOpenImagePicker,
  previewLabel,
  previewImage,
}) => {
  const snapshotRef = useRef({});
  const [draft, setDraft] = useState({});
  const allowedFields = getAllowedRadioOptionDesignFields(designType);
  const showTextFields = allowedFields.includes('text_size');
  const showImageField = allowedFields.includes('image');
  const sampleLabel = previewLabel || RADIO_BUTTON_LABELS.designPreviewSample;

  useEffect(() => {
    if (!open) return;
    const nextDraft = sanitizeRadioOptionDesign(design, designType);
    snapshotRef.current = cloneDesign(nextDraft);
    setDraft(cloneDesign(nextDraft));
    // Re-init only on open/type; draft edits must not reset from prop churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, designType]);

  useEffect(() => {
    if (!open) return;
    setDraft((current) => {
      const next = cloneDesign(current);
      Object.values(RADIO_OPTION_DESIGN_STATES).forEach((stateKey) => {
        const nextImage = design?.[stateKey]?.image;
        if (nextImage === undefined) return;
        if (!next[stateKey]) next[stateKey] = {};
        if (nextImage) {
          next[stateKey].image = nextImage;
          return;
        }
        delete next[stateKey].image;
        if (Object.keys(next[stateKey]).length === 0) {
          delete next[stateKey];
        }
      });
      return sanitizeRadioOptionDesign(next, designType);
    });
    // Sync images written by file picker while modal stays open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    designType,
    design?.normal?.image,
    design?.selected?.image,
    design?.unselected?.image,
  ]);

  const patchStateField = (stateKey, field, value) => {
    setDraft((current) => {
      const next = cloneDesign(current);
      const statePatch = { ...(next[stateKey] || {}) };
      if (value === null || value === undefined || value === '') {
        delete statePatch[field];
      } else {
        statePatch[field] = value;
      }
      if (Object.keys(statePatch).length === 0) {
        delete next[stateKey];
      } else {
        next[stateKey] = statePatch;
      }
      return sanitizeRadioOptionDesign(next, designType);
    });
  };

  const handleCancel = () => {
    onSave(snapshotRef.current);
    onClose();
  };

  const handleSave = () => {
    onSave(sanitizeRadioOptionDesign(draft, designType));
    onClose();
  };

  const renderStateSection = (section) => {
    const stateValues = draft[section.key] || {};
    return (
      <DesignSection key={section.key} title={section.title}>
        <ScenarioFormRow label={RADIO_BUTTON_LABELS.designBorderColor}>
          <ColorField
            value={stateValues.border_color}
            onChange={(event) => patchStateField(section.key, 'border_color', event.target.value)}
            onClear={() => patchStateField(section.key, 'border_color', null)}
          />
        </ScenarioFormRow>
        <ScenarioFormRow label={RADIO_BUTTON_LABELS.designBorderWidth}>
          <NumberField
            value={stateValues.border_width}
            min={RADIO_OPTION_BORDER_WIDTH_MIN}
            max={RADIO_OPTION_BORDER_WIDTH_MAX}
            onChange={(event) => {
              const parsed = Number.parseInt(event.target.value, 10);
              if (!Number.isFinite(parsed)) {
                patchStateField(section.key, 'border_width', null);
                return;
              }
              patchStateField(section.key, 'border_width', parsed);
            }}
            onClear={() => patchStateField(section.key, 'border_width', null)}
          />
        </ScenarioFormRow>
        <ScenarioFormRow label={RADIO_BUTTON_LABELS.designBorderEffect}>
          <div className="ss-radio-option-design-modal__inline">
            <select
              className="ss-radio-option-design-modal__select"
              value={stateValues.border_effect || ''}
              onChange={(event) => {
                const nextValue = event.target.value;
                patchStateField(section.key, 'border_effect', nextValue || null);
              }}
            >
              <option value="">{RADIO_BUTTON_LABELS.designClear}</option>
              {BORDER_TWINKLE_EFFECT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
        </ScenarioFormRow>
        <ScenarioFormRow label={RADIO_BUTTON_LABELS.designPadding}>
          <NumberField
            value={stateValues.padding}
            min={RADIO_OPTION_PADDING_MIN}
            max={RADIO_OPTION_PADDING_MAX}
            onChange={(event) => {
              const parsed = Number.parseInt(event.target.value, 10);
              if (!Number.isFinite(parsed)) {
                patchStateField(section.key, 'padding', null);
                return;
              }
              patchStateField(section.key, 'padding', parsed);
            }}
            onClear={() => patchStateField(section.key, 'padding', null)}
          />
        </ScenarioFormRow>
        {showTextFields ? (
          <>
            <ScenarioFormRow label={RADIO_BUTTON_LABELS.designTextSize}>
              <NumberField
                value={stateValues.text_size}
                min={RADIO_OPTION_TEXT_SIZE_MIN}
                max={RADIO_OPTION_TEXT_SIZE_MAX}
                onChange={(event) => {
                  const parsed = Number.parseInt(event.target.value, 10);
                  if (!Number.isFinite(parsed)) {
                    patchStateField(section.key, 'text_size', null);
                    return;
                  }
                  patchStateField(section.key, 'text_size', parsed);
                }}
                onClear={() => patchStateField(section.key, 'text_size', null)}
              />
            </ScenarioFormRow>
            <ScenarioFormRow label={RADIO_BUTTON_LABELS.designTextColor}>
              <ColorField
                value={stateValues.text_color}
                onChange={(event) => patchStateField(section.key, 'text_color', event.target.value)}
                onClear={() => patchStateField(section.key, 'text_color', null)}
              />
            </ScenarioFormRow>
          </>
        ) : null}
        <ScenarioFormRow label={RADIO_BUTTON_LABELS.designBackgroundColor}>
          <ColorField
            value={stateValues.background_color}
            onChange={(event) => patchStateField(section.key, 'background_color', event.target.value)}
            onClear={() => patchStateField(section.key, 'background_color', null)}
          />
        </ScenarioFormRow>
        {showImageField ? (
          <ScenarioFormRow label={RADIO_BUTTON_LABELS.designImage}>
            <div className="ss-radio-option-design-modal__image-row">
              <input
                type="text"
                className="ss-radio-option-design-modal__image-input"
                placeholder={RADIO_BUTTON_LABELS.designImagePlaceholder}
                value={stateValues.image || ''}
                onChange={(event) => patchStateField(section.key, 'image', event.target.value)}
              />
              <MDBIcon
                fas
                icon="paperclip"
                className="ss-radio-option-design-modal__paperclip"
                onClick={() => onOpenImagePicker(section.key)}
              />
              {stateValues.image ? (
                <button
                  type="button"
                  className="ss-radio-option-design-modal__clear"
                  onClick={() => patchStateField(section.key, 'image', null)}
                >
                  {RADIO_BUTTON_LABELS.designClear}
                </button>
              ) : null}
            </div>
          </ScenarioFormRow>
        ) : null}
      </DesignSection>
    );
  };

  return (
    <ScenarioModalShell
      open={open}
      onClose={handleCancel}
      title={RADIO_BUTTON_LABELS.designModalTitle}
      width={RADIO_OPTION_DESIGN_MODAL_WIDTH}
      className="ss-radio-option-design-modal-shell"
      footer={(
        <ScenarioModalFooter
          onClose={handleCancel}
          onConfirm={handleSave}
          closeLabel={RADIO_BUTTON_LABELS.designCancel}
          confirmLabel={RADIO_BUTTON_LABELS.designSave}
        />
      )}
    >
      <div className="ss-radio-option-design-modal">
        <div className="ss-radio-option-design-modal__forms">
          {STATE_SECTIONS.map(renderStateSection)}
        </div>
        <aside className="ss-radio-option-design-modal__preview-pane">
          <div className="ss-radio-option-design-modal__preview-title">
            {RADIO_BUTTON_LABELS.designPreview}
          </div>
          <div className="ss-radio-option-design-modal__preview-list">
            {STATE_SECTIONS.map((section) => (
              <DesignPreviewChip
                key={section.key}
                designType={designType}
                draft={draft}
                selectionState={section.key}
                stateTitle={section.title}
                previewLabel={sampleLabel}
                previewImage={previewImage}
              />
            ))}
          </div>
        </aside>
      </div>
    </ScenarioModalShell>
  );
};

RadioOptionDesignModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  design: PropTypes.object,
  designType: PropTypes.string.isRequired,
  onOpenImagePicker: PropTypes.func.isRequired,
  previewLabel: PropTypes.string,
  previewImage: PropTypes.string,
};

RadioOptionDesignModal.defaultProps = {
  design: {},
  previewLabel: '',
  previewImage: '',
};

export default RadioOptionDesignModal;
