import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { tokenManager } from "@/shared/api/token-manager";
import { QUERY_KEYS } from "@/shared/constants";

const REALTIME_URL = "/api/v1/admin/events";
const RECONNECT_DELAY_MS = 3000;

function useEventSource(): EventSource | null {
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    function connect() {
      const accessToken = tokenManager.getAccessToken();
      const url = accessToken
        ? `${REALTIME_URL}?access_token=${encodeURIComponent(accessToken)}`
        : REALTIME_URL;

      eventSource = new EventSource(url);

      eventSource.onerror = () => {
        eventSource?.close();
        if (!cancelled) {
          retryTimer = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };

      esRef.current = eventSource;
    }

    connect();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      eventSource?.close();
      esRef.current = null;
    };
  }, []);

  return esRef.current;
}

export interface AdminRealtimeEvent {
  type: string;
  data: Record<string, unknown>;
}

export function invalidateAllAdminQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_DASHBOARD });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_ACCOUNTS });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_CARDS });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_TRANSACTIONS });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_REQUESTS });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_AUDIT_LOGS });
}

export function useAdminRealtimeEvents(onEvent?: (event: AdminRealtimeEvent) => void) {
  const queryClient = useQueryClient();
  const eventSource = useEventSource();
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!eventSource) return;
    const handle = (raw: MessageEvent) => {
      let parsed: AdminRealtimeEvent;
      try {
        parsed = JSON.parse(raw.data) as AdminRealtimeEvent;
      } catch {
        return;
      }
      onEventRef.current?.(parsed);
      invalidateAllAdminQueries(queryClient);
    };
    eventSource.addEventListener("message", handle);
    return () => eventSource.removeEventListener("message", handle);
  }, [eventSource, queryClient]);

  return eventSource;
}