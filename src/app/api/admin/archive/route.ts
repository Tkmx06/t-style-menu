import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/adminClient";

export async function GET() {
  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("status", "archived")
    .order("category", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dishes: data });
}
