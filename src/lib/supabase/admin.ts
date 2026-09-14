import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/lib/env";

export function createSupabaseAdminClient() {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = serverEnv.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) return null;
  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
