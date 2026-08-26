import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/adminClient";

export async function POST(
  _request: Request,
  { params }: RouteContext<"/api/admin/dishes/[id]/archive">,
) {
  const { id } = await params;
  const supabase = getAdminSupabaseClient();

  const { data, error } = await supabase
    .from("dishes")
    .update({ status: "archived" })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dish: data });
}
