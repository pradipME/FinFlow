import { forwardRef, useMemo } from "react";
import { cn } from "@/shared/utils";
import type { ProgressRingProps } from "./types";
import {
  DEFAULT_MAX,
  DEFAULT_MIN,
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
  SIZE_MAP,
} from "./constants";
import { getRingBarClasses, getRingValueClasses } from "./styles";

const ProgressRing = forwardRef<SVGSVGElement, ProgressRingProps>(
  (
    {
      value = 0,
      min = DEFAULT_MIN,
      max = DEFAULT_MAX,
      size = DEFAULT_SIZE,
      variant = DEFAULT_VARIANT,
      strokeWidth,
      label,
      showValue = false,
      indeterminate = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const { dimension, strokeWidth: defaultStroke } = SIZE_MAP[size];
    const sw = strokeWidth ?? defaultStroke;
    const radius = (dimension - sw) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = dimension / 2;

    const percentage = useMemo(() => {
      if (indeterminate) return 0;
      const clamped = Math.min(Math.max(value, min), max);
      return max === min ? 0 : ((clamped - min) / (max - min)) * 100;
    }, [value, min, max, indeterminate]);

    const dashOffset = useMemo(() => {
      return circumference - (percentage / 100) * circumference;
    }, [percentage, circumference]);

    const ariaLabel = label
      ? typeof label === "string"
        ? label
        : undefined
      : "Loading progress";

    return (
      <div className={cn("relative inline-flex items-center justify-center", className)}>
        <svg
          ref={ref}
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${dimension} ${dimension}`}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : Math.round(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={ariaLabel}
          className={indeterminate ? "animate-[spin_1.4s_linear_infinite]" : undefined}
          {...rest}
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={sw}
          />
          {/* Bar */}
          {!indeterminate && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              className={getRingBarClasses({ variant, indeterminate: false })}
              strokeWidth={sw}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${center} ${center})`}
            />
          )}
        </svg>

        {/* Center content */}
        {(children || (showValue && !indeterminate)) && (
          <div className={getRingValueClasses(size)}>
            {children ?? <span>{Math.round(percentage)}%</span>}
          </div>
        )}
      </div>
    );
  },
);

ProgressRing.displayName = "ProgressRing";

export { ProgressRing };
