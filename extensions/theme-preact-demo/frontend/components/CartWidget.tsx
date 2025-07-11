import register from 'preact-custom-element';
import { CartWidgetProvider } from '../contexts/CartWidgetContext';
import type { CartWidgetProps } from '../types/cart-widget';
import { CartWidgetContent } from './CartContent';

// Styles
import '../styles/air-datepicker.css';

// Props received from custom element registration are strings
type CartWidgetElementProps = {
  appSettings?: string;
  blockSettings?: string;
  countries?: string;
  locations?: string;
};

function CartWidget({ appSettings, blockSettings, countries, locations }: CartWidgetElementProps) {
  const providerProps: CartWidgetProps = {
    appSettings: appSettings || '{}',
    blockSettings: blockSettings || '{}',
    countries: countries || '[]',
    locations: locations || '[]',
  };

  return (
    <CartWidgetProvider settings={providerProps}>
      <CartWidgetContent />
    </CartWidgetProvider>
  );
}

// Register the custom element with observed attributes
customElements.get('theme-preact-demo-cart-widget') ||
  register(CartWidget, 'theme-preact-demo-cart-widget', ['app-settings', 'block-settings', 'countries', 'locations'], {
    shadow: false,
  });

export default CartWidget;
