import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  RADIO_OPTION_DESIGN_COMMON_KEY,
  RADIO_OPTION_DESIGN_STATES,
  RADIO_OPTION_DESIGN_TYPES,
  RADIO_OPTION_HEIGHT_MAX,
  RADIO_OPTION_HEIGHT_MIN,
  RADIO_OPTION_PADDING_MAX,
  RADIO_OPTION_PADDING_MIN,
  RADIO_OPTION_TEXT_SIZE_MAX,
  RADIO_OPTION_TEXT_SIZE_MIN,
  areRadioOptionDesignsEqual,
  buildRadioOptionDesignVars,
  buildRadioPreviewPaneVars,
  getAllowedRadioOptionCommonFields,
  getAllowedRadioOptionDesignFields,
  liftRadioOptionDesignCommonForDraft,
  resolveRadioOptionDesign,
  resolveRadioPreviewTheme,
  sanitizeRadioOptionDesign,
  seedRadioOptionDesignImagesFromOption,
  shouldApplyRadioOptionTwinkle,
} from '../../utils/radioOptionDesign';
import '../../styles/contentSettings/radioOptionDesignModal.css';

const RADIO_OPTION_DESIGN_MODAL_WIDTH = 1040;
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

const toNumberInputText = (value) => {
  if (value === undefined || value === null || value === '') return '';
  return String(value);
};

