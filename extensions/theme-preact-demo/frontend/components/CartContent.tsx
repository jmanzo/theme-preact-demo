import type { JSX } from 'preact';
import { useRef } from 'preact/hooks';
import { useCartWidgetContext } from '../contexts/CartWidgetContext';
import styles from '../styles/cart-widget.module.css';
import type { WidgetTab } from '../types/cart-widget';
import { formDataToCartWidgetFormData, isSubmitEvent } from '../utils/cart-widget-helpers';
import CheckoutForm from './CheckoutForm';
import DeliveryForm from './DeliveryForm';
import PickupForm from './PickupForm';

export function CartWidgetContent() {
  const formRef = useRef<HTMLFormElement>(null);
  // Get cart widget state from context
  const { currentTab, handleTabChange, isPickupEnabled, loading, handleSubmit } = useCartWidgetContext();

  const handleTabClick = (tab: WidgetTab) => {
    handleTabChange(tab);
  };

  const handleFormSubmit = async (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    event.preventDefault();

    const { currentTarget: form } = event;

    if (!isSubmitEvent(event)) {
      // eslint-disable-next-line no-console
      console.error('Event is not a SubmitEvent');
      return;
    }

    const { submitter } = event;
    if (!submitter || !(submitter instanceof HTMLButtonElement) || !submitter.name) {
      // eslint-disable-next-line no-console
      console.error('Submitter element is missing or lacks a name attribute.');
      return;
    }

    const formData = new FormData(form);
    const formDataObject = formDataToCartWidgetFormData(formData);

    await handleSubmit(submitter.name, formDataObject);
  };

  return (
    <div className={`${styles.container} ${loading ? styles.loading : ''}`.trim()}>
      <header>
        <nav>
          <ul className={styles['nav-list']}>
            <li className={`${styles['nav-item']} ${currentTab === 'delivery' ? styles.active : ''}`.trim()}>
              <button type="button" data-tab="delivery" onClick={() => handleTabClick('delivery')}>
                Delivery
              </button>
            </li>
            {isPickupEnabled && (
              <li className={`${styles['nav-item']} ${currentTab === 'pickup' ? styles.active : ''}`.trim()}>
                <button type="button" data-tab="pickup" onClick={() => handleTabClick('pickup')}>
                  Pickup
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <form className={styles.form} id="cart" ref={formRef} onSubmit={handleFormSubmit}>
        <DeliveryForm />
        <PickupForm />
        <CheckoutForm />
      </form>
    </div>
  );
}
