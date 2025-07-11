/**
 * Cart Widget Context
 * Provides centralized state management for the cart widget
 */
import { computed, useSignal } from '@preact/signals';
import { createContext } from 'preact';
import { useCallback, useContext, useEffect, useMemo } from 'preact/hooks';
import { EXTENSIONS } from '../constants/cart-widget';
import { changeCart, generateShippingRates, getCart, submitCheckout, updateCart } from '../services/cart-api';
import type {
  AppSettings,
  BlockSettings,
  Cart,
  CartChangeBody,
  CartWidgetFormData,
  CountriesData,
  DeliveryLocations,
  FeedbackMessages,
  Provinces,
  ShippingAddress,
  ShippingRatesData,
  WidgetTab,
} from '../types/cart-widget';
import {
  filterAndTransformObject,
  formatTime,
  parseAppSettings,
  parseBlockSettings,
  withDemoPrefix,
} from '../utils/cart-widget-helpers';

// ---------------------------------------
// Context Types
// ---------------------------------------
type CartWidgetSettings = {
  appSettings: string;
  blockSettings: string;
  countries: string;
  locations: string;
};

type CartWidgetContextValue = {
  // State
  loading: boolean;
  selectedCountry: string | null;
  selectedProvince: string | null;
  currentTab: WidgetTab;
  formData: CartWidgetFormData;
  feedbackMessages: FeedbackMessages;
  cart: Cart | null;
  disabledDates: Date[];
  appSettings: AppSettings;
  isPickupEnabled: boolean;
  countries: CountriesData;
  availableProvinces: Provinces;
  shouldHideCountryProvince: boolean;
  blockSettings: BlockSettings;
  locations: DeliveryLocations;
  // Actions
  loadCart: () => Promise<Cart | null>;
  updateFormData: (updates: CartWidgetFormData) => void;
  handleTabChange: (tab: WidgetTab) => void;
  setLoading: (isLoading: boolean) => void;
  updateFeedback: (type: 'zipCode' | 'estimated', message: string) => void;
  clearFeedback: (type?: 'zipCode' | 'estimated') => void;
  verifyDelivery: (shippingAddress: ShippingAddress) => Promise<boolean>;
  calculateShipping: (shippingAddress: ShippingAddress) => Promise<ShippingRatesData | null>;
  handleSubmit: (submitterName: string, formDataObject: CartWidgetFormData) => Promise<void>;
  changeCartItemsProperties: (
    formDataObject: CartWidgetFormData
  ) => Promise<{ changes: CartChangeBody[]; originalCart: Cart } | null>;
  updateCartAttributes: (formDataObject: CartWidgetFormData, currentCart?: Cart) => Promise<void>;
  // Setters for direct state manipulation when needed
  setSelectedCountry: (country: string | null) => void;
  setSelectedProvince: (province: string | null) => void;
  setCurrentTab: (tab: WidgetTab) => void;
  setFormData: (data: CartWidgetFormData) => void;
};

type CartWidgetProviderProps = {
  settings: CartWidgetSettings;
  children: JSX.Element;
};

// ---------------------------------------
// Context Creation
// ---------------------------------------
const CartWidgetContext = createContext<CartWidgetContextValue | null>(null);

