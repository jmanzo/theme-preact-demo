import { Signal, computed, signal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { DATEPICKER_LOCALES, DEFAULT_DATEPICKER_CONFIG } from '../../constants/cart-widget';
import { useCartWidgetContext } from '../../contexts/CartWidgetContext';
import styles from '../../styles/nu-input.module.css';
import type { AirDatepicker, AirDatepickerOptions, CellParams, OnSelectParams } from '../../types/AirDatePicker';

export type NuDatePickerProps = {
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  value?: Signal<string> | string;
  onDateChange?: (value: string, name: string) => void;
  error?: Signal<string | null> | string | null;
  required?: boolean;
  disabled?: boolean;
  autocomplete?: string;
  className?: string;
  'aria-label'?: string;
};

export default function NuDatePicker({
  id,
  name,
  label,
  placeholder,
  value: controlledValue,
  onDateChange,
  error: externalError,
  required = false,
  disabled = false,
  autocomplete = 'off',
  className = '',
  'aria-label': ariaLabel,
  ...rest
}: NuDatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const datepickerRef = useRef<AirDatepicker | null>(null);
  const internalValue = signal('');
  const inputId = id || `nu-datepicker-${name}`;
  // Flag to prevent feedback loop between onSelect and useEffect
  const isUpdatingFromDatepicker = useRef(false);

  const { disabledDates } = useCartWidgetContext();
  // Determine the current value
  const currentValue = computed(() => {
    if (controlledValue instanceof Signal) {
      return controlledValue.value || '';
    }
    return controlledValue || internalValue.value || '';
  });
  // Initialize AirDatepicker
  useEffect(() => {
    if (!inputRef.current || !window.AirDatepicker) return;
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Detect user's language preference
    let userLanguage = 'en';
    if (window.Shopify?.locale) {
      userLanguage = window.Shopify.locale.split('-')[0].toLowerCase();
    }
    // Get the appropriate locale, fallback to default if not available
    const locale = DATEPICKER_LOCALES[userLanguage] || DATEPICKER_LOCALES.en;
    // Performance optimization: precompute responsive settings
    const isMobileView = window.innerWidth < 768;
    const position = isMobileView ? 'bottom center' : 'bottom left';
    // Hide the native date input UI
    inputRef.current.type = 'text';

    const options: AirDatepickerOptions = {
      ...DEFAULT_DATEPICKER_CONFIG,
      locale,
      position,
      isMobile: isMobileView,
      buttons: ['today', 'clear'] as string[],
      onSelect: (params: OnSelectParams) => {
        // Set flag to prevent feedback loop
        isUpdatingFromDatepicker.current = true;

        const formattedDate = Array.isArray(params.formattedDate) ? params.formattedDate[0] : params.formattedDate;
        // Update internal value
        if (!controlledValue) {
          internalValue.value = formattedDate;
        }
        // Trigger the change callback
        if (onDateChange) {
          onDateChange(formattedDate, name);
        }
        // Dispatch change event for form handling
        if (inputRef.current) {
          // Update input value to match the selected date
          inputRef.current.value = formattedDate;
          const event = new Event('change', { bubbles: true });
          inputRef.current.dispatchEvent(event);
        }
        // Reset flag after a short delay to allow updates to propagate
        setTimeout(() => {
          isUpdatingFromDatepicker.current = false;
        }, 50);
      },
      onRenderCell: (params: CellParams) => {
        if (params.cellType !== 'day') return {};

        const { date } = params;
        const cellDate = new Date(date);
        cellDate.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();
        const cellTime = cellDate.getTime();
        // Check if date is before today
        const isBeforeToday = cellTime < todayTime;
        // Check if date is in disabledDates array from context
        const isDisabledDate = disabledDates.some((disabledDate) => {
          const disabledDateTime = new Date(disabledDate);
          disabledDateTime.setHours(0, 0, 0, 0);
          return disabledDateTime.getTime() === cellTime;
        });

        const isDisabled = isBeforeToday || isDisabledDate;

        return {
          disabled: isDisabled,
          classes: isDisabled ? '-disabled-' : '',
        };
      },
    };

    try {
      datepickerRef.current = new window.AirDatepicker(inputRef.current, options);
      // Set initial value if provided
      if (currentValue.value) {
        const date = new Date(currentValue.value);
        if (!Number.isNaN(date.getTime())) {
          datepickerRef.current?.selectDate(date);
          // Update input value to match
          if (inputRef.current) {
            inputRef.current.value = currentValue.value;
          }
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error initializing datepicker:', e);
      // Fallback to standard date input if AirDatepicker fails
      if (inputRef.current) {
        inputRef.current.type = 'date';
      }
    }

    // Cleanup function
    // eslint-disable-next-line consistent-return
    return () => {
      if (datepickerRef.current) {
        try {
          datepickerRef.current.destroy();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Error destroying datepicker:', e);
        }
        datepickerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, disabledDates]); // Only reinitialize when name or disabled dates change

  // Update datepicker when controlled value changes externally (not from datepicker itself)
  useEffect(() => {
    // Skip updates if the change is coming from the datepicker itself
    if (isUpdatingFromDatepicker.current) {
      return;
    }

    if (datepickerRef.current && controlledValue instanceof Signal) {
      const { value } = controlledValue;
      if (value) {
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) {
          // Only update if the input value is different to prevent loops
          if (inputRef.current && inputRef.current.value !== value) {
            datepickerRef.current?.selectDate(date);
            inputRef.current.value = value;
          }
        }
      } else if (inputRef.current && inputRef.current.value !== '') {
        datepickerRef.current?.clear();
        inputRef.current.value = '';
      }
    }
  }, [controlledValue]);

  const handleInputBlur = () => {
    if (required && !currentValue.value) {
      inputRef.current?.classList.add('nu-error');
    } else {
      inputRef.current?.classList.remove('nu-error');
    }
  };

  return (
    <div className={styles['nu-input-container']}>
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="date" // Will be changed to text by datepicker
        value={currentValue.value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autocomplete}
        aria-label={ariaLabel || label}
        className={`${styles['nu-input__field']} nu-datepicker__input ${className}`.trim()}
        onBlur={handleInputBlur}
        {...rest}
      />
      {label && (
        <label htmlFor={inputId} className={styles['nu-input__label']}>
          {label}
        </label>
      )}
    </div>
  );
}
