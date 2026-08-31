import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/adminClient";

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext<"/api/admin/dishes/[id]">,
) {
  const { id } = await params;
  const body = await request.json();

  const update: Record<string, string | number | null> = {};
  if (typeof body.name === "string") {
    if (body.name.trim() === "") {
      return NextResponse.json({ error: "料理名は空にできません。" }, { status: 400 });
    }
    update.name = body.name.trim();
  }
  if (typeof body.description === "string") {
    update.description = body.description.trim() === "" ? null : body.description.trim();
  }
  if (typeof body.focal_x === "number") {
    update.focal_x = Math.min(1, Math.max(0, body.focal_x));
  }
  if (typeof body.focal_y === "number") {
    update.focal_y = Math.min(1, Math.max(0, body.focal_y));
  }
  if (typeof body.zoom === "number") {
    update.zoom = Math.min(3, Math.max(1, body.zoom));
  }
  if (typeof body.rotation === "number") {
    update.rotation = Math.min(45, Math.max(-45, body.rotation));
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "更新内容がありません。" }, { status: 400 });
  }

  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase
    .from("dishes")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dish: data });
}
