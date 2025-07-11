// Types
// ---------------------------------------
export type LoadingSpinnerProps = {
  size?: number;
  className?: string;
  color?: string;
  text?: string;
  inline?: boolean;
};

// Component
// ---------------------------------------
function LoadingSpinner({
  size = 16,
  className: propClass = '',
  color = 'currentColor',
  text,
  inline = false,
}: LoadingSpinnerProps) {
  const containerClass = inline ? 'nu-loading-spinner--inline' : 'nu-loading-spinner';
  const spinnerClass = `nu-loading-spinner__icon ${propClass}`.trim();

  return (
    <div className={containerClass}>
      <svg
        className={spinnerClass}
        fill={color}
        width={size}
        height={size}
        viewBox="0 0 26.349 26.35"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g>
          <circle cx="13.792" cy="3.082" r="3.082" />
          <circle cx="6.219" cy="6.218" r="2.774" />
          <circle cx="3.082" cy="13.792" r="2.465" />
          <circle cx="5.801" cy="21.400" r="2.100" />
          <circle cx="13.792" cy="24.501" r="1.849" />
          <circle cx="21.365" cy="21.363" r="1.541" />
          <circle cx="24.501" cy="13.791" r="1.232" />
          <circle cx="21.364" cy="6.218" r="0.924" />
        </g>
      </svg>
      {text && <span className="nu-loading-spinner__text">{text}</span>}
    </div>
  );
}

export default LoadingSpinner;
