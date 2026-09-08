import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/supabase/adminClient";

// site_content(id="main")の1行に、サイト全体の設定をまとめて持たせています。
// 今のところ扱うのはホーム画面のInstagram埋め込み投稿IDのみです。
export async function GET() {
  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("instagram_post_ids")
    .eq("id", "main")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ instagramPostIds: data.instagram_post_ids ?? [] });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const ids = body.instagramPostIds;

  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string")) {
    return NextResponse.json({ error: "投稿IDの形式が不正です。" }, { status: 400 });
  }

  const cleaned = ids.map((id) => id.trim()).filter((id) => id !== "");

  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase
    .from("site_content")
    .update({ instagram_post_ids: cleaned })
    .eq("id", "main")
    .select("instagram_post_ids")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ instagramPostIds: data.instagram_post_ids });
}
