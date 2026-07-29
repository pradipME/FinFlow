/**
 * Toast — Enterprise Toast Notification System
 *
 * Provides context, provider, hook, container, and individual toast items.
 *
 * Architecture:
 *   ToastProvider      — wraps the app, manages toast state via useReducer
 *   useToast()         — hook to add / update / dismiss toasts from anywhere
 *   ToastContainer     — fixed-position wrapper that renders the stack
 *   ToastItem          — single toast card with animation, auto-close, swipe
 *
 * Features:
 *   - 5 variants (success, info, warning, danger, loading)
 *   - 6 positions (top/bottom × left/center/right)
 *   - Auto-close with pause on hover
 *   - Manual close button
 *   - Action button
 *   - Promise toast (loading → success/error)
 *   - Swipe to dismiss (framer-motion drag)
 *   - Queue with max visible limit
 *   - Accessible (role="status", aria-live, focus management)
 *
 * Integration:
 *   Theme tokens via Tailwind classes (no hardcoded colors)
 *   Motion presets from @/shared/motion (toastEnter, toastExit)
 *   useReducedMotion() for graceful degradation
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { useReducedMotion, toastEnter } from "@/shared/motion";
import {
  DEFAULT_AUTO_CLOSE,
  DEFAULT_MAX_VISIBLE,
  DEFAULT_GAP,
  DEFAULT_POSITION,
  SWIPE_THRESHOLD,
  SWIPE_VELOCITY,
} from "./constants";
import {
  getToastItemClasses,
  getToastIconClasses,
  getToastContainerClasses,
  ACTION_BUTTON_CLASSES,
  CLOSE_BUTTON_CLASSES,
} from "./styles";
import type {
  Toast,
  ToastVariant,
  ToastPosition,
  ToastOptions,
  ToastMethods,
  ToastProviderProps,
  ToastItemProps,
} from "./types";

// ── Icons ────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function DangerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Variant → Icon Map ───────────────────────────────────────────

const VARIANT_ICONS: Record<ToastVariant, () => JSX.Element> = {
  success: CheckIcon,
  info: InfoIcon,
  warning: WarningIcon,
  danger: DangerIcon,
  loading: SpinnerIcon,
};

// ── Reducer ──────────────────────────────────────────────────────

type ToastAction =
  | { type: "ADD"; toast: Toast }
  | { type: "UPDATE"; id: string; update: Partial<Toast> }
  | { type: "DISMISS"; id: string }
  | { type: "DISMISS_ALL" }
  | { type: "REMOVE"; id: string };

function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.toast];
    case "UPDATE":
      return state.map((t) =>
        t.id === action.id ? { ...t, ...action.update } : t,
      );
    case "DISMISS":
      return state.filter((t) => t.id !== action.id);
    case "DISMISS_ALL":
      return [];
    case "REMOVE":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────

interface ToastContextValue {
  toasts: Toast[];
  dispatch: React.Dispatch<ToastAction>;
  position: ToastPosition;
  maxVisible: number;
  defaultAutoClose: number | false;
  gap: number;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ── useToastContext (internal) ───────────────────────────────────

function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}

// ── useToast (public hook) ──────────────────────────────────────

let counter = 0;
function generateId(): string {
  counter += 1;
  return `toast-${counter}-${Date.now()}`;
}

/**
 * Hook to interact with the toast system.
 *
 * @example
 *   const { toast } = useToast();
 *   toast.success("Payment received!");
 *   toast.promise(saveInvoice(), { loading: "Saving…", success: "Saved", error: "Failed" });
 */
export function useToast(): { toast: ToastMethods } {
  const { dispatch, defaultAutoClose } = useToastContext();

  const addToast = useCallback(
    (options: ToastOptions): string => {
      const id = options.id ?? generateId();
      const toast: Toast = {
        id,
        variant: options.variant,
        message: options.message,
        description: options.description,
        autoClose: options.autoClose ?? defaultAutoClose,
        closable: options.closable ?? true,
        action: options.action,
        isPromise: options.isPromise ?? false,
        createdAt: Date.now(),
      };
      dispatch({ type: "ADD", toast });
      return id;
    },
    [dispatch, defaultAutoClose],
  );

  const dismiss = useCallback(
    (id: string) => dispatch({ type: "DISMISS", id }),
    [dispatch],
  );

  const dismissAll = useCallback(
    () => dispatch({ type: "DISMISS_ALL" }),
    [dispatch],
  );

  const update = useCallback(
    (id: string, update: Partial<Toast>) =>
      dispatch({ type: "UPDATE", id, update }),
    [dispatch],
  );

  const toast = useMemo<ToastMethods>(
    () => ({
      success: (message, opts) =>
        addToast({ ...opts, variant: "success", message }),
      info: (message, opts) =>
        addToast({ ...opts, variant: "info", message }),
      warning: (message, opts) =>
        addToast({ ...opts, variant: "warning", message }),
      error: (message, opts) =>
        addToast({ ...opts, variant: "danger", message }),
      loading: (message, opts) =>
        addToast({ ...opts, variant: "loading", message }),
      dismiss,
      dismissAll,
      update,
      promise: (promise, options) => {
        const id = addToast({
          variant: "loading",
          message: options.loading,
          description: options.description,
          isPromise: true,
          autoClose: false,
          closable: false,
        });

        promise
          .then((data) => {
            const msg =
              typeof options.success === "function"
                ? options.success(data)
                : options.success;
            update(id, {
              variant: "success",
              message: msg,
              isPromise: false,
              closable: true,
              autoClose: options.autoClose ?? defaultAutoClose,
            });
          })
          .catch((err) => {
            const msg =
              typeof options.error === "function"
                ? options.error(err)
                : options.error;
            update(id, {
              variant: "danger",
              message: msg,
              isPromise: false,
              closable: true,
              autoClose: options.autoClose ?? defaultAutoClose,
            });
          });

        return id;
      },
    }),
    [addToast, dismiss, dismissAll, update, defaultAutoClose],
  );

  return { toast };
}

