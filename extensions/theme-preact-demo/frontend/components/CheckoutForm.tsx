import { useCartWidgetContext } from '../contexts/CartWidgetContext';
import styles from '../styles/cart-widget.module.css';
import { FieldFeedback, NuButton } from './ui';

function CheckoutForm() {
  const { loading, feedbackMessages, currentTab, blockSettings } = useCartWidgetContext();

  const showEstimatedCalculator = !!blockSettings?.show_estimated_delivery_calculator;

  return (
    <div className={styles['nu-form__recap-container']}>
      <div className={styles['nu-form__recap']}>
        {currentTab === 'delivery' && showEstimatedCalculator && (
          <div className={styles['nu-recap__estimated']}>
            {feedbackMessages.estimated ? (
              <FieldFeedback
                message={feedbackMessages.estimated}
                type={feedbackMessages.estimated.includes('free') ? 'success' : 'info'}
                className="nu-estimated__text"
                showIcon={false}
              />
            ) : (
              <p className="nu-estimated__text">Click to estimate shipping costs</p>
            )}

            <NuButton
              type="submit"
              name="calculate"
              variant="outlined"
              isLoading={loading}
              loadingText="Calculating..."
            >
              Calculate
            </NuButton>
          </div>
        )}

        <NuButton type="submit" name="checkout" isLoading={loading} loadingText="Processing...">
          Checkout
        </NuButton>
      </div>
    </div>
  );
}

export default CheckoutForm;
