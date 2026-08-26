import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/adminClient";

export async function POST(
  _request: Request,
  { params }: RouteContext<"/api/admin/dishes/[id]/restore">,
) {
  const { id } = await params;
  const supabase = getAdminSupabaseClient();

  const { data: existing, error: fetchError } = await supabase
    .from("dishes")
    .select("category")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "料理が見つかりません。" }, { status: 404 });
  }

  const { data: maxRow } = await supabase
    .from("dishes")
    .select("sort_order")
    .eq("category", existing.category)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("dishes")
    .update({ status: "published", sort_order: nextSortOrder })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dish: data });
}