// ── ToastItem ────────────────────────────────────────────────────

function ToastItemComponent({ toast: t, position, gap, index }: ToastItemProps) {
  const reduced = useReducedMotion();
  const { dispatch } = useToastContext();
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const Icon = VARIANT_ICONS[t.variant];

  // ── Auto-close timer ────────────────────────────────────────
  useEffect(() => {
    if (t.autoClose === false || hovered || t.variant === "loading") {
      return;
    }
    const remaining =
      t.autoClose - (Date.now() - t.createdAt);
    if (remaining <= 0) {
      dispatch({ type: "REMOVE", id: t.id });
      return;
    }
    timerRef.current = setTimeout(() => {
      dispatch({ type: "REMOVE", id: t.id });
    }, remaining);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [t.autoClose, t.createdAt, t.id, t.variant, hovered, dispatch]);

  // ── Swipe to dismiss ────────────────────────────────────────
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipedRight = info.offset.x > SWIPE_THRESHOLD;
    const fastSwipe =
      info.velocity.x > SWIPE_VELOCITY || info.offset.x > SWIPE_THRESHOLD * 0.5;
    if (swipedRight || fastSwipe) {
      dispatch({ type: "REMOVE", id: t.id });
    }
  };

  // ── Dismiss handler ─────────────────────────────────────────
  const handleDismiss = () => {
    dispatch({ type: "REMOVE", id: t.id });
  };

  // ── Stack offset ────────────────────────────────────────────
  const yOffset = index * (72 + gap);

  // ── Animation variants (direction-aware) ────────────────────
  const isTop = position.startsWith("top");
  const xOffset = position.includes("left") ? -80 : position.includes("right") ? 80 : 0;

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: reduced ? 0 : xOffset,
      y: reduced ? 0 : isTop ? -8 : 8,
      scale: reduced ? 1 : 0.96,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: reduced
        ? { duration: 0 }
        : { type: "spring", stiffness: 350, damping: 28, mass: 0.8 },
    },
    exit: {
      opacity: 0,
      x: reduced ? 0 : 40,
      scale: reduced ? 1 : 0.96,
      transition: reduced
        ? { duration: 0 }
        : { duration: 0.2, ease: [0.4, 0, 1, 1] },
    },
  };

  return (
    <motion.div
      layout
      layoutId={t.id}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={getToastItemClasses(t.variant, position)}
      role="status"
      aria-live={t.variant === "danger" ? "assertive" : "polite"}
      aria-atomic="true"
      style={{ marginBottom: gap }}
      data-variant={t.variant}
      data-toast-id={t.id}
    >
      {/* Icon */}
      <div className={getToastIconClasses(t.variant)}>
        <Icon />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary leading-snug">
          {t.message}
        </p>
        {t.description && (
          <p className="mt-1 text-xs text-text-secondary leading-relaxed">
            {t.description}
          </p>
        )}
        {t.action && (
          <button
            type="button"
            className={ACTION_BUTTON_CLASSES}
            onClick={t.action.onClick}
          >
            {t.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      {t.closable && (
        <button
          type="button"
          className={CLOSE_BUTTON_CLASSES}
          onClick={handleDismiss}
          aria-label="Dismiss notification"
        >
          <CloseIcon />
        </button>
      )}
    </motion.div>
  );
}

const ToastItem = ToastItemComponent;

// ── ToastContainer ───────────────────────────────────────────────

function ToastContainer() {
  const { toasts, position, maxVisible, gap } = useToastContext();

  const visibleToasts = toasts.slice(-maxVisible);
  const isTop = position.startsWith("top");
  const orderedToasts = isTop ? visibleToasts : [...visibleToasts].reverse();

  return (
    <div
      className={getToastContainerClasses(position)}
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {orderedToasts.map((t, i) => (
          <ToastItem
            key={t.id}
            toast={t}
            position={position}
            gap={gap}
            index={isTop ? i : orderedToasts.length - 1 - i}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── ToastProvider ────────────────────────────────────────────────

/**
 * Provider that wraps the app to enable toast notifications.
 *
 * @example
 *   <ToastProvider position="top-right" maxVisible={5}>
 *     <App />
 *   </ToastProvider>
 */
export function ToastProvider({
  children,
  position = DEFAULT_POSITION,
  maxVisible = DEFAULT_MAX_VISIBLE,
  defaultAutoClose = DEFAULT_AUTO_CLOSE,
  gap = DEFAULT_GAP,
}: ToastProviderProps) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      dispatch,
      position,
      maxVisible,
      defaultAutoClose,
      gap,
    }),
    [toasts, position, maxVisible, defaultAutoClose, gap],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
