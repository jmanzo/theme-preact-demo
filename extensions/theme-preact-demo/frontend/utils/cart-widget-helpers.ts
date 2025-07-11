/**
 * Cart Widget Helper Functions
 * Utility functions used throughout the cart widget
 */

import type { SelectOption } from '../components/ui/NuSelect';
import { HTML } from '../constants/cart-widget';
import type {
  AppSettings,
  BlockSettings,
  CartWidgetFormData,
  WidgetTab,
} from '../types/cart-widget';

/**
 * Filter an object by its keys - Type-safe version
 *
 * @param obj - The object to filter
 * @param callback - The callback to decide which keys to keep
 * @param filterOutFalsyValues - Whether to filter out falsy values
 * @returns The filtered object with the same type as input
 */
export function filterObjectByKeys<T extends Record<string, unknown>>(
  obj: T,
  callback: (key: keyof T) => boolean,
  filterOutFalsyValues: boolean = false
): Partial<T> {
  return Object.keys(obj).reduce<Partial<T>>((acc, key) => {
    const typedKey = key as keyof T;

    if (callback(typedKey)) {
      if (filterOutFalsyValues && !obj[typedKey]) return acc;
      acc[typedKey] = obj[typedKey];
    }
    return acc;
  }, {});
}

/**
 * Filter and transform an object by its keys - Type-safe version with explicit transformation
 *
 * @param obj - The source object to filter
 * @param callback - The callback to decide which keys to keep
 * @param transformer - Function to transform each kept value
 * @param filterOutFalsyValues - Whether to filter out falsy values
 * @returns The filtered and transformed object
 */
export function filterAndTransformObject<T extends Record<string, unknown>, R>(
  obj: T,
  callback: (key: keyof T) => boolean,
  transformer: (value: T[keyof T], key: keyof T) => R,
  filterOutFalsyValues: boolean = false
): Record<string, R> {
  return Object.keys(obj).reduce<Record<string, R>>((acc, key) => {
    const typedKey = key as keyof T;

    if (callback(typedKey)) {
      if (filterOutFalsyValues && !obj[typedKey]) return acc;
      acc[key] = transformer(obj[typedKey], typedKey);
    }
    return acc;
  }, {});
}

/**
 * Format time value to human readable format
 * @param timeValue - Time value as string (hour in 24h format)
 * @returns Formatted time string (e.g., "8 AM", "2 PM")
 */
export function formatTime(timeValue?: string): string {
  if (!timeValue) return '';

  const hour = Number(timeValue);
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour <= 12 ? hour : hour - 12;
  return `${displayHour} ${period}`;
}

/**
 * Generate selectable time options for delivery or pickup based on app & block settings.
 * @param mode - "delivery" | "pickup"
 * @param appSettings - Parsed app settings
 * @param blockSettings - Parsed block settings
 * @returns Array of { value, label } objects suitable for Select options
 */
