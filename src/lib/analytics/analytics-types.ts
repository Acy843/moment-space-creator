export type TimeWindow = "morning" | "afternoon" | "evening";
export type RewardType = "completion_count" | "streak" | "walking_distance" | "consistency";

export type ActivityAnalytics = {
  activityId: string;
  activityName: string;
  category: string;
  completed: number;
  skipped: number;
  rescheduled: number;
  completionRate: number;
  totalMinutes: number;
};

export type ContextAnalytics = {
  context: string;
  completed: number;
  skipped: number;
  completionRate: number;
};

export type TimeWindowAnalytics = {
  timeWindow: TimeWindow;
  completed: number;
  skipped: number;
  completionRate: number;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  threshold: number;
  icon: string;
  unlockedAt: string | null;
  progress: number;
  total: number;
  unlocked: boolean;
};

export type AnalyticsSummary = {
  totalResets: number;
  completedResets: number;
  skippedResets: number;
  rescheduledResets: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalMovementMinutes: number;
  totalWalkingDistanceMeters: number;
  activeDays: number;
  consistencyScore: number;
  timePattern: TimeWindow;
  activityBreakdown: ActivityAnalytics[];
  contextBreakdown: ContextAnalytics[];
  timeBreakdown: TimeWindowAnalytics[];
  rewards: Reward[];
};