const NumberField = ({
  value,
  min,
  max,
  onCommit,
  onClear,
  placeholder,
}) => {
  const [text, setText] = useState(toNumberInputText(value));
  const showClear = text !== '';

  useEffect(() => {
    setText(toNumberInputText(value));
  }, [value]);

  const emitLiveValue = (nextText) => {
    if (nextText === '') {
      onClear();
      return;
    }
    const parsed = Number.parseInt(nextText, 10);
    if (!Number.isFinite(parsed)) return;
    onCommit(parsed);
  };

  const commitClamped = () => {
    if (text === '') {
      onClear();
      return;
    }
    const parsed = Number.parseInt(text, 10);
    if (!Number.isFinite(parsed)) {
      setText(toNumberInputText(value));
      return;
    }
    const clamped = Math.min(max, Math.max(min, parsed));
    onCommit(clamped);
    setText(String(clamped));
  };

  return (
    <div className="ss-radio-option-design-modal__inline">
      <div className="ss-radio-option-design-modal__number-group">
        <input
          type="number"
          className="ss-radio-option-design-modal__number"
          min={min}
          max={max}
          value={text}
          placeholder={placeholder}
          onChange={(event) => {
            const nextText = event.target.value;
            setText(nextText);
            emitLiveValue(nextText);
          }}
          onBlur={commitClamped}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commitClamped();
            }
          }}
        />
        <span className="ss-radio-option-design-modal__unit">{UNIT_PX}</span>
      </div>
      {showClear ? (
        <button
          type="button"
          className="ss-radio-option-design-modal__clear"
          onClick={() => {
            setText('');
            onClear();
          }}
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
  onCommit: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

NumberField.defaultProps = {
  value: '',
  placeholder: '',
};

const chipTypeModifier = (designType) => {
  if (designType === RADIO_OPTION_DESIGN_TYPES.GENDER) {
    return 'ss-radio-option-design-modal__preview-chip--gender';
  }
  if (
    designType === RADIO_OPTION_DESIGN_TYPES.RADIO_BUTTON_IMG
    || designType === RADIO_OPTION_DESIGN_TYPES.UPSELL_BUTTON
  ) {
    return 'ss-radio-option-design-modal__preview-chip--image';
  }
  return 'ss-radio-option-design-modal__preview-chip--default';
};

const DesignPreviewChip = ({
  designType,
  draft,
  theme,
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
    theme,
    selectionState,
    clampNumbers: false,
  });
  const style = buildRadioOptionDesignVars(resolved);
  const twinkle = shouldApplyRadioOptionTwinkle(resolved);
  const isGender = designType === RADIO_OPTION_DESIGN_TYPES.GENDER;
  const supportsImage = designType !== RADIO_OPTION_DESIGN_TYPES.DEFAULT;
  const showImage = supportsImage && Boolean(resolved.image);
  // Gender live tiles are icon-first; keep label out of the compact modal chip
  // (text beside a fixed-height tile wraps to one letter per line).
  const showText = designType === RADIO_OPTION_DESIGN_TYPES.DEFAULT
    || (isGender && !showImage);
  const isImageType = designType === RADIO_OPTION_DESIGN_TYPES.RADIO_BUTTON_IMG
    || designType === RADIO_OPTION_DESIGN_TYPES.UPSELL_BUTTON
    || isGender;
  const isSelected = selectionState === RADIO_OPTION_DESIGN_STATES.SELECTED;
  const chipClassName = [
    'ss-radio-option-design-modal__preview-chip',
    chipTypeModifier(designType),
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
        {isImageType && !showImage ? (
          <span className="ss-radio-option-design-modal__preview-placeholder">
            {RADIO_BUTTON_LABELS.designPreviewNoImage}
          </span>
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
  theme: PropTypes.object,
  selectionState: PropTypes.string.isRequired,
  stateTitle: PropTypes.string.isRequired,
  previewLabel: PropTypes.string.isRequired,
  previewImage: PropTypes.string,
};

DesignPreviewChip.defaultProps = {
  theme: {},
  previewImage: '',
};

const RadioOptionDesignModal = ({
  open,
  onClose,
  onSave,
  onSyncToOthers,
  canSyncToOthers,
  design,
  designType,
  onOpenImagePicker,
  previewLabel,
  previewImage,
}) => {
  const snapshotRef = useRef({});
  const [draft, setDraft] = useState({});
  const allowedFields = getAllowedRadioOptionDesignFields(designType);
  const allowedCommonFields = getAllowedRadioOptionCommonFields(designType);
  const showTextInCommon = allowedCommonFields.includes('text_size');
  const showHeight = allowedCommonFields.includes('height');
  const showImageField = allowedFields.includes('image');
  const sampleLabel = previewLabel || RADIO_BUTTON_LABELS.designPreviewSample;
  const commonValues = draft[RADIO_OPTION_DESIGN_COMMON_KEY] || {};
  const previewTheme = useMemo(
    () => (open ? resolveRadioPreviewTheme() : {}),
    [open],
  );
  const previewPaneStyle = useMemo(
    () => buildRadioPreviewPaneVars(previewTheme),
    [previewTheme],
  );

  useEffect(() => {
    if (!open) return;
    const sanitized = sanitizeRadioOptionDesign(design, designType);
    // Snapshot stays unlifted so Cancel does not dirty.
    snapshotRef.current = cloneDesign(sanitized);
    const lifted = liftRadioOptionDesignCommonForDraft(sanitized, designType);
    setDraft(seedRadioOptionDesignImagesFromOption(lifted, previewImage, designType));
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
      return sanitizeRadioOptionDesign(next, designType, { clampNumbers: false });
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

  const patchNestedField = (bucketKey, field, value) => {
    setDraft((current) => {
      const next = cloneDesign(current);
      const bucket = { ...(next[bucketKey] || {}) };
      if (value === null || value === undefined || value === '') {
        delete bucket[field];
      } else {
        bucket[field] = value;
      }
      if (Object.keys(bucket).length === 0) {
        delete next[bucketKey];
      } else {
        next[bucketKey] = bucket;
      }
      return sanitizeRadioOptionDesign(next, designType, { clampNumbers: false });
    });
  };

  const patchStateField = (stateKey, field, value) => {
    patchNestedField(stateKey, field, value);
  };

  const patchCommonField = (field, value) => {
    patchNestedField(RADIO_OPTION_DESIGN_COMMON_KEY, field, value);
  };

  const handleCancel = () => {
    if (!areRadioOptionDesignsEqual(design, snapshotRef.current, designType)) {
      onSave(snapshotRef.current);
    }
    onClose();
  };

  const handleSave = () => {
    onSave(sanitizeRadioOptionDesign(draft, designType));
    onClose();
  };

  const handleSyncToOthers = () => {
    if (!onSyncToOthers) return;
    onSyncToOthers(sanitizeRadioOptionDesign(draft, designType));
    onClose();
  };

  const renderCommonSection = () => (
    <DesignSection title={RADIO_BUTTON_LABELS.designCommon}>
      <div className="ss-radio-option-design-modal__fields">
        {showHeight ? (
          <ScenarioFormRow label={RADIO_BUTTON_LABELS.designHeight}>
            <NumberField
              value={commonValues.height}
              min={RADIO_OPTION_HEIGHT_MIN}
              max={RADIO_OPTION_HEIGHT_MAX}
              placeholder={RADIO_BUTTON_LABELS.designHeightAuto}
              onCommit={(next) => patchCommonField('height', next)}
              onClear={() => patchCommonField('height', null)}
            />
          </ScenarioFormRow>
        ) : null}
        <ScenarioFormRow label={RADIO_BUTTON_LABELS.designBorderWidth}>
          <NumberField
            value={commonValues.border_width}
            min={RADIO_OPTION_BORDER_WIDTH_MIN}
            max={RADIO_OPTION_BORDER_WIDTH_MAX}
            placeholder={RADIO_BUTTON_LABELS.designClear}
            onCommit={(next) => patchCommonField('border_width', next)}
            onClear={() => patchCommonField('border_width', null)}
          />
        </ScenarioFormRow>
        <ScenarioFormRow label={RADIO_BUTTON_LABELS.designPadding}>
          <NumberField
            value={commonValues.padding}
            min={RADIO_OPTION_PADDING_MIN}
            max={RADIO_OPTION_PADDING_MAX}
            placeholder={RADIO_BUTTON_LABELS.designClear}
            onCommit={(next) => patchCommonField('padding', next)}
            onClear={() => patchCommonField('padding', null)}
          />
        </ScenarioFormRow>
        {showTextInCommon ? (
          <ScenarioFormRow label={RADIO_BUTTON_LABELS.designTextSize}>
            <NumberField
              value={commonValues.text_size}
              min={RADIO_OPTION_TEXT_SIZE_MIN}
              max={RADIO_OPTION_TEXT_SIZE_MAX}
              placeholder={RADIO_BUTTON_LABELS.designClear}
              onCommit={(next) => patchCommonField('text_size', next)}
              onClear={() => patchCommonField('text_size', null)}
            />
          </ScenarioFormRow>
        ) : null}
      </div>
    </DesignSection>
  );

  const renderStateSection = (section) => {
    const stateValues = draft[section.key] || {};
    return (
      <DesignSection key={section.key} title={section.title}>
        <div className="ss-radio-option-design-modal__fields">
          <ScenarioFormRow label={RADIO_BUTTON_LABELS.designBorderColor}>
            <ColorField
              value={stateValues.border_color}
              onChange={(event) => patchStateField(section.key, 'border_color', event.target.value)}
              onClear={() => patchStateField(section.key, 'border_color', null)}
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
          <ScenarioFormRow label={RADIO_BUTTON_LABELS.designBackgroundColor}>
            <ColorField
              value={stateValues.background_color}
              onChange={(event) => patchStateField(section.key, 'background_color', event.target.value)}
              onClear={() => patchStateField(section.key, 'background_color', null)}
            />
          </ScenarioFormRow>
          {showTextInCommon ? (
            <ScenarioFormRow label={RADIO_BUTTON_LABELS.designTextColor}>
              <ColorField
                value={stateValues.text_color}
                onChange={(event) => patchStateField(section.key, 'text_color', event.target.value)}
                onClear={() => patchStateField(section.key, 'text_color', null)}
              />
            </ScenarioFormRow>
          ) : null}
          {showImageField ? (
            <ScenarioFormRow
              className="ss-settings-form-row--full"
              label={RADIO_BUTTON_LABELS.designImage}
            >
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
        </div>
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
        <div className="ss-radio-option-design-modal__footer">
          {canSyncToOthers && onSyncToOthers ? (
            <button
              type="button"
              className="ss-radio-option-design-modal__sync"
              onClick={handleSyncToOthers}
            >
              {RADIO_BUTTON_LABELS.designSyncToOthers}
            </button>
          ) : null}
          <ScenarioModalFooter
            onClose={handleCancel}
            onConfirm={handleSave}
            closeLabel={RADIO_BUTTON_LABELS.designCancel}
            confirmLabel={RADIO_BUTTON_LABELS.designSave}
          />
        </div>
      )}
    >
      <div
        className="ss-radio-option-design-modal"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        role="presentation"
      >
        <div className="ss-radio-option-design-modal__forms">
          {renderCommonSection()}
          {STATE_SECTIONS.map(renderStateSection)}
        </div>
        <aside
          className="ss-radio-option-design-modal__preview-pane"
          style={previewPaneStyle}
        >
          <div className="ss-radio-option-design-modal__preview-title">
            {RADIO_BUTTON_LABELS.designPreview}
          </div>
          <div className="ss-radio-option-design-modal__preview-list">
            {STATE_SECTIONS.map((section) => (
              <DesignPreviewChip
                key={section.key}
                designType={designType}
                draft={draft}
                theme={previewTheme}
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
  onSyncToOthers: PropTypes.func,
  canSyncToOthers: PropTypes.bool,
  design: PropTypes.object,
  designType: PropTypes.string.isRequired,
  onOpenImagePicker: PropTypes.func.isRequired,
  previewLabel: PropTypes.string,
  previewImage: PropTypes.string,
};

RadioOptionDesignModal.defaultProps = {
  onSyncToOthers: undefined,
  canSyncToOthers: false,
  design: {},
  previewLabel: '',
  previewImage: '',
};

export default RadioOptionDesignModal;
