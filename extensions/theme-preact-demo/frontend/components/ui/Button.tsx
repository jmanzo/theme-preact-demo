/* eslint-disable react/button-has-type */
import { memo } from 'preact/compat';
import styles from '../../styles/button.module.css';
import LoadingSpinner from './LoadingSpinner';

// Types
// ---------------------------------------
export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text' | 'icon';
export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = {
  name?: string;
  id?: string;
  children?: JSX.Element | string;
  isLoading?: boolean;
  loadingText?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  formAttr?: string;
  className?: string;
};

// Component
// ---------------------------------------
function ButtonInner({
  name,
  id,
  children,
  isLoading = false,
  variant = 'primary',
  size = 'medium',
  leftIcon,
  rightIcon,
  disabled: propDisabled = false,
  type: propType = 'button',
  formAttr,
  className: propClass,
  ...rest
}: ButtonProps) {
  const showAsLoading = isLoading;
  const isExternallyDisabled = propDisabled;
  const finalDisabledState = showAsLoading || isExternallyDisabled;
  const classes = [
    styles['demo-button'],
    variant === 'outlined' ? styles.outlined : '',
    styles[`demo-button--${size}`],
    !children && (leftIcon || rightIcon) ? styles['demo-button--icon-only'] : '',
    showAsLoading ? styles['demo-loading'] : '',
    propClass,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      type={propType}
      name={name}
      id={id}
      className={classes}
      disabled={finalDisabledState}
      {...(formAttr ? { form: formAttr } : {})}
      {...rest}
    >
      <span className={styles['demo-button__content']}>
        {leftIcon && (
          <span className={`${styles['demo-button__icon']} ${styles['demo-button__icon--left']}`}>{leftIcon}</span>
        )}
        {children}
        {rightIcon && (
          <span className={`${styles['demo-button__icon']} ${styles['demo-button__icon--right']}`}>{rightIcon}</span>
        )}
      </span>

      <span className={styles['demo-button__loading-icon']}>
        <LoadingSpinner size={16} inline color="currentColor" />
      </span>
    </button>
  );
}

const Button = memo(ButtonInner);

export default Button;
