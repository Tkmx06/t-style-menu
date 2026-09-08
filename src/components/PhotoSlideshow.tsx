"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dish } from "@/lib/dish";
import { dishImageStyle } from "@/lib/dishImageStyle";

const INTERVAL_MS = 4000;

export function PhotoSlideshow({ dishes }: { dishes: Dish[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (dishes.length < 2) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % dishes.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [dishes.length]);

  if (dishes.length === 0) {
    return null;
  }

  return (
    <section className="bg-neutral-950">
      <Link
        href="/menu/empfehlung"
        className="group relative block aspect-[4/3] w-full overflow-hidden sm:aspect-[16/7]"
      >
        {dishes.map((dish, i) => (
          <div
            key={dish.id}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden={i === index ? undefined : true}
          >
            <Image
              src={dish.image_url}
              alt={dish.name}
              fill
              sizes="100vw"
              priority={i === 0}
              style={dishImageStyle(dish)}
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10 sm:px-8 sm:pb-6">
              <p className="font-heading text-center text-lg font-light uppercase tracking-[0.15em] text-white sm:text-xl">
                {dish.name}
              </p>
            </div>
          </div>
        ))}

        {dishes.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {dishes.map((dish, i) => (
              <span
                key={dish.id}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </Link>
    </section>
  );
}
