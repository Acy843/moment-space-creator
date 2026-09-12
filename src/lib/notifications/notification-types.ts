export type NotificationPermissionStatus = "unknown" | "granted" | "denied" | "unsupported";

export type ReminderStatus = "scheduled" | "triggered" | "dismissed" | "opened" | "completed";

export type Reminder = {
  id: string;
  resetId: string;
  scheduledFor: string;
  title: string;
  body: string;
  status: ReminderStatus;
  createdAt: string;
  triggeredAt: string | null;
  openedAt: string | null;
};
