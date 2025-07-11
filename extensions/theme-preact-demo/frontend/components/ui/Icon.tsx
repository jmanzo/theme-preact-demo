import styles from '../../styles/nu-icon.module.css';

// Icon names supported across the app
export type IconName =
  | 'map-pin'
  | 'caret-down'
  | 'plus'
  | 'minus'
  | 'loading-spinner'
  | 'checkmark'
  | 'shipping'
  | 'store'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export type NuIconProps = {
  /** Icon identifier */
  name: IconName;
  /** Size in pixels (applies to both width & height) */
  size?: number;
  /** Additional class names */
  className?: string;
  /** Accessible label. If provided, SVG will be exposed to screen-readers; otherwise it will be aria-hidden. */
  ariaLabel?: string;
};

/**
 * Centralised SVG icon component so the same asset can be reused across the UI.
 */
function NuIcon({ name, size = 16, className = '', ariaLabel }: NuIconProps) {
  const commonProps = {
    width: size,
    height: size,
    className: `${styles.nu__icon} ${className}`.trim(),
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    'aria-hidden': ariaLabel ? undefined : 'true',
    'aria-label': ariaLabel,
  } as const;

  switch (name) {
    case 'map-pin':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path
            /* eslint-disable-line react/no-unknown-property */ stroke="currentColor"
            d="M5 10.329C5 6.2813 8.22355 3 12.2 3C16.1765 3 19.4 6.2813 19.4 10.329C19.4 14.345 17.102 19.0312 13.5166 20.707C12.6809 21.0977 11.7191 21.0977 10.8834 20.707C7.29799 19.0312 5 14.345 5 10.329Z"
          />
          <path
            /* eslint-disable-line react/no-unknown-property */ stroke="currentColor"
            d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
          />
        </svg>
      );
    case 'caret-down':
      return (
        <svg viewBox="0 0 10 6" {...commonProps}>
          <path
            /* eslint-disable react/no-unknown-property */
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
          />
        </svg>
      );
    case 'plus':
      return (
        <svg viewBox="0 0 41 32" {...commonProps}>
          <path
            fill="currentColor"
            /* eslint-disable react/no-unknown-property */
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M21 15.5V11.5H20L20 15.5H16V16.5H20L20 20.5H21V16.5H25V15.5H21Z"
          />
        </svg>
      );
    case 'minus':
      return (
        <svg viewBox="0 0 41 32" {...commonProps}>
          <path
            /* eslint-disable-line react/no-unknown-property */
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16 16H25"
          />
          <path d="M16 16H25" /* eslint-disable-line react/no-unknown-property */ stroke="currentColor" />
        </svg>
      );
    case 'loading-spinner':
      return (
        <svg viewBox="0 0 26.349 26.35" {...commonProps} fill="currentColor">
          <g>
            <circle cx="13.792" cy="3.082" r="3.082" />
            <circle cx="6.219" cy="6.218" r="2.774" />
            <circle cx="3.082" cy="13.792" r="2.465" />
            <circle cx="5.801" cy="21.4" r="2.1" />
            <circle cx="13.792" cy="24.501" r="1.849" />
            <circle cx="21.365" cy="21.363" r="1.541" />
            <circle cx="24.501" cy="13.791" r="1.232" />
            <circle cx="21.364" cy="6.218" r="0.924" />
          </g>
        </svg>
      );
    case 'checkmark':
      return (
        <svg viewBox="0 0 16 16" {...commonProps}>
          <rect
            x="0.25"
            y="0.453125"
            width="15.5"
            height="15.5"
            /* eslint-disable-line react/no-unknown-property */ stroke="currentColor"
            stroke-width="0.5"
          />
          <path
            d="M4 7.70312L7 10.7031L12.5 5.20312"
            /* eslint-disable-line react/no-unknown-property */ stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
      );
    case 'shipping':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path
            /* eslint-disable-line react/no-unknown-property */ stroke="currentColor"
            d="M7.33211 16.4737H14.2884C14.4873 16.4737 14.678 16.3947 14.8187 16.2541C14.9593 16.1134 15.0384 15.9226 15.0384 15.7237V6.10498C15.0384 5.90607 14.9593 5.7153 14.8187 5.57465C14.678 5.434 14.4873 5.35498 14.2884 5.35498H3.25586C3.05695 5.35498 2.86618 5.434 2.72553 5.57465C2.58488 5.7153 2.50586 5.90607 2.50586 6.10498V15.7162C2.50586 15.9151 2.58488 16.1059 2.72553 16.2466C2.86618 16.3872 3.05695 16.4662 3.25586 16.4662H4.23086"
          />
          <path
            /* eslint-disable-line react/no-unknown-property */ stroke="currentColor"
            d="M16.6238 16.4734H15.0713V8.71094H18.75C18.8042 8.71093 18.8577 8.72266 18.9069 8.74532C18.9561 8.76798 18.9998 8.80103 19.035 8.84219L21.3975 11.6734C21.4534 11.7409 21.484 11.8258 21.4838 11.9134V16.4734H19.875"
          />
          <path
            /* eslint-disable-line react/no-unknown-property */ stroke="currentColor"
            d="M5.82418 18.6484C6.74373 18.6484 7.48918 17.8929 7.48918 16.9609C7.48918 16.029 6.74373 15.2734 5.82418 15.2734C4.90463 15.2734 4.15918 16.029 4.15918 16.9609C4.15918 17.8929 4.90463 18.6484 5.82418 18.6484Z"
          />
          <path
            /* eslint-disable-line react/no-unknown-property */ stroke="currentColor"
            d="M18.2177 18.6484C19.1373 18.6484 19.8827 17.8929 19.8827 16.9609C19.8827 16.029 19.1373 15.2734 18.2177 15.2734C17.2982 15.2734 16.5527 16.029 16.5527 16.9609C16.5527 17.8929 17.2982 18.6484 18.2177 18.6484Z"
          />
        </svg>
      );
    case 'store':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          {/* simplified stroke paths from snippet */}
          <g id="building-store">
            <path
              /* eslint-disable-line react/no-unknown-property */ stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 19.2502H17.25C18.3546 19.2502 19.25 18.3548 19.25 17.2502V8.18322C19.25 7.89772 19.1889 7.61553 19.0708 7.35561L18.533 6.17239C18.2084 5.45841 17.4965 5 16.7122 5H7.28783C6.50354 5 5.79164 5.45841 5.4671 6.1724L4.92927 7.35561C4.81113 7.61553 4.75 7.89772 4.75 8.18322V17.2502C4.75 18.3548 5.64544 19.2502 6.75 19.2502Z"
            />
            <path
              /* eslint-disable-line react/no-unknown-property */ stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.5 7.75C9.5 8.99264 8.5 10.25 7 10.25C5.5 10.25 4.75 8.99264 4.75 7.75"
            />
            <path
              /* eslint-disable-line react/no-unknown-property */ stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.25 7.75C19.25 8.99264 18.5 10.25 17 10.25C15.5 10.25 14.5 8.99264 14.5 7.75"
            />
            <path
              /* eslint-disable-line react/no-unknown-property */ stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.5 7.75C14.5 8.99264 13.5 10.25 12 10.25C10.5 10.25 9.5 8.99264 9.5 7.75"
            />
            <path
              /* eslint-disable-line react/no-unknown-property */ stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.75 15.7495C9.75 14.6449 10.6455 13.7495 11.75 13.7495H12.25C13.3546 13.7495 14.25 14.6449 14.25 15.7495V19.2495H9.75V15.7495Z"
            />
          </g>
        </svg>
      );
    case 'success':
      return (
        <svg viewBox="0 0 20 20" {...commonProps}>
          <path
            fill="currentColor"
            d="M13.2803 9.03033C13.5732 8.73744 13.5732 8.26256 13.2803 7.96967C12.9874 7.67678 12.5126 7.67678 12.2197 7.96967L9.25 10.9393L8.03033 9.71967C7.73744 9.42678 7.26256 9.42678 6.96967 9.71967C6.67678 10.0126 6.67678 10.4874 6.96967 10.7803L8.71967 12.5303C9.01256 12.8232 9.48744 12.8232 9.78033 12.5303L13.2803 9.03033Z"
          />
          <path
            fill="currentColor"
            // eslint-disable-next-line react/no-unknown-property
            fill-rule="evenodd"
            // eslint-disable-next-line react/no-unknown-property
            clip-rule="evenodd"
            d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10ZM15.5 10C15.5 13.0376 13.0376 15.5 10 15.5C6.96243 15.5 4.5 13.0376 4.5 10C4.5 6.96243 6.96243 4.5 10 4.5C13.0376 4.5 15.5 6.96243 15.5 10Z"
          />
        </svg>
      );
    case 'error':
      return (
        <svg viewBox="0 0 16 16" {...commonProps}>
          <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1" />
          <path d="M6 6L10 10M10 6L6 10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'warning':
      return (
        <svg viewBox="0 0 16 16" {...commonProps}>
          <path d="M8 1L15 14H1L8 1Z" stroke="currentColor" strokeWidth="1" />
          <path d="M8 5V9" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="12" r="0.5" fill="currentColor" />
        </svg>
      );
    case 'info':
      return (
        <svg viewBox="0 0 16 16" {...commonProps}>
          <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1" />
          <path d="M8 4V8" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="12" r="0.5" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

export default NuIcon;
