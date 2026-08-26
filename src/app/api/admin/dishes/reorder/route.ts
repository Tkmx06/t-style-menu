import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/adminClient";

export async function POST(request: NextRequest) {
  const { id, direction } = await request.json();

  if (typeof id !== "string" || (direction !== "up" && direction !== "down")) {
    return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
  }

  const supabase = getAdminSupabaseClient();

  const { data: current, error: currentError } = await supabase
    .from("dishes")
    .select("*")
    .eq("id", id)
    .single();

  if (currentError || !current) {
    return NextResponse.json({ error: "料理が見つかりません。" }, { status: 404 });
  }

  const neighborQuery = supabase
    .from("dishes")
    .select("*")
    .eq("category", current.category)
    .eq("status", "published");

  const { data: neighbors } = await (direction === "up"
    ? neighborQuery
        .lt("sort_order", current.sort_order)
        .order("sort_order", { ascending: false })
        .limit(1)
    : neighborQuery
        .gt("sort_order", current.sort_order)
        .order("sort_order", { ascending: true })
        .limit(1));

  const neighbor = neighbors?.[0];
  if (!neighbor) {
    return NextResponse.json({ dish: current });
  }

  await supabase.from("dishes").update({ sort_order: neighbor.sort_order }).eq("id", current.id);
  await supabase.from("dishes").update({ sort_order: current.sort_order }).eq("id", neighbor.id);

  return NextResponse.json({ ok: true });
}
