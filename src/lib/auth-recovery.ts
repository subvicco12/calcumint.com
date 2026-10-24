import {PASSWORD_RESET_COMPLETE_NOTICE} from "./password-recovery";
import { isAuthApiError, isAuthRetryableFetchError, isAuthSessionMissingError } from "@supabase/supabase-js";

export const AUTH_TEMPORARILY_UNAVAILABLE = "Authentication is temporarily unavailable. Try again.";
export const AUTH_CONFIRMATION_NOTICE = "Check your email to confirm your account.";
const GENERIC_AUTH_FAILURE = "Authentication could not finish. Try again.";
const terminalCodes = new Set(["session_not_found", "session_expired", "refresh_token_not_found", "refresh_token_already_used"]);

export function requiresSignIn(error: unknown): boolean {
  return isAuthSessionMissingError(error) || (isAuthApiError(error) && terminalCodes.has(error.code ?? ""));
}

export function authFailureMessage(error: unknown, operation: "signin" | "signup" | "oauth"): string {
  if (isAuthRetryableFetchError(error)) return AUTH_TEMPORARILY_UNAVAILABLE;
  if (isAuthApiError(error)) {
    if (error.code === "over_request_rate_limit" || error.code === "over_email_send_rate_limit") return "Too many attempts. Wait a moment and try again.";
    if (operation === "signin" && error.code === "invalid_credentials") return "Invalid credentials";
    if (operation === "signin" && error.code === "email_not_confirmed") return "Confirm your email before signing in.";
  }
  return operation === "signin" ? "Sign-in could not finish. Try again." : operation === "signup" ? "Account creation could not finish. Try again." : "Google sign-in could not start. Try again.";
}

// Only application-owned notices may enter the page; never echo provider/query text.
const allowedErrors = new Set([
  GENERIC_AUTH_FAILURE, AUTH_TEMPORARILY_UNAVAILABLE,
  "Authentication is not configured.", "Authentication is not configured yet.",
  "Email and password are required.", "Use a valid email and a password of at least 8 characters.",
  "Could not sign out. Try again.", "Authentication callback failed.",
  "Invalid credentials", "Confirm your email before signing in.",
  "Too many attempts. Wait a moment and try again.",
  "Sign-in could not finish. Try again.", "Account creation could not finish. Try again.", "Google sign-in could not start. Try again."
]);
export function safeAuthErrorNotice(value: unknown): string | undefined {
  if (typeof value !== "string" || !value) return undefined;
  return allowedErrors.has(value) ? value : GENERIC_AUTH_FAILURE;
}
export function safeAuthConfirmationNotice(value: unknown): string | undefined {
  return value === AUTH_CONFIRMATION_NOTICE || value === PASSWORD_RESET_COMPLETE_NOTICE ? value : undefined;
}
