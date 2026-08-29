import { notFound } from "next/navigation";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { getPublicSupabaseClient } from "@/lib/supabase/publicClient";
import type { Dish } from "@/lib/dish";
import { DishCard } from "@/components/DishCard";
import { HeroBanner } from "@/components/HeroBanner";

export const dynamic = "force-dynamic";

export default async function CategoryPage(
  props: PageProps<"/menu/[category]">,
) {
  const { category } = await props.params;

  if (!CATEGORIES.some((c) => c.slug === category)) {
    notFound();
  }

  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("category", category)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const dishes = (data ?? []) as Dish[];

  return (
    <div>
      {category === CATEGORIES[0].slug && <HeroBanner />}
      <h1 className="font-script mb-8 text-center text-5xl text-neutral-800">
        {categoryLabel(category)}
      </h1>
      {dishes.length === 0 ? (
        <p className="text-neutral-500">まだ料理が登録されていません。</p>
      ) : (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}
