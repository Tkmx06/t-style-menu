import { redirect } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

export default function AdminHome() {
  redirect(`/admin/${CATEGORIES[0].slug}`);
}
