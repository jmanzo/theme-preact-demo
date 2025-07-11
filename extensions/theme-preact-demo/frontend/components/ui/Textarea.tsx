import { type Signal, useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import type { JSX } from 'preact/jsx-runtime';
import styles from '../../styles/nu-textarea.module.css';

// Types
// ---------------------------------------
export type NuTextareaProps = {
  label?: string;
  name: string;
  id?: string;
  initialValue?: string;
  value?: Signal<string>;
  onTextareaChange?: (value: string, name: string) => void;
  onTextareaBlur?: (event: JSX.TargetedEvent<HTMLTextAreaElement, FocusEvent>, name: string) => void;
  error?: Signal<string | null> | string | null;
  // Explicitly add props that are passed from parent forms
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
};

// Component
// ---------------------------------------
function NuTextarea({
  label,
  name,
  id,
  initialValue = '',
  value: controlledValue,
  onTextareaChange,
  onTextareaBlur,
  error: externalError,
  ...rest
}: NuTextareaProps) {
  const internalValue = useSignal(controlledValue?.value ?? initialValue);
  const internalValidationMsg = useSignal<string | null>(null);

  const textareaId = id || `nu-textarea-${name}`;

  useEffect(() => {
    if (controlledValue && controlledValue.value !== internalValue.value) {
      internalValue.value = controlledValue.value;
    }
  }, [controlledValue, internalValue]);

  const validate = (currentValue: string): boolean => {
    internalValidationMsg.value = null;

    if (rest.required && !currentValue.trim()) {
      internalValidationMsg.value = `${label || name} is required.`;
      return false;
    }

    return true;
  };

  const handleTextareaChangeInternal = (event: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
    const newValue = event.currentTarget.value;
    if (!controlledValue) {
      internalValue.value = newValue;
    }
    validate(newValue);
    if (onTextareaChange) {
      onTextareaChange(newValue, name);
    }
  };

  const handleTextareaBlurInternal = (event: JSX.TargetedEvent<HTMLTextAreaElement, FocusEvent>) => {
    validate(internalValue.value);
    if (onTextareaBlur) {
      onTextareaBlur(event, name);
    }
  };

  return (
    <div className={`${styles['nu-textarea-container']} nu-textarea--deliveryinstructions`}>
      <textarea
        id={textareaId}
        name={name}
        value={internalValue.value}
        onInput={handleTextareaChangeInternal}
        onBlur={handleTextareaBlurInternal}
        className={styles['nu-textarea__field']}
        {...rest}
      />
      {label && (
        <label htmlFor={textareaId} className={styles['nu-textarea__label']}>
          {label}
        </label>
      )}
    </div>
  );
}

export default NuTextarea;
