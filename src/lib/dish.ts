export type DishStatus = "published" | "archived";

export type Dish = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  image_url: string;
  sort_order: number;
  status: DishStatus;
  focal_x: number;
  focal_y: number;
  zoom: number;
  created_at: string;
};
