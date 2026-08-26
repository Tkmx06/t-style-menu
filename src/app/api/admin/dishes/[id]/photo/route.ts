import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseClient, DISH_PHOTOS_BUCKET } from "@/lib/supabase/adminClient";

export async function POST(
  request: NextRequest,
  { params }: RouteContext<"/api/admin/dishes/[id]/photo">,
) {
  const { id } = await params;
  const formData = await request.formData();
  const photo = formData.get("photo");

  if (!(photo instanceof File) || photo.size === 0) {
    return NextResponse.json({ error: "写真を選択してください。" }, { status: 400 });
  }

  const supabase = getAdminSupabaseClient();

  const { data: existing, error: fetchError } = await supabase
    .from("dishes")
    .select("category, image_url")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "料理が見つかりません。" }, { status: 404 });
  }

  const extension = photo.name.split(".").pop() || "jpg";
  const path = `${existing.category}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(DISH_PHOTOS_BUCKET)
    .upload(path, photo, { contentType: photo.type || "image/jpeg" });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from(DISH_PHOTOS_BUCKET)
    .getPublicUrl(path);

  const { data: updated, error: updateError } = await supabase
    .from("dishes")
    .update({ image_url: publicUrlData.publicUrl })
    .eq("id", id)
    .select("*")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const oldPath = existing.image_url.split(`/${DISH_PHOTOS_BUCKET}/`)[1];
  if (oldPath) {
    await supabase.storage.from(DISH_PHOTOS_BUCKET).remove([oldPath]);
  }

  return NextResponse.json({ dish: updated });
}
