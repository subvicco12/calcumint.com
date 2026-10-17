/** A retry requests fresh identity/entitlement reads; it carries no authority or plan data. */
export const ACCOUNT_RECOVERY_EVENT = 'calcumint:account-recovery';
export function requestAccountRecovery():void {
  window.dispatchEvent(new Event(ACCOUNT_RECOVERY_EVENT));
}
