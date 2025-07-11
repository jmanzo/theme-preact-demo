/**
 * Cart Widget Type Definitions
 * All TypeScript types used throughout the cart widget
 */

// ---------------------------------------
// Base Component Props
// ---------------------------------------

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type FormProps = {
  activeTab: WidgetTab;
};

export type CartWidgetProps = {
  appSettings: string;
  blockSettings: string;
  countries: string;
  locations: string;
};

export type WidgetTab = 'delivery' | 'pickup';

export type CheckoutFormProps = FormProps;
export type DeliveryFormProps = FormProps;
export type PickupFormProps = FormProps;

// ---------------------------------------
// Cart Response Types (from /cart.js)
// ---------------------------------------
export type Cart = {
  token: string;
  note: string;
  attributes: CartAttributes;
  original_total_price: number;
  total_price: number;
  total_discount: number;
  total_weight: number;
  item_count: number;
  items: CartItem[];
  requires_shipping: boolean;
  currency: string;
  items_subtotal_price: number;
  cart_level_discount_applications: DiscountApplication[];
};

export type CartItem = {
  id: number;
  properties: CartItemProperties;
  quantity: number;
  variant_id: number;
  key: string;
  title: string;
  price: number;
  original_price: number;
  presentment_price: number;
  discounted_price: number;
  line_price: number;
  original_line_price: number;
  total_discount: number;
  discounts: DiscountApplication[];
  sku: string;
  grams: number;
  vendor: string;
  taxable: boolean;
  product_id: number;
  product_has_only_default_variant: boolean;
  gift_card: boolean;
  final_price: number;
  final_line_price: number;
  url: string;
  featured_image: FeaturedImage;
  image: string;
  handle: string;
  requires_shipping: boolean;
  product_type: string;
  product_title: string;
  product_description: null | string;
  variant_title: null | string;
  variant_options: string[];
  options_with_values: OptionsWithValue[];
  line_level_discount_allocations: LineDiscountAllocation[];
  line_level_total_discount: number;
  quantity_rule: QuantityRule;
  has_components: boolean;
};

export type FeaturedImage = {
  aspect_ratio: number;
  alt: string;
  height: number;
  url: string;
  width: number;
};

export type OptionsWithValue = {
  name: string;
  value: string;
};

export type CartItemProperties = {
  _BundleID?: string;
};

export type QuantityRule = {
  min: number;
  max: null;
  increment: number;
};

// ---------------------------------------
// Cart Attributes Types
// ---------------------------------------
type KnownCartAttributes = 'Delivery Date' | 'Delivery Time' | 'Delivery Location' | 'Delivery Instructions';
type KnownCartAttributesPrefixed = `Demo | ${KnownCartAttributes}`;
type AnyCartAttributeWithAutocompletePrefixed = KnownCartAttributesPrefixed | (string & {});

export type CartAttributes = {
  [key in AnyCartAttributeWithAutocompletePrefixed]?: string;
};

// ---------------------------------------
// Cart API Request Bodies
// ---------------------------------------
export type CartChangeBody = {
  /**
   * If you use the variant ID, then the id value can be either an integer or a string.
   * However, if you use the line item key, then the id value needs to be a string.
   */
  id: number | string;
  quantity?: number;
  properties?: CartItemProperties;
  selling_plan?: number | null;
};

export type CartUpdateBody = {
  updates?: {
    [key: string]: number;
  };
  note?: string;
  attributes?: CartAttributes;
};

// ---------------------------------------
// Shipping Rates Types
// ---------------------------------------
export type ShippingAddress = {
  zip?: string;
  country?: string;
  province?: string;
};

export type ShippingRatesData =
  | {
      shipping_rates?: ShippingRate[];
      error?: boolean;
      message?: string;
    }
  | null
  | undefined;

export type ShippingRate = {
  name: string;
  presentment_name: string;
  code: string;
  price: string;
  markup: string;
  source: string;
  delivery_date: null;
  delivery_range: string[];
  delivery_days: string[];
  compare_price: null;
  phone_required: boolean;
  currency: string;
  carrier_identifier: null;
  delivery_category: null;
  using_merchant_account: boolean;
  carrier_service_id: null;
  description: null;
  additional_data: null;
  incoterm: null;
  api_client_id: null;
  requested_fulfillment_service_id: null;
  shipment_options: null;
  charge_items: null;
  has_restrictions: boolean;
  rating_classification: null;
  accepts_instructions: boolean;
  metafields: null;
};