// ---------------------------------------
// Provider Component
// ---------------------------------------
export function CartWidgetProvider({ settings, children }: CartWidgetProviderProps) {
  // Core state signals
  const loading = useSignal(false);
  const selectedCountry = useSignal<string | null>(null);
  const selectedProvince = useSignal<string | null>(null);
  const currentTab = useSignal<WidgetTab>('delivery');
  const formData = useSignal<CartWidgetFormData>({});
  const feedbackMessages = useSignal<FeedbackMessages>({});
  const cart = useSignal<Cart | null>(null);
  const disabledDates = useSignal<Date[]>([]);
  // Locations metaobjects
  const locations = useMemo<DeliveryLocations>(() => JSON.parse(settings.locations || '[]'), [settings]);
  // App settings
  const appSettings = useMemo<AppSettings>(() => {
    if (!settings) return {};
    return parseAppSettings(settings.appSettings);
  }, [settings]);
  // Block settings
  const blockSettings = useMemo<BlockSettings>(() => {
    if (!settings) return {};
    return parseBlockSettings(settings.blockSettings);
  }, [settings]);

  // Pickup enabled check
  const isPickupEnabled = computed(() => blockSettings?.show_pickup_options);

  // Helper function to safely convert date values
  const convertToDate = (dateValue: unknown): Date | null => {
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === 'string' || typeof dateValue === 'number') {
      const date = new Date(dateValue);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    return null;
  };

  // Get global disabled dates from window (demo mode)
  useEffect(() => {
    const globalDisabledDates = (window.ThemePreactDemo?.cartWidget?.disabledDates || [])
      .map(convertToDate)
      .filter((date): date is Date => date !== null);

    disabledDates.value = globalDisabledDates;
  }, [disabledDates]);

  // Update form data
  const updateFormData = useCallback(
    (updates: CartWidgetFormData) => {
      formData.value = { ...formData.value, ...updates };
    },
    [formData]
  );

  // Countries data - parse from settings prop (generated server-side)
  const countries = useMemo<CountriesData>(() => JSON.parse(settings.countries || '[]'), [settings.countries]);

  // Available provinces based on selected country
  const availableProvinces = computed(() => {
    if (!selectedCountry.value) return [];
    const country = countries.find((c) => c.value === selectedCountry.value);
    return country?.provinces || [];
  });

  // Should hide country/province section based on app settings
  const shouldHideCountryProvince = computed(() => {
    const { hideCountryProvinceCartWidget, fixedCartWidgetCountry, fixedCartWidgetProvince } = appSettings;
    return !hideCountryProvinceCartWidget || !fixedCartWidgetCountry
      ? false
      : !(availableProvinces.value.length > 0) || !!fixedCartWidgetProvince;
  });

  // Unified country/province initialization and auto-selection
  useEffect(() => {
    const { fixedCartWidgetCountry, fixedCartWidgetProvince } = appSettings;
    let countryToSet: string | null = null;
    let provinceToSet: string | null = null;

    // Priority 1: Fixed values from app settings
    if (fixedCartWidgetCountry && !selectedCountry.value) {
      countryToSet = fixedCartWidgetCountry;
    }
    // Priority 2: Auto-select if only one country option and none selected
    else if (!selectedCountry.value && countries.length === 1) {
      countryToSet = countries[0].value;
    }

    // Set country if determined
    if (countryToSet) {
      selectedCountry.value = countryToSet;
      updateFormData({ country: countryToSet });
    }

    // Handle province selection after country is determined
    if (selectedCountry.value) {
      const currentAvailableProvinces = countries.find((c) => c.value === selectedCountry.value)?.provinces || [];

      // Priority 1: Fixed province from app settings
      if (fixedCartWidgetProvince && !selectedProvince.value) {
        provinceToSet = fixedCartWidgetProvince;
      }
      // Priority 2: Auto-select if only one province option and none selected
      else if (!selectedProvince.value && currentAvailableProvinces.length === 1) {
        const [provinceValue] = currentAvailableProvinces[0];
        provinceToSet = provinceValue;
      }
      // Priority 3: Validate current province is still valid for selected country
      else if (selectedProvince.value) {
        const isValidProvince = currentAvailableProvinces.some(([value]) => value === selectedProvince.value);
        if (!isValidProvince) {
          selectedProvince.value = null;
          updateFormData({ province: '' });
          return; // Early return to avoid setting province below
        }
      }

      // Set province if determined
      if (provinceToSet) {
        selectedProvince.value = provinceToSet;
        updateFormData({ province: provinceToSet });
      }
    }
  }, [appSettings, countries, selectedCountry, selectedProvince, updateFormData, formData, disabledDates]);

  // Load initial cart data (only on mount)
  useEffect(() => {
    const initializeCart = async (): Promise<void> => {
      try {
        const cartData = await getCart();
        cart.value = cartData;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize cart:', error);
      }
    };

    initializeCart().catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to initialize cart:', error);
    });
  }, [cart]);

  // Load cart function for external use
  const loadCart = useCallback(async () => {
    try {
      const cartData = await getCart();
      cart.value = cartData;
      return cartData;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load cart:', error);
      return null;
    }
  }, [cart]);

  // Handle tab change
  const handleTabChange = useCallback(
    (tab: WidgetTab) => {
      if (!isPickupEnabled.value && tab === 'pickup') return;
      currentTab.value = tab;
    },
    [isPickupEnabled, currentTab]
  );

  // Toggle loading state
  const setLoading = useCallback(
    (isLoading: boolean) => {
      loading.value = isLoading;
    },
    [loading]
  );

  // Update feedback messages
  const updateFeedback = useCallback(
    (type: 'zipCode' | 'estimated', message: string) => {
      feedbackMessages.value = { ...feedbackMessages.value, [type]: message };
    },
    [feedbackMessages]
  );

  // Clear feedback messages
  const clearFeedback = useCallback(
    (type?: 'zipCode' | 'estimated') => {
      if (type) {
        const { [type]: removed, ...rest } = feedbackMessages.value;
        feedbackMessages.value = rest;
      } else {
        feedbackMessages.value = {};
      }
    },
    [feedbackMessages]
  );

  // Change cart items properties
  const changeCartItemsProperties = useCallback(
    async (formDataObject: CartWidgetFormData) => {
      const currentCart = cart.value || (await loadCart());
      if (!currentCart || !currentCart.items.length) return null;

      // Only update the first 3 items for performance (Shopify limitation)
      const itemsToUpdate = currentCart.items.slice(0, 3);
      const changes = await Promise.all(
        itemsToUpdate.map(async (item) => {
          const { properties, key } = item;
          return changeCart({
            id: key,
            properties: {
              ...properties,
            },
          });
        })
      );

      return { changes, originalCart: currentCart };
    },
    [cart, loadCart]
  );

  // Update cart attributes
  const updateCartAttributes = useCallback(
    async (formDataObject: CartWidgetFormData, currentCart?: Cart) => {
      const { location, deliveryInstructions, time, date, pickupTime, pickupDate, firstName, lastName, phone } =
        formDataObject;

      const DELIVERY_NAME_REGEX = /^delivery\[(.+)\]$/;
      const extraDeliveryFields = filterAndTransformObject(
        formDataObject,
        (key) => DELIVERY_NAME_REGEX.test(String(key)),
        (value, key) => value,
        false
      );

      // Transform the keys to add Demo prefix
      const transformedExtraFields = Object.keys(extraDeliveryFields).reduce<Record<string, string>>((acc, key) => {
        const transformedKey = key.replace(DELIVERY_NAME_REGEX, (_, group) => withDemoPrefix(group));
        acc[transformedKey] = String(extraDeliveryFields[key]);
        return acc;
      }, {});

      // Remove old extra fields that are no longer present
      const cartAttributes = currentCart?.attributes || {};
      const extraFieldsToRemove = Object.keys(cartAttributes)
        .filter((key) => key.startsWith(withDemoPrefix('')) && !Object.keys(transformedExtraFields).includes(key))
        .reduce<Record<string, string>>((acc, key) => {
          acc[key] = '';
          return acc;
        }, {});

      // Create updates object to preserve existing quantities
      const updates =
        currentCart?.items.reduce<Record<string, number>>((acc, item) => {
          acc[item.key] = item.quantity;
          return acc;
        }, {}) || {};

      const isPickup = isPickupEnabled.value && currentTab.value === 'pickup';

      const attributes = {
        ...extraFieldsToRemove,
        ...transformedExtraFields,

        // Delivery attributes
        [withDemoPrefix(EXTENSIONS.TABS.DELIVERY.date.label)]: (!isPickup && date) || '',
        [withDemoPrefix(EXTENSIONS.TABS.DELIVERY.deliveryLocation.label)]: (!isPickup && location) || '',
        [withDemoPrefix(EXTENSIONS.TABS.DELIVERY.time.label)]: (time && formatTime(time)) || '',
        [withDemoPrefix(EXTENSIONS.TABS.DELIVERY.deliveryInstructions.label)]:
          (!isPickup && deliveryInstructions) || '',

        // Pickup attributes (only include if pickup is enabled and active)
        ...(isPickupEnabled.value &&
          isPickup && {
            [withDemoPrefix(EXTENSIONS.TABS.PICKUP.date.label)]: pickupDate || '',
            [withDemoPrefix(EXTENSIONS.TABS.PICKUP.phone.label)]: phone || '',
            [withDemoPrefix(EXTENSIONS.TABS.PICKUP.lastName.label)]: lastName || '',
            [withDemoPrefix(EXTENSIONS.TABS.PICKUP.firstName.label)]: firstName || '',
            [withDemoPrefix(EXTENSIONS.TABS.PICKUP.time.label)]: pickupTime || '',
          }),

        // Custom disabled dates implementation
        _disabledDates: JSON.stringify(disabledDates.value),
      };

      await updateCart({ attributes, updates });
    },
    [isPickupEnabled, currentTab, disabledDates]
  );

  // Verify delivery availability
  const verifyDelivery = useCallback(
    async (shippingAddress: ShippingAddress) => {
      try {
        clearFeedback('zipCode');
        setLoading(true);

        const rates = await generateShippingRates(shippingAddress);
        const errorMessage = 'Products not available for delivery';

        if (!rates) {
          updateFeedback('zipCode', errorMessage);
          return false;
        }

        if (rates.error) {
          updateFeedback('zipCode', rates.message || errorMessage);
          return false;
        }

        const hasShippingRates = !!rates.shipping_rates?.length;
        updateFeedback('zipCode', hasShippingRates ? 'Products available for delivery' : errorMessage);

        return hasShippingRates;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to verify delivery:', error);
        updateFeedback('zipCode', 'Error verifying delivery');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [clearFeedback, setLoading, updateFeedback]
  );

  // Calculate shipping rates
  const calculateShipping = useCallback(
    async (shippingAddress: ShippingAddress) => {
      try {
        clearFeedback('estimated');
        setLoading(true);

        const rates = await generateShippingRates(shippingAddress);

        if (!rates) {
          updateFeedback('estimated', "We're having trouble getting rates, please try again.");
          return null;
        }

        if (!rates.shipping_rates?.length) {
          updateFeedback('estimated', 'No shipping rates found, verify in checkout.');
          return null;
        }

        const lowestRate = rates.shipping_rates.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))[0];
        const isFree = parseFloat(lowestRate.price) <= 0;
        const estimatedFeeText = `Estimated delivery fee: ${lowestRate.price} ${lowestRate.currency}`;

        updateFeedback('estimated', isFree ? 'You apply for free shipping' : estimatedFeeText);

        return rates;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to calculate shipping:', error);
        updateFeedback('estimated', 'Error calculating shipping rates');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [clearFeedback, setLoading, updateFeedback]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (submitterName: string, formDataObject: CartWidgetFormData) => {
      try {
        setLoading(true);

        switch (submitterName) {
          case 'checkout': {
            const { originalCart } = (await changeCartItemsProperties(formDataObject)) || {};
            await updateCartAttributes(formDataObject, originalCart);
            await submitCheckout();
            break;
          }

          case 'calculate': {
            const { zip, country, province } = formDataObject;
            await calculateShipping({ zip, country, province });
            break;
          }

          case 'verifyDelivery': {
            const { zip, country, province } = formDataObject;
            await verifyDelivery({ zip, country, province });
            break;
          }

          default:
            throw new Error('Unknown submitter');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error submitting form:', error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, changeCartItemsProperties, updateCartAttributes, calculateShipping, verifyDelivery]
  );

  // Context value
  const contextValue: CartWidgetContextValue = useMemo(
    () => ({
      // State
      loading: loading.value,
      selectedCountry: selectedCountry.value,
      selectedProvince: selectedProvince.value,
      currentTab: currentTab.value,
      formData: formData.value,
      feedbackMessages: feedbackMessages.value,
      cart: cart.value,
      disabledDates: disabledDates.value,
      appSettings,
      isPickupEnabled: isPickupEnabled.value || false,
      countries,
      availableProvinces: availableProvinces.value,
      shouldHideCountryProvince: shouldHideCountryProvince.value,
      blockSettings,
      locations,
      // Actions
      loadCart,
      updateFormData,
      handleTabChange,
      setLoading,
      updateFeedback,
      clearFeedback,
      verifyDelivery,
      calculateShipping,
      handleSubmit,
      changeCartItemsProperties,
      updateCartAttributes,
      // Setters for direct state manipulation when needed
      setSelectedCountry: (country: string | null) => {
        selectedCountry.value = country;
        updateFormData({ country: country || '' });
      },
      setSelectedProvince: (province: string | null) => {
        selectedProvince.value = province;
        updateFormData({ province: province || '' });
      },
      setCurrentTab: (tab: WidgetTab) => {
        currentTab.value = tab;
      },
      setFormData: (data: CartWidgetFormData) => {
        formData.value = data;
      },
    }),
    [
      loadCart,
      updateFormData,
      handleTabChange,
      setLoading,
      updateFeedback,
      clearFeedback,
      verifyDelivery,
      calculateShipping,
      handleSubmit,
      changeCartItemsProperties,
      updateCartAttributes,
      appSettings,
      countries,
      currentTab,
      formData,
      selectedCountry,
      selectedProvince,
      cart.value,
      disabledDates.value,
      isPickupEnabled.value,
      feedbackMessages.value,
      loading.value,
      availableProvinces.value,
      shouldHideCountryProvince.value,
      blockSettings,
      locations,
    ]
  );

  return <CartWidgetContext.Provider value={contextValue}>{children}</CartWidgetContext.Provider>;
}

// ---------------------------------------
// Context Hook
// ---------------------------------------
export function useCartWidgetContext(): CartWidgetContextValue {
  const context = useContext(CartWidgetContext);
  if (!context) {
    throw new Error('useCartWidgetContext must be used within a CartWidgetProvider');
  }
  return context;
}
