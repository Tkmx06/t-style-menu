import Image from "next/image";

export function HeroBanner() {
  return (
    <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-lg sm:aspect-[21/9]">
      <Image
        src="/hero-banner.jpg"
        alt="t-style Gerichte"
        fill
        sizes="(max-width: 1024px) 100vw, 1024px"
        priority
        className="object-cover"
      />
    </div>
  );
}
