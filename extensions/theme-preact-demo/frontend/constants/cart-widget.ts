/**
 * HTML constants for cart widget
 */
export const HTML = {
  CLASS: {
    hidden: 'nu-hidden',
    active: 'nu-active',
    loading: 'nu-loading',
    error: 'nu-error',
    success: 'nu-success',
  },
  ATTRIBUTE: {
    dataContent: 'data-content',
    dataTab: 'data-tab',
    dataLoading: 'data-loading',
  },
} as const;

/**
 * Demo form field names for cart widget
 */
export const FORM_FIELDS = {
  // Delivery fields
  DELIVERY_DATE: 'deliveryDate',
  DELIVERY_TIME: 'deliveryTime',
  DELIVERY_LOCATION: 'deliveryLocation',
  DELIVERY_INSTRUCTIONS: 'deliveryInstructions',
  ZIP_CODE: 'zip',
  COUNTRY: 'country',
  PROVINCE: 'province',
  
  // Pickup fields
  PICKUP_DATE: 'pickupDate',
  PICKUP_TIME: 'pickupTime',
  PICKUP_PHONE: 'phone',
  PICKUP_FIRST_NAME: 'firstName',
  PICKUP_LAST_NAME: 'lastName',
  
  // Demo custom fields
  CUSTOM_FIELD_1: 'customField1',
  CUSTOM_FIELD_2: 'customField2',
  CUSTOM_FIELD_3: 'customField3',
} as const;

/**
 * Extensions constants for cart widget tabs and fields
 */
export const EXTENSIONS = {
  TABS: {
    // Delivery tab
    DELIVERY: {
      date: {
        key: 'deliveryDate',
        label: 'Delivery Date',
      },
      time: {
        key: 'deliveryTime',
        label: 'Delivery Time',
      },
      deliveryLocation: {
        key: 'deliveryLocation',
        label: 'Delivery Location',
      },
      deliveryInstructions: {
        key: 'deliveryInstructions',
        label: 'Delivery Instructions',
      },
      formFields: [
        'Custom Field 1',
        'Custom Field 2',
        'Custom Field 3',
        'Additional Notes',
        'Special Instructions',
      ],
    },
    // Pickup tab
    PICKUP: {
      date: {
        key: 'pickupDate',
        label: 'Pickup Date',
      },
      time: {
        key: 'pickupTime',
        label: 'Pickup Time',
      },
      phone: {
        key: 'phone',
        label: 'Contact Phone',
      },
      firstName: {
        key: 'firstName',
        label: 'First Name',
      },
      lastName: {
        key: 'lastName',
        label: 'Last Name',
      },
    },
  },
} as const satisfies ExtensionConstants;

/**
 * Type definitions for extension constants
 */
type ExtensionConstants = {
  TABS: {
    DELIVERY: {
      date: { key: string; label: string };
      time: { key: string; label: string };
      deliveryLocation: { key: string; label: string };
      deliveryInstructions: { key: string; label: string };
      formFields: string[];
    };
    PICKUP: {
      date: { key: string; label: string };
      time: { key: string; label: string };
      phone: { key: string; label: string };
      firstName: { key: string; label: string };
      lastName: { key: string; label: string };
    };
  };
};
