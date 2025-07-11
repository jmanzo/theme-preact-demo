import { computed } from '@preact/signals';
import { useCallback, useMemo } from 'preact/hooks';
import type { SelectOption } from '../components/ui';
import { NuInput, NuSelect, NuTextarea } from '../components/ui';
import type { CartWidgetFormData, DeliveryLocation, DeliveryLocations } from '../types/cart-widget';
import { getFormFieldValue } from '../utils/cart-widget-helpers';

// Hook params type
type UseDeliveryLocationsParams = {
  /** All available delivery locations (metaobjects) */
  locations: DeliveryLocations;
  /** Current form data coming from CartWidget context */
  formData: CartWidgetFormData;
  /** Update helper coming from CartWidget context */
  updateFormData: (updates: CartWidgetFormData) => void;
};

// Type for dynamic delivery field names
type DeliveryFieldName = `delivery[${string}]`;

/**
 * Small util used across the hook to mimic Liquid-side sanitisation.
 * Removes quotes and trims whitespace.
 */
const sanitizeLocationName = (nameStr: string): string => nameStr.replace(/"/g, '').trim();

/**
 * Create a properly typed delivery field name
 */
const createDeliveryFieldName = (label: string): DeliveryFieldName => `delivery[${label}]`;

export function useDeliveryLocations({ locations, formData, updateFormData }: UseDeliveryLocationsParams) {
  /**
   * Options consumed by the Location <select>. We memoise them because
   * they only depend on the locations array, which rarely changes.
   */
  const locationOptions: SelectOption[] = useMemo(
    () =>
      locations.map(({ name }) => {
        const sanitized = sanitizeLocationName(name);
        return {
          value: sanitized,
          label: sanitized,
          disabled: false,
        };
      }),
    [locations]
  );

  /**
   * Metaobject representing the currently selected location.
   * If nothing is selected it returns undefined.
   */
  const selectedLocationObj: DeliveryLocation | undefined = useMemo(() => {
    const selected = formData.location ? sanitizeLocationName(formData.location) : '';
    return locations.find(({ name }) => sanitizeLocationName(name) === selected);
  }, [formData.location, locations]);

  /**
   * Render extra form fields requested by the selected location.
   * It returns a ready-to-mount JSX element so the consumer can drop it
   * straight into the component tree.
   */
  const renderLocationFields = useCallback(() => {
    const fields = selectedLocationObj?.formFields ?? [];
    if (fields.length === 0) return null;

    return fields.map((field) => {
      const fieldName = createDeliveryFieldName(field.label);
      // Create shared props with proper typing
      const baseProps = {
        key: fieldName,
        id: fieldName,
        name: fieldName,
        required: field.required,
        value: computed(() => getFormFieldValue(formData, fieldName)),
        onInputChange: (value: string) => updateFormData({ [fieldName]: value }),
      };

      switch (field.type) {
        case 'textarea':
          return (
            <div className="nu-location-form-field">
              <NuTextarea
                {...baseProps}
                placeholder={field.label + (field.required ? '*' : '')}
                label={field.label + (field.required ? '*' : '')}
                rows={3}
              />
            </div>
          );
        case 'select': {
          const selectOptions: SelectOption[] = field.options ?? [];
          return (
            <div className="nu-location-form-field">
              <NuSelect
                {...baseProps}
                options={selectOptions}
                placeholderOption={field.label + (field.required ? '*' : '')}
              />
            </div>
          );
        }
        case 'input':
        default:
          return (
            <div className="nu-location-form-field">
              <NuInput
                {...baseProps}
                type={field.InputFieldSettings?.type || 'text'}
                placeholder={field.label + (field.required ? '*' : '')}
                label={field.label + (field.required ? '*' : '')}
              />
            </div>
          );
      }
    });
  }, [selectedLocationObj, formData, updateFormData]);

  return {
    locationOptions,
    selectedLocationObj,
    renderLocationFields,
  };
}
