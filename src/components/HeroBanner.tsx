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
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="flex w-full max-w-md items-center justify-center rounded-md bg-white/90 px-6 py-6 shadow-lg sm:max-w-lg">
          <Image
            src="/logo.png"
            alt="t-style Japanisches Bistro"
            width={1561}
            height={586}
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
