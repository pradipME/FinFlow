import { forwardRef } from "react";
import type { EmptyStateProps } from "./types";
import {
  getEmptyStateActionsClasses,
  getEmptyStateClasses,
  getEmptyStateDescriptionClasses,
  getEmptyStateIconClasses,
  getEmptyStateTitleClasses,
} from "./styles";

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { icon, title, description, action, secondaryAction, className, children, ...rest },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={getEmptyStateClasses(className)}
        data-testid="empty-state"
        {...rest}
      >
        {icon && (
          <div className={getEmptyStateIconClasses()} aria-hidden="true">
            {icon}
          </div>
        )}

        <h3 className={getEmptyStateTitleClasses()}>{title}</h3>

        {description && (
          <p className={getEmptyStateDescriptionClasses()}>{description}</p>
        )}

        {(action || secondaryAction) && (
          <div className={getEmptyStateActionsClasses()}>
            {action}
            {secondaryAction}
          </div>
        )}

        {children}
      </div>
    );
  },
);

EmptyState.displayName = "EmptyState";

export { EmptyState };
