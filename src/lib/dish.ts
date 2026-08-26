export type DishStatus = "published" | "archived";

export type Dish = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  image_url: string;
  sort_order: number;
  status: DishStatus;
  created_at: string;
};
