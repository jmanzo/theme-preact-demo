// Types
// ---------------------------------------
import { memo } from 'preact/compat';
import styles from '../../styles/nu-field-feedback.module.css';
import NuIcon from './NuIcon';

export type FeedbackType = 'success' | 'error' | 'info' | 'warning';

export type FieldFeedbackProps = {
  message: string;
  type?: FeedbackType;
  className?: string;
  showIcon?: boolean;
};

// Component
// ---------------------------------------
function FieldFeedbackInner({
  message,
  type = 'info',
  className: propClass = '',
  showIcon = true,
}: FieldFeedbackProps) {
  const combinedClass = [styles['field-feedback'], styles[type], propClass].filter(Boolean).join(' ');

  const icon = showIcon ? (
    <NuIcon name={type} size={type === 'success' ? 20 : 16} ariaLabel={`${type} icon`} />
  ) : null;

  return (
    <p className={combinedClass} role={type === 'error' ? 'alert' : 'status'} aria-live="polite">
      {icon}
      {message}
    </p>
  );
}

const FieldFeedback = memo(FieldFeedbackInner);

export default FieldFeedback;