// ---------------------------------------
// Form Data Types
// ---------------------------------------
export type CartWidgetFormData = {
  // For calculating shipping rates and checking availability
  zip?: string;
  country?: string;
  province?: string;

  // Required for calculating rates in the checkout
  date?: string;
  time?: string;
  location?: string;

  // For cart note
  pickupTime?: string;
  pickupDate?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  deliveryInstructions?: string;

  // Dynamic delivery fields
  [key: `delivery[${string}]`]: string;
};

// ---------------------------------------
// Provinces Data Types
// ---------------------------------------
export type Provinces = [value: string, label: string][];

// ---------------------------------------
// Countries Data Types
// ---------------------------------------
export type CountryOption = {
  value: string;
  label: string;
  provinces: Provinces;
};

export type CountriesData = CountryOption[];

// ---------------------------------------
// App Settings Types
// ---------------------------------------
export type AppSettings = {
  demoMode?: boolean;
  fixedCartWidgetCountry?: string;
  fixedCartWidgetProvince?: string;
  hideCountryProvinceCartWidget?: boolean;
  demoDeliveryHours?: Array<{
    hour: string;
    prefix?: string;
  }>;
  demoPickupHours?: Array<{
    hour: string;
    prefix?: string;
  }>;
  countries?: CountriesData;
};

// ---------------------------------------
// Block Settings Types
// ---------------------------------------
export type BlockSettings = {
  show_pickup_options?: boolean;
  delivery_start_time?: string | number;
  delivery_cutoff_time?: string | number;
  delivery_location_prefix?: string;
  show_delivery_verifier?: boolean;
  show_estimated_delivery_calculator?: boolean;
  show_timezone_message?: boolean;
  date_time_pickers?: 'both' | 'date' | 'time' | 'none';
  delivery_message?: string;
  show_delivery_message?: boolean;
};

// ---------------------------------------
// Global Window Enhancement
// ---------------------------------------
export type ThemePreactDemo = {
  cartWidget: {
    texts: {
      form: {
        delivery_available: string;
        delivery_unavailable: string;
      };
      recap: {
        free_shipping: string;
        error_fetching: string;
        estimated_fee: string;
        no_rates_found: string;
        click_to_estimate: string;
      };
    };
    disabledDates?: Array<Date>;
    countries?: CountriesData;
  };
};

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// ---------------------------------------
// Hook State Types
// ---------------------------------------
export type FeedbackMessages = {
  zipCode?: string;
  estimated?: string;
};

export type CartWidgetState = {
  loading: boolean;
  selectedCountry: string | null;
  selectedProvince: string | null;
  currentTab: WidgetTab;
  formData: CartWidgetFormData;
  feedbackMessages: FeedbackMessages;
  appSettings: AppSettings;
};

// ---------------------------------------
// HTML Constants Types
// ---------------------------------------
export type HTMLConstants = {
  WEB_COMPONENTS: {
    cartWidget: string;
  };
  CLASS: Record<string, string>;
  TEXT: {
    form: {
      delivery_available: string;
      delivery_unavailable: string;
    };
    recap: {
      free_shipping: string;
      error_fetching: string;
      estimated_fee: string;
      no_rates_found: string;
      click_to_estimate: string;
    };
  };
};

// ---------------------------------------
// Delivery Location Types (Metaobject-driven)
// ---------------------------------------
export type DeliveryLocationField = {
  InputFieldSettings?: {
    type?: string;
  };
  helpText?: string;
  label: string;
  required?: boolean;
  type: 'input' | 'textarea' | 'select';
  options?: SelectOption[];
};

export type DeliveryLocation = {
  name: string;
  /** Nested fields to request extra info */
  formFields: DeliveryLocationField[];
};

export type DeliveryLocations = DeliveryLocation[];

// ---------------------------------------
// Discount Application Types
// ---------------------------------------
export type DiscountApplication = {
  type: string;
  title: string;
  description?: string;
  value: string;
  value_type: string;
  allocation_method: string;
  target_selection: string;
  target_type: string;
};

export type LineDiscountAllocation = {
  amount: string;
  discount_application_index: number;
};
