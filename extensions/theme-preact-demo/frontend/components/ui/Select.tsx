import { Signal, useSignal } from '@preact/signals';
import { memo } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import type { JSX } from 'preact/jsx-runtime';
import styles from '../../styles/nu-select.module.css';
import NuIcon from './NuIcon';

// Types
// ---------------------------------------
export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type NuSelectProps = {
  label?: string;
  name: string;
  id?: string;
  options: Signal<SelectOption[]> | SelectOption[];
  initialValue?: string;
  value?: Signal<string>;
  onSelectChange?: (value: string, name: string) => void;
  onSelectBlur?: (event: JSX.TargetedEvent<HTMLSelectElement, FocusEvent>, name: string) => void;
  error?: Signal<string | null> | string | null;
  placeholderOption?: string;
  // Explicitly add props that are passed from parent forms
  required?: boolean;
  disabled?: boolean;
};

// Component
// ---------------------------------------
function NuSelectInner({
  label,
  name,
  id,
  options,
  initialValue = '',
  value: controlledValue,
  onSelectChange,
  onSelectBlur,
  error: externalError,
  placeholderOption,
  ...rest
}: NuSelectProps) {
  const internalValue = useSignal(controlledValue?.value ?? initialValue);
  const internalValidationMsg = useSignal<string | null>(null);
  const currentOptions = options instanceof Signal ? options.value : options;

  const selectId = id || `nu-select-${name}`;

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

  const handleSelectChangeInternal = (event: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    const newValue = event.currentTarget.value;
    if (!controlledValue) {
      internalValue.value = newValue;
    }
    validate(newValue);
    if (onSelectChange) {
      onSelectChange(newValue, name);
    }
  };

  const handleSelectBlurInternal = (event: JSX.TargetedEvent<HTMLSelectElement, FocusEvent>) => {
    validate(internalValue.value);
    if (onSelectBlur) {
      onSelectBlur(event, name);
    }
  };

  return (
    <div className={styles['nu-select-container']}>
      {label && (
        <label htmlFor={selectId} className={styles['nu-select__label']}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={internalValue.value}
        onChange={handleSelectChangeInternal}
        onBlur={handleSelectBlurInternal}
        className={styles['nu-select__field']}
        {...rest}
      >
        {placeholderOption && <option value="">{placeholderOption}</option>}
        {currentOptions.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {/* Chevron icon */}
      <NuIcon name="caret-down" size={14} ariaLabel="Select" className={styles['nu-select__icon']} />
    </div>
  );
}

const NuSelect = memo(NuSelectInner);

export default NuSelect;
