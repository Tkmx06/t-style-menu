export type Category = {
  slug: string;
  label: string;
};

export const CATEGORIES: Category[] = [
  { slug: "empfehlung", label: "Unsere Empfehlung" },
  { slug: "warme-gerichte", label: "Warme Gerichte" },
  { slug: "kalte-gerichte", label: "Kalte Gerichte" },
  { slug: "salate", label: "Salate" },
  { slug: "fleischspeisen", label: "Fleischspeisen" },
  { slug: "tempura", label: "Tempura" },
  { slug: "fischspeisen", label: "Fischspeisen" },
  { slug: "reisgerichte", label: "Reisgerichte" },
  { slug: "sushi-sashimi", label: "Sushi und Sashimi" },
  { slug: "nudeln", label: "Nudeln" },
  { slug: "dessert", label: "Dessert" },
];

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
