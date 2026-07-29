import { forwardRef, useMemo } from "react";
import type { ProgressProps } from "./types";
import { DEFAULT_MAX, DEFAULT_MIN, DEFAULT_SIZE, DEFAULT_VARIANT } from "./constants";
import { getBarClasses, getTrackClasses, getValueTextClasses } from "./styles";

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      min = DEFAULT_MIN,
      max = DEFAULT_MAX,
      size = DEFAULT_SIZE,
      variant = DEFAULT_VARIANT,
      label,
      showValue = false,
      indeterminate = false,
      striped = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const percentage = useMemo(() => {
      if (indeterminate) return 0;
      const clamped = Math.min(Math.max(value, min), max);
      return max === min ? 0 : ((clamped - min) / (max - min)) * 100;
    }, [value, min, max, indeterminate]);

    const ariaLabel = label
      ? typeof label === "string"
        ? label
        : undefined
      : "Loading progress";

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        className={className}
        {...rest}
      >
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-1">
            {label && (
              <span className={getValueTextClasses(size)}>{label}</span>
            )}
            {showValue && !indeterminate && (
              <span className={getValueTextClasses(size)}>
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div className={getTrackClasses({ size })}>
          <div
            className={getBarClasses({ variant, striped, indeterminate })}
            style={indeterminate ? undefined : { width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";

export { Progress };
