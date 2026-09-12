export type CameraPermissionStatus = "unknown" | "granted" | "denied" | "unavailable";

export type CameraVerificationStage = "not_started" | "preparing" | "scanning" | "verified" | "failed";

export type CameraVerificationState = {
  status: CameraVerificationStage;
  permissionStatus: CameraPermissionStatus;
  message: string;
};
