/**
 * Shopify Cart API service
 * Handles all interactions with Shopify's Cart AJAX API
 */

import type { Cart, CartChangeBody, CartUpdateBody, ShippingAddress, ShippingRatesData } from '../types/cart-widget';

/**
 * Fetch the cart data from the Cart AJAX API
 */
export const getCart = async (): Promise<Cart> => {
  const response = await fetch('/cart.js');

  if (!response.ok) {
    throw new Error(`Failed to get cart: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Change cart items using the Cart AJAX API
 */
export const changeCart = async (body: CartChangeBody): Promise<any> => {
  const response = await fetch('/cart/change.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to change cart: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Update the cart using the Cart AJAX API
 */
export const updateCart = async (body: CartUpdateBody): Promise<any> => {
  const response = await fetch('/cart/update.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to update cart: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Poll for shipping rates with retry mechanism
 */
const pollShippingRates = async (params: string, tries: number = 0): Promise<ShippingRatesData> => {
  const ASYNC_SHIPPING_RATES_ENDPOINT = '/cart/async_shipping_rates.json';

  if (tries >= 5) {
    return null;
  }

  const asyncFetchURL = `${ASYNC_SHIPPING_RATES_ENDPOINT}${params ? `?${params}` : ''}`;
  const res = await fetch(asyncFetchURL);

  if (!res.ok) {
    throw new Error(`Failed to get async shipping rates: ${res.statusText}`);
  }

  const shippingRates = await res.json();

  if (!shippingRates) {
    // Wait 200ms before retrying
    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });

    return pollShippingRates(params, tries + 1);
  }

  return shippingRates;
};

/**
 * Generate shipping rates for a given area
 *
 * `zip` and `country` are required fields.
 * Depending on the area, `province` might be required or not.
 */
export const generateShippingRates = async (shippingAddress: ShippingAddress): Promise<ShippingRatesData> => {
  const { zip, country, province } = shippingAddress;

  const PREPARE_SHIPPING_RATES_ENDPOINT = '/cart/prepare_shipping_rates.json';

  const params = new URLSearchParams({
    ...(zip && { 'shipping_address[zip]': zip }),
    ...(country && { 'shipping_address[country]': country }),
    ...(province && { 'shipping_address[province]': province }),
  }).toString();

  const prepareFetchURL = `${PREPARE_SHIPPING_RATES_ENDPOINT}${params ? `?${params}` : ''}`;

  // Prepare shipping rates calculation
  const prepareRes = await fetch(prepareFetchURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!prepareRes.ok) {
    const prepareResJSON = await prepareRes.json();
    const respMessage = Object.values(prepareResJSON).join(' ');

    return {
      error: true,
      message: respMessage,
    };
  }

  // Poll for results using recursive approach
  return pollShippingRates(params);
};

/**
 * Submit checkout - redirect to Shopify checkout
 */
export const submitCheckout = (): void => {
  window.location.href = '/checkout';
};
