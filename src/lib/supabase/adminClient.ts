import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-only. Never import this from a Client Component.
export function getAdminSupabaseClient() {
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export const DISH_PHOTOS_BUCKET = "dish-photos";
