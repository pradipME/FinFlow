import { forwardRef } from "react";
import { AlertTriangle } from "lucide-react";
import type { ErrorStateProps } from "./types";
import { DEFAULT_RETRY_LABEL, DEFAULT_TITLE } from "./constants";
import {
  getErrorStateActionsClasses,
  getErrorStateClasses,
  getErrorStateDescriptionClasses,
  getErrorStateIconClasses,
  getErrorStateTitleClasses,
  getErrorCodeClasses,
} from "./styles";

const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      icon,
      title = DEFAULT_TITLE,
      description,
      errorCode,
      retryLabel = DEFAULT_RETRY_LABEL,
      onRetry,
      secondaryAction,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={getErrorStateClasses(className)}
        data-testid="error-state"
        role="alert"
        {...rest}
      >
        <div className={getErrorStateIconClasses()} aria-hidden="true">
          {icon ?? <AlertTriangle size={40} strokeWidth={1.5} />}
        </div>

        <h3 className={getErrorStateTitleClasses()}>{title}</h3>

        {description && (
          <p className={getErrorStateDescriptionClasses()}>{description}</p>
        )}

        {errorCode !== undefined && (
          <p className={getErrorCodeClasses()}>
            Error {errorCode}
          </p>
        )}

        <div className={getErrorStateActionsClasses()}>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-danger hover:bg-danger/90 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
            >
              {retryLabel}
            </button>
          )}
          {secondaryAction}
        </div>

        {children}
      </div>
    );
  },
);

ErrorState.displayName = "ErrorState";

export { ErrorState };
