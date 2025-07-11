import { computed } from '@preact/signals';
import { useMemo } from 'preact/hooks';
import { HTML } from '../constants/cart-widget';
import { useCartWidgetContext } from '../contexts/CartWidgetContext';
import styles from '../styles/cart-widget.module.css';
import { generateTimeOptions } from '../utils/cart-widget-helpers';
import { NuDatePicker, NuInput, NuSelect, type SelectOption } from './ui';

function PickupForm() {
  const { formData, updateFormData, currentTab, appSettings, blockSettings } = useCartWidgetContext();

  const isPickupActive = computed(() => currentTab === 'pickup');

  const pickupTimeOptions: SelectOption[] = useMemo(
    () => generateTimeOptions('pickup', appSettings, blockSettings),
    [appSettings, blockSettings]
  );

  const showTimezoneMessage = !!blockSettings?.show_timezone_message;

  const dateTimePickerSetting = blockSettings?.date_time_pickers ?? 'both';
  const showDateTimeBlock = dateTimePickerSetting !== 'none';
  const showDatePicker = dateTimePickerSetting !== 'time' && dateTimePickerSetting !== 'none';
  const showTimePicker = dateTimePickerSetting !== 'date' && dateTimePickerSetting !== 'none';

  return (
    <fieldset
      className={`${styles['nu-form__fields']} ${isPickupActive.value ? '' : HTML.CLASS.hidden}`}
      data-content="pickup"
      disabled={!isPickupActive.value}
    >
      <div className={styles['nu-fields-container']}>
        {showDateTimeBlock && (
          <div className={styles['nu-fields']}>
            <p className="nu-line-height-1-1">Pickup Time</p>
            <div className={styles['nu-times']}>
              {showDatePicker && (
                <NuDatePicker
                  id="pickupDate"
                  name="pickupDate"
                  placeholder="Pickup Date*"
                  label="Pickup Date"
                  value={computed(() => formData.pickupDate || '')}
                  onDateChange={(value: string) => updateFormData({ pickupDate: value })}
                  required={showDatePicker}
                  disabled={!isPickupActive.value}
                  aria-label="Pickup Date"
                />
              )}

              {showTimePicker && (
                <NuSelect
                  id="pickupTime"
                  name="pickupTime"
                  options={pickupTimeOptions}
                  placeholderOption="Pickup Time*"
                  value={computed(() => formData.pickupTime || '')}
                  onSelectChange={(value: string) => updateFormData({ pickupTime: value })}
                  required={showTimePicker}
                  disabled={!isPickupActive.value}
                  aria-label="Pickup Time"
                />
              )}
            </div>

            {showTimezoneMessage && <p className="nu-font-13">All times are in your local timezone</p>}
          </div>
        )}
      </div>

      <div className={styles['nu-fields-container']}>
        <div className={styles['nu-fields']}>
          <p className="nu-line-height-1-1">Customer Information</p>

          <div className={styles['nu-delivery-instructions']}>
            <NuInput
              id="firstName"
              name="firstName"
              type="text"
              label="First Name"
              placeholder="First Name*"
              value={computed(() => formData.firstName || '')}
              onInputChange={(value: string) => updateFormData({ firstName: value })}
              required
              aria-label="First Name"
            />

            <NuInput
              id="lastName"
              name="lastName"
              type="text"
              label="Last Name"
              placeholder="Last Name*"
              value={computed(() => formData.lastName || '')}
              onInputChange={(value: string) => updateFormData({ lastName: value })}
              required
              aria-label="Last Name"
            />

            <NuInput
              id="phone"
              name="phone"
              type="tel"
              label="Phone Number"
              placeholder="Phone Number*"
              value={computed(() => formData.phone || '')}
              onInputChange={(value: string) => updateFormData({ phone: value })}
              required
              aria-label="Phone Number"
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
}

export default PickupForm;
