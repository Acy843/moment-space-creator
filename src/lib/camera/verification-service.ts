import { nowIso } from "@/lib/mova-types";
import type { VerificationMethod, VerificationResult, VerificationStatus } from "@/lib/mova-types";

export type VerificationMode = "camera" | "manual" | "distance" | "timed";

export type VerificationFlowState = {
  status: VerificationStatus;
  method: VerificationMethod;
  message: string;
  confidence?: number;
  verifiedAt: string | null;
};

export function buildVerificationResult(
  method: VerificationMethod,
  status: "verified" | "failed",
  message: string,
  confidence?: number,
): VerificationResult {
  const result: VerificationResult = {
    status,
    method,
    verifiedAt: status === "verified" ? nowIso() : null,
    message,
  };
  if (typeof confidence === "number") result.confidence = confidence;
  return result;
}

export function createVerificationFlowState(method: VerificationMethod): VerificationFlowState {
  return {
    status: "not_started",
    method,
    message: method === "camera" ? "Preparing camera verification…" : "Verification queued…",
    verifiedAt: null,
  };
}

export async function runPrototypeCameraVerification(method: VerificationMethod): Promise<VerificationResult> {
  if (method !== "camera") {
    return buildVerificationResult(method, "failed", "This activity does not use camera verification.", 0);
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));

  return buildVerificationResult(
    "camera",
    "verified",
    "Movement detected — verification successful.",
    0.92,
  );
}