export function generateTimeOptions(
  mode: WidgetTab,
  appSettings: AppSettings = {},
  blockSettings: BlockSettings = {}
): SelectOption[] {
  // Custom hours defined from the app settings have priority
  const customHours = mode === 'delivery' ? appSettings.demoDeliveryHours : appSettings.demoPickupHours;
  // Helper to transform hour to human-readable label (e.g., "8 AM", "2 PM", "12 AM")
  const getReadableHour = (hour: number): string => {
    if (hour === 0 || hour === 24) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  const buildOption = (hour: number, prefix: string): SelectOption => ({
    value: String(hour),
    label: `${prefix} ${getReadableHour(hour)}`.trim(),
  });
  // Determine fallback prefix if none provided
  const defaultPrefix = blockSettings.delivery_location_prefix || '';
  // 1. If the merchant configured explicit hours in the app settings, use them
  if (Array.isArray(customHours) && customHours.length > 0) {
    return customHours.map(({ hour, prefix }) => {
      const hourNumber = parseInt(String(hour).replace('hour_', ''), 10);
      const optionPrefix = prefix || defaultPrefix;
      return buildOption(hourNumber, optionPrefix);
    });
  }
  // 2. Fallback to block settings: iterate from start_time to cutoff_time (inclusive)
  const start = Number(blockSettings.delivery_start_time ?? 0);
  const cutoff = Number(blockSettings.delivery_cutoff_time ?? 23);
  const prefix = defaultPrefix;
  const options: SelectOption[] = [];

  for (let hour = start; hour <= cutoff; hour += 1) {
    options.push(buildOption(hour, prefix));
  }

  return options;
}

/**
 * Add Demo prefix to a string for consistent attribute naming
 * @param str - String to prefix
 * @returns Prefixed string
 */
export function withDemoPrefix<T extends string>(str: T): `Demo | ${T}` {
  return `Demo | ${str}`;
}

/**
 * Parse app settings from data attribute
 * @param element - HTML element containing app settings
 * @returns Parsed app settings object
 */
export function parseAppSettings(settings: string): AppSettings {
  return settings ? JSON.parse(settings) : {};
}

/**
 * Parse block settings from data attribute
 * @param element - HTML element containing block settings
 * @returns Parsed block settings object
 */
export function parseBlockSettings(settings: string): BlockSettings {
  return settings ? JSON.parse(settings) : {};
}

/**
 * Debounce function execution
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Toggle element loading state
 * @param element - Element to toggle
 * @param loading - Loading state
 */
export function toggleElementLoading(element: HTMLElement | null, loading: boolean): void {
  if (!element) return;

  element.classList.toggle(HTML.CLASS.loading, loading);

  if (element instanceof HTMLButtonElement) {
    element.classList.toggle(HTML.CLASS.disabled, loading);
  }
}

/**
 * Get today's date with time reset to start of day
 * @returns Date object for today
 */
export function getTodayDate(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Check if a date should be disabled
 * @param date - Date to check
 * @param disabledDates - Array of disabled dates
 * @returns Whether the date should be disabled
 */
export function isDateDisabled(date: Date, disabledDates: Date[] = []): boolean {
  const today = getTodayDate();
  const cellDate = new Date(date);
  cellDate.setHours(0, 0, 0, 0);

  const isBeforeToday = cellDate.getTime() < today.getTime();

  const isInDisabledList = disabledDates.some((disabledDate) => {
    const disabledDateTime = new Date(disabledDate);
    disabledDateTime.setHours(0, 0, 0, 0);
    return disabledDateTime.getTime() === cellDate.getTime();
  });

  return isBeforeToday || isInDisabledList;
}

/**
 * Type guard to check if event is a SubmitEvent
 * @param event - Event to check
 * @returns Whether the event is a SubmitEvent
 */
export function isSubmitEvent(event: Event): event is SubmitEvent {
  return 'submitter' in event && event.type === 'submit';
}

/**
 * Type-safe helper to access dynamic delivery fields
 * @param formData - CartWidgetFormData object
 * @param fieldName - Dynamic field name
 * @returns Field value or empty string
 */
function getDynamicDeliveryField(formData: CartWidgetFormData, fieldName: string): string {
  // Use index signature access for dynamic fields
  const dynamicFormData = formData as Record<string, string | undefined>;
  return dynamicFormData[fieldName] || '';
}

/**
 * Helper to safely get a single form field value from CartWidgetFormData
 * @param formData - CartWidgetFormData object
 * @param fieldName - Field name to retrieve
 * @returns Field value as string or empty string if not found
 */
export function getFormFieldValue(formData: CartWidgetFormData, fieldName: string): string {
  if (!isValidCartWidgetField(fieldName)) {
    return '';
  }

  // Handle dynamic delivery fields
  if (fieldName.startsWith('delivery[') && fieldName.endsWith(']')) {
    return getDynamicDeliveryField(formData, fieldName);
  }

  // Handle known fields with proper type checking
  return formData[fieldName as keyof CartWidgetFormData] || '';
}

/**
 * Helper to check if a field name is valid for CartWidgetFormData
 * @param fieldName - Field name to check
 * @returns Whether the field is valid
 */
function isValidCartWidgetField(fieldName: string): boolean {
  // Handle dynamic delivery fields
  if (fieldName.startsWith('delivery[') && fieldName.endsWith(']')) {
    return true;
  }

  // Handle known fields
  const validFields = [
    'zip',
    'country',
    'province',
    'date',
    'time',
    'location',
    'pickupTime',
    'pickupDate',
    'firstName',
    'lastName',
    'phone',
    'deliveryInstructions',
  ];

  return validFields.includes(fieldName);
}

/**
 * Type-safe helper to set dynamic fields in CartWidgetFormData
 * @param result - Result object to modify
 * @param key - Field key
 * @param value - Field value
 */
function setDynamicField(result: CartWidgetFormData, key: string, value: string): void {
  // Use index signature to safely set dynamic fields
  const dynamicResult = result as Record<string, string>;
  dynamicResult[key] = value;
}

/**
 * Helper to safely convert FormData to CartWidgetFormData
 * @param formData - FormData from form submission
 * @returns Typed CartWidgetFormData object
 */
export function formDataToCartWidgetFormData(formData: FormData): CartWidgetFormData {
  const entries = Object.fromEntries(formData.entries());
  const result: CartWidgetFormData = {};

  // Type-safe assignment of known fields
  Object.entries(entries).forEach(([key, value]) => {
    if (typeof value === 'string') {
      if (isValidCartWidgetField(key)) {
        setDynamicField(result, key, value);
      } else {
        // Log unknown fields for debugging (demo mode)
        // eslint-disable-next-line no-console
        console.warn(`Unknown form field: ${key}`);
      }
    }
  });

  return result;
}
