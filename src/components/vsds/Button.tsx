import * as React from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Renders an icon before the label. Hidden from assistive technology. */
  iconLeft?: React.ReactNode;
  /** Renders an icon after the label. Hidden from assistive technology. */
  iconRight?: React.ReactNode;
  /** Stretches the button to fill its container. */
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 disabled:bg-blue-300",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-400",
  outline:
    "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-400 disabled:border-gray-200 disabled:text-gray-400",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400 disabled:text-gray-400",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

const spinnerSizeClasses: Record<ButtonSize, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  disabled,
  children,
  className = "",
  onClick,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Track button clicks for analytics
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (typeof window.__analytics !== "undefined") {
        window.__analytics.track("button_click", { variant, size });
      }
      onClick?.(e);
    },
    [onClick, variant, size],
  );

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={loading}
      onClick={handleClick}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium", // 'rounded-lg' preserved from MODIFIED
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed",
        fullWidth ? "w-full" : "",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? (
        <svg
          aria-hidden="true"
          className={`animate-spin ${spinnerSizeClasses[size]}`} // spinnerSizeClasses from NEW
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            fill="currentColor"
          />
        </svg>
      ) : (
        // iconLeft (was 'icon' in MODIFIED) with MODIFIED's 'shrink-0' class and NEW's 'aria-hidden'
        iconLeft && (
          <span className="shrink-0" aria-hidden="true">
            {iconLeft}
          </span>
        )
      )}
      {children}
      {/* iconRight from NEW, displayed only when not loading */}
      {!loading && iconRight && <span aria-hidden="true">{iconRight}</span>}
    </button>
  );
}

// Global type declaration preserved from MODIFIED
declare global {
  interface Window {
    __analytics?: {
      track: (event: string, props?: Record<string, unknown>) => void;
    };
  }
}
