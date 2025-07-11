import { computed } from '@preact/signals';
import { useMemo } from 'preact/hooks';
import { HTML } from '../constants/cart-widget';
import { useCartWidgetContext } from '../contexts/CartWidgetContext';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';
import { useDeliveryLocations } from '../hooks/useDeliveryLocations';
import styles from '../styles/cart-widget.module.css';
import { generateTimeOptions } from '../utils/cart-widget-helpers';
import { FieldFeedback, NuButton, NuDatePicker, NuInput, NuSelect, NuTextarea, type SelectOption } from './ui';

function DeliveryForm() {
  const {
    currentTab,
    feedbackMessages,
    loading,
    selectedCountry,
    selectedProvince,
    formData,
    updateFormData,
    setSelectedCountry,
    setSelectedProvince,
    countries,
    availableProvinces,
    shouldHideCountryProvince,
    appSettings,
    blockSettings,
    locations,
  } = useCartWidgetContext();

  const countryOptions = computed<SelectOption[]>(() => countries.map(({ value, label }) => ({ value, label })));

  const provinceOptions = computed<SelectOption[]>(() =>
    availableProvinces.map(([val, lab]: [string, string]) => ({ value: val, label: lab }))
  );

  const timeOptions: SelectOption[] = useMemo(
    () => generateTimeOptions('delivery', appSettings, blockSettings),
    [appSettings, blockSettings]
  );

  const isDeliveryActive = computed(() => currentTab === 'delivery');

  const { locationOptions, renderLocationFields } = useDeliveryLocations({
    locations,
    formData,
    updateFormData,
  });

  // Determine if delivery verifier section should be displayed (defaults to true for backward-compatibility)
  const showDeliveryVerifier = !!blockSettings?.show_delivery_verifier;
  const showEstimatedCalculator = !!blockSettings?.show_estimated_delivery_calculator;
  const showTimezoneMessage = !!blockSettings?.show_timezone_message;
  const showDeliveryMessage = !!blockSettings?.show_delivery_message;
  const deliveryMessageHTML = blockSettings?.delivery_message;
  // Date & Time pickers configuration
  const dateTimePickerSetting = blockSettings?.date_time_pickers ?? 'both';
  const showDateTimeBlock = dateTimePickerSetting !== 'none';
  const showDatePicker = dateTimePickerSetting !== 'time' && dateTimePickerSetting !== 'none';
  const showTimePicker = dateTimePickerSetting !== 'date' && dateTimePickerSetting !== 'none';
  const showAvailabilitySection = showDeliveryVerifier || showEstimatedCalculator;

  const debouncedZipUpdate = useDebouncedCallback((value: string) => updateFormData({ zip: value }), 300);

  return (
    <fieldset
      className={`${styles['nu-form__fields']} ${isDeliveryActive.value ? '' : HTML.CLASS.hidden}`}
      data-content="delivery"
      disabled={!isDeliveryActive.value}
    >
      <div className={styles['nu-fields-container']}>
        {showAvailabilitySection && (
          <div className={styles['nu-fields']}>
            <p className="nu-line-height-1-1">Delivery Availability</p>

            <div className={`${styles['nu-country-province']} ${shouldHideCountryProvince ? HTML.CLASS.hidden : ''}`}>
              <NuSelect
                id="deliveryCountry"
                name="country"
                value={computed(() => selectedCountry || '')}
                onSelectChange={(value: string) => setSelectedCountry(value || null)}
                options={countryOptions.value}
                placeholderOption="Country"
                aria-label="Country"
                required
                disabled={!isDeliveryActive.value}
              />

              <NuSelect
                id="deliveryProvince"
                name="province"
                value={computed(() => selectedProvince || '')}
                onSelectChange={(value: string) => setSelectedProvince(value || null)}
                options={provinceOptions.value}
                placeholderOption="Province/State"
                aria-label="Province/State"
                required
                disabled={!isDeliveryActive.value || !selectedCountry || provinceOptions.value.length === 0}
              />
            </div>

            <div className={styles['nu-zipcode']}>
              <div className={styles['nu-zipcode__fields']}>
                <NuInput
                  id="deliveryZip"
                  name="zip"
                  type="text"
                  placeholder="Zip/Postal Code"
                  label="Zip Code"
                  value={computed(() => formData.zip || '')}
                  onInputChange={debouncedZipUpdate}
                  aria-label="Zip/Postal Code"
                  required
                />

                {showDeliveryVerifier && (
                  <NuButton
                    type="submit"
                    name="verifyDelivery"
                    isLoading={loading}
                    loadingText="Verifying..."
                    disabled={!isDeliveryActive.value || loading}
                  >
                    Check
                  </NuButton>
                )}
              </div>
              {showDeliveryVerifier && feedbackMessages.zipCode && (
                <FieldFeedback
                  message={feedbackMessages.zipCode}
                  type={feedbackMessages.zipCode.includes('available') ? 'success' : 'error'}
                />
              )}
            </div>
          </div>
        )}

        {showDateTimeBlock && (
          <div className={styles['nu-fields']}>
            <p className="nu-line-height-1-1">Date and Time</p>

            <div className={styles['nu-times']}>
              {showDatePicker && (
                <NuDatePicker
                  id="deliveryDate"
                  name="date"
                  placeholder="Delivery Date*"
                  label="Delivery Date"
                  aria-label="Delivery Date"
                  value={computed(() => formData.date || '')}
                  onDateChange={(value: string) => updateFormData({ date: value })}
                  required={showDatePicker}
                  disabled={!isDeliveryActive.value}
                />
              )}

              {showTimePicker && (
                <NuSelect
                  id="deliveryTime"
                  name="time"
                  aria-label="Delivery Time"
                  options={timeOptions}
                  placeholderOption="Delivery Time*"
                  value={computed(() => formData.time || '')}
                  onSelectChange={(value: string) => updateFormData({ time: value })}
                  required={showTimePicker}
                  disabled={!isDeliveryActive.value}
                />
              )}
            </div>

            {showTimezoneMessage && <p className="nu-font-13">All times are in your local timezone</p>}
          </div>
        )}
      </div>

      <div className={styles['nu-fields-container']}>
        <div className={styles['nu-fields']}>
          <p className="nu-line-height-1-1">Delivery Instructions</p>

          <div className={styles['nu-delivery-instructions']}>
            <NuSelect
              id="deliveryLocation"
              name="location"
              aria-label="Delivery Location"
              options={locationOptions}
              placeholderOption="Delivery Location*"
              value={computed(() => formData.location || '')}
              onSelectChange={(value: string) => updateFormData({ location: value })}
              required
              disabled={!isDeliveryActive.value}
            />

            {/* Render dynamic additional fields */}
            {renderLocationFields()}
          </div>
        </div>

        <NuTextarea
          id="deliveryInstructions"
          name="deliveryInstructions"
          label="Delivery Instructions"
          placeholder="Delivery Instructions"
          aria-label="Delivery Instructions"
          value={computed(() => formData.deliveryInstructions || '')}
          onTextareaChange={(value: string) => updateFormData({ deliveryInstructions: value })}
        />

        {showDeliveryMessage && (
          <div
            className="nu-font-14"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: deliveryMessageHTML || '',
            }}
          />
        )}
      </div>
    </fieldset>
  );
}

export default DeliveryForm;
