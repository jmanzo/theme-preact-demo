import { computed, Signal, useSignal } from '@preact/signals';
import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import type { JSX } from 'preact/jsx-runtime';
import styles from '../../styles/nu-input.module.css';

export type NuInputProps = {
  label?: string;
  name: string;
  id?: string;
  initialValue?: string;
  value?: Signal<string>;
  onInputChange?: (value: string, name: string) => void;
  onInputBlur?: (event: JSX.TargetedEvent<HTMLInputElement, FocusEvent>, name: string) => void;
  error?: Signal<string | null> | string | null;
  // Explicitly add props that are passed from parent forms
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};

// Component
// ---------------------------------------
function NuInputInner({
  label,
  name,
  id,
  initialValue = '',
  value: controlledValue,
  onInputChange,
  onInputBlur,
  error: externalError,
  ...rest
}: NuInputProps) {
  const internalValue = useSignal(controlledValue?.value ?? initialValue);
  const internalValidationMsg = useSignal<string | null>(null);

  const inputId = id || `nu-input-${name}`;

  useEffect(() => {
    if (controlledValue && controlledValue.value !== internalValue.value) {
      internalValue.value = controlledValue.value;
    }
  }, [controlledValue, internalValue]);

  const validate = (currentValue: string): boolean => {
    internalValidationMsg.value = null; // Reset internal validation message first

    // Only validate for 'required' if the prop is set and value is empty
    if (rest.required && !currentValue.trim()) {
      internalValidationMsg.value = `${label || name} is required.`;
      return false;
    }

    return true;
  };

  const handleInputChange = (event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const newValue = event.currentTarget.value;
    if (!controlledValue) {
      // If uncontrolled, update internal signal for value
      internalValue.value = newValue;
    }
    validate(newValue);
    if (onInputChange) {
      onInputChange(newValue, name);
    }
  };

  const handleInputBlur = (event: JSX.TargetedEvent<HTMLInputElement, FocusEvent>) => {
    validate(internalValue.value);
    if (onInputBlur) {
      onInputBlur(event, name);
    }
  };

  // Determine final error message to display: externalError takes precedence
  const displayError = computed(() => {
    const extErrorValue = externalError instanceof Signal ? externalError.value : externalError;
    return extErrorValue ?? internalValidationMsg.value;
  });

  const { placeholder: propPlaceholder, ...inputProps } = rest;
  const placeholderText = propPlaceholder ?? label ?? '';

  return (
    <div className={styles['nu-input-container']}>
      {/* Input comes first so the adjacent-sibling selector for the label works */}
      <input
        id={inputId}
        name={name}
        value={internalValue.value}
        onInput={handleInputChange}
        onBlur={handleInputBlur}
        className={`${styles['nu-input__field']} ${displayError.value ? styles['nu-input__field--error'] : ''}`.trim()}
        aria-invalid={!!displayError.value}
        aria-describedby={displayError.value ? `${inputId}-error` : undefined}
        // Provide placeholder only if it was explicitly passed from props. This mirrors the original Liquid snippet
        {...(propPlaceholder !== undefined ? { placeholder: placeholderText } : {})}
        {...inputProps}
      />
      {label && (
        <label htmlFor={inputId} className={styles['nu-input__label']}>
          {label}
        </label>
      )}
    </div>
  );
}

const NuInput = memo(NuInputInner);

export default NuInput;
