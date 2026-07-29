import { forwardRef } from "react";
import { X } from "lucide-react";
import type { AlertProps } from "./types";
import { DEFAULT_SIZE, DEFAULT_VARIANT, ICON_SIZES } from "./constants";
import {
  getAlertActionClasses,
  getAlertClasses,
  getAlertCloseButtonClasses,
  getAlertIconClasses,
} from "./styles";

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = DEFAULT_VARIANT,
      size = DEFAULT_SIZE,
      title,
      children,
      icon,
      closable = false,
      onClose,
      action,
      accent = true,
      className,
      ...rest
    },
    ref,
  ) => {
    const iconSize = ICON_SIZES[size];

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={variant === "danger" ? "assertive" : "polite"}
        className={getAlertClasses({ variant, size, accent, className })}
        data-variant={variant}
        {...rest}
      >
        {icon && (
          <span className={getAlertIconClasses(variant)} aria-hidden="true">
            {icon}
          </span>
        )}

        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold leading-snug">{title}</p>
          )}
          <div className={title ? "mt-0.5" : undefined}>{children}</div>
        </div>

        {action && (
          <span className={getAlertActionClasses()}>{action}</span>
        )}

        {closable && (
          <button
            type="button"
            aria-label="Dismiss alert"
            className={getAlertCloseButtonClasses()}
            onClick={onClose}
          >
            <X size={iconSize} strokeWidth={2} />
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";

export { Alert };
