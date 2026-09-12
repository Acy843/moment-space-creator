import { nowIso } from "@/lib/mova-types";
import type { NotificationPermissionStatus, Reminder } from "@/lib/notifications/notification-types";

export type ReminderOutcome = "browser" | "in_app" | "disabled";

export type NotificationState = {
  permissionStatus: NotificationPermissionStatus;
  supportAvailable: boolean;
  lastTriggeredReminder: Reminder | null;
};

export function getNotificationPermissionStatus(): NotificationPermissionStatus {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";

  const state = Notification.permission;
  if (state === "granted") return "granted";
  if (state === "denied") return "denied";
  return "unknown";
}

export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  const permission = await Notification.requestPermission();
  if (permission === "granted") return "granted";
  if (permission === "denied") return "denied";
  return "unknown";
}

export function canUseBrowserNotifications(): boolean {
  return typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted";
}

export function createReminder(resetId: string, scheduledFor: string, title: string, body: string): Reminder {
  const stamp = nowIso();
  return {
    id: `rem-${resetId}-${Date.now()}`,
    resetId,
    scheduledFor,
    title,
    body,
    status: "scheduled",
    createdAt: stamp,
    triggeredAt: null,
    openedAt: null,
  };
}

export function triggerBrowserReminder(reminder: Reminder): ReminderOutcome {
  if (typeof window === "undefined" || !("Notification" in window)) return "in_app";
  if (Notification.permission !== "granted") return "in_app";

  new Notification(reminder.title, {
    body: reminder.body,
    tag: reminder.id,
  });

  return "browser";
}
