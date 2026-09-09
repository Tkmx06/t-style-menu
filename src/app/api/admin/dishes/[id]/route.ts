import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseClient, DISH_PHOTOS_BUCKET } from "@/lib/supabase/adminClient";

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

// 2026-09-09: 過去のメニュー(アーカイブ)画面に「完全に削除する」ボタンを追加するための
// エンドポイント。archiveは status を "archived" にするだけの論理削除(復元可能)ですが、
// こちらはSupabaseの行と、紐づく写真(Storage)を完全に削除する不可逆な操作です。
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<"/api/admin/dishes/[id]">,
) {
  const { id } = await params;
  const supabase = getAdminSupabaseClient();

  const { data: existing, error: fetchError } = await supabase
    .from("dishes")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "料理が見つかりません。" }, { status: 404 });
  }

  const { error: deleteError } = await supabase.from("dishes").delete().eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const path = existing.image_url?.split(`/${DISH_PHOTOS_BUCKET}/`)[1];
  if (path) {
    await supabase.storage.from(DISH_PHOTOS_BUCKET).remove([path]);
  }

  return NextResponse.json({ ok: true });
}
