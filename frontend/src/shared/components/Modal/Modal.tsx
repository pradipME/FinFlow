import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/shared/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  hideClose?: boolean;
}

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const;

/**
 * Modal — accessible, animated dialog.
 * Renders through a portal, locks body scroll, closes on Esc/backdrop.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
  hideClose = false,
}: ModalProps): ReactNode {
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, handleKeyDown]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-modal flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === "string" ? title : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.18 }}
        >
          <div
            className="absolute inset-0 bg-bg-primary/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className={cn(
              "relative w-full rounded-xl border border-border-default bg-surface-primary shadow-elevation-xl outline-none",
              SIZES[size],
              className,
            )}
            initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
          >
            {!hideClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            )}
            {(title || description) && (
              <div className="border-b border-border-subtle px-5 py-4">
                {title && <h2 className="text-lg font-semibold tracking-tight text-text-primary">{title}</h2>}
                {description && <p className="mt-1 text-sm text-text-tertiary">{description}</p>}
              </div>
            )}
            <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-border-subtle bg-bg-secondary px-5 py-3.5 rounded-b-xl">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}