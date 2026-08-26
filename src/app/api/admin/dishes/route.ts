import { NextRequest, NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/categories";
import { getAdminSupabaseClient, DISH_PHOTOS_BUCKET } from "@/lib/supabase/adminClient";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  if (!category || !CATEGORIES.some((c) => c.slug === category)) {
    return NextResponse.json({ error: "カテゴリが不正です。" }, { status: 400 });
  }

  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("category", category)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ dishes: data });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const category = formData.get("category");
  const name = formData.get("name");
  const description = formData.get("description");
  const photo = formData.get("photo");

  if (
    typeof category !== "string" ||
    !CATEGORIES.some((c) => c.slug === category)
  ) {
    return NextResponse.json({ error: "カテゴリが不正です。" }, { status: 400 });
  }
  if (typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "料理名を入力してください。" }, { status: 400 });
  }
  if (!(photo instanceof File) || photo.size === 0) {
    return NextResponse.json({ error: "写真を選択してください。" }, { status: 400 });
  }

  const supabase = getAdminSupabaseClient();

  const { data: maxRow } = await supabase
    .from("dishes")
    .select("sort_order")
    .eq("category", category)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? 0) + 1;

  const extension = photo.name.split(".").pop() || "jpg";
  const path = `${category}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(DISH_PHOTOS_BUCKET)
    .upload(path, photo, {
      contentType: photo.type || "image/jpeg",
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from(DISH_PHOTOS_BUCKET)
    .getPublicUrl(path);

  const { data: inserted, error: insertError } = await supabase
    .from("dishes")
    .insert({
      category,
      name: name.trim(),
      description:
        typeof description === "string" && description.trim() !== ""
          ? description.trim()
          : null,
      image_url: publicUrlData.publicUrl,
      sort_order: nextSortOrder,
      status: "published",
    })
    .select("*")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ dish: inserted });
}
