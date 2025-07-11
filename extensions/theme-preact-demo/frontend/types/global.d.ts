/**
 * Global type declarations for the cart widget
 */

import type { AirDatepicker } from './air-datepicker';
import type { ThemePreactDemo } from './cart-widget';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    AirDatepicker?: AirDatepicker;
    ThemePreactDemo?: ThemePreactDemo;
    Shopify?: {
      locale?: string;
    };
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface HTMLElementTagNameMap {
    'theme-preact-demo-cart-widget': HTMLElement;
  }
}

export {};
