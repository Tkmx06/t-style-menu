import { redirect } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

export default function Home() {
  redirect(`/menu/${CATEGORIES[0].slug}`);
}
