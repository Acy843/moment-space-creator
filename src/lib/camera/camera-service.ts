import type { CameraPermissionStatus, CameraVerificationState } from "@/lib/camera/camera-types";

export type CameraErrorCode = "unsupported" | "permission_denied" | "no_camera" | "stream_failed";

export type StartCameraResult = {
  success: boolean;
  stream: MediaStream | null;
  permissionStatus: CameraPermissionStatus;
  errorCode?: CameraErrorCode;
  message: string;
};

export async function requestCameraStream(): Promise<StartCameraResult> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      success: false,
      stream: null,
      permissionStatus: "unavailable",
      errorCode: "unsupported",
      message: "This browser does not support camera verification.",
    };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    return {
      success: true,
      stream,
      permissionStatus: "granted",
      message: "Camera ready.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Camera access was denied.";
    const permissionStatus: CameraPermissionStatus = message.toLowerCase().includes("denied") ? "denied" : "unavailable";
    return {
      success: false,
      stream: null,
      permissionStatus,
      errorCode: permissionStatus === "denied" ? "permission_denied" : "no_camera",
      message: permissionStatus === "denied" ? "Camera permission was denied." : "Camera is unavailable right now.",
    };
  }
}

export function stopCameraStream(stream: MediaStream | null): void {
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
}

export function createCameraVerificationState(status: CameraVerificationState["status"] = "not_started"): CameraVerificationState {
  return {
    status,
    permissionStatus: "unknown",
    message: "Camera verification is not active yet.",
  };
}
