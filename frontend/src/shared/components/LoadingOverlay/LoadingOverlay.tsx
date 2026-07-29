import { forwardRef } from "react";
import type { LoadingOverlayProps } from "./types";
import {
  DEFAULT_LABEL,
  DEFAULT_MODE,
  DEFAULT_OPACITY,
  SPINNER_SIZE,
} from "./constants";
import { getOverlayClasses, getOverlayContentClasses, getOverlayLabelClasses } from "./styles";

const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  (
    {
      loading = false,
      mode = DEFAULT_MODE,
      label = DEFAULT_LABEL,
      spinner,
      backdrop = true,
      opacity = DEFAULT_OPACITY,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    if (!loading) {
      return <>{children}</>;
    }

    return (
      <div className="relative" data-testid="loading-overlay-container">
        {children}

        <div
          ref={ref}
          role="status"
          aria-live="polite"
          aria-label={label}
          className={getOverlayClasses({ mode, backdrop, className })}
          style={backdrop ? { opacity: undefined } : { backgroundColor: `rgba(255,255,255,${opacity})` }}
          data-testid="loading-overlay"
          {...rest}
        >
          <div className={getOverlayContentClasses()}>
            {spinner ?? (
              <svg
                width={SPINNER_SIZE}
                height={SPINNER_SIZE}
                viewBox="0 0 24 24"
                fill="none"
                className="animate-spin text-brand-primary"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeOpacity={0.25}
                  strokeWidth="3"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
            <span className={getOverlayLabelClasses()}>{label}</span>
          </div>
        </div>
      </div>
    );
  },
);

LoadingOverlay.displayName = "LoadingOverlay";

export { LoadingOverlay };
