"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  status: boolean;
  imageUrl: string;
};

export function BannerImage({
  dataBanners,
  preview,
}: {
  dataBanners: Banner[];
  preview?: boolean;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  const totalBanners = dataBanners.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % dataBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + dataBanners.length) % dataBanners.length
    );
  };

  useEffect(() => {
    // Hentikan autoplay jika hanya ada 1 banner
    if (totalBanners <= 1) {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
      return;
    }

    slideInterval.current = setInterval(nextSlide, 5000);

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalBanners]);

  if (totalBanners <= 1)
    return (
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 overflow-hidden @container">
        <div className="w-full overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            // style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {dataBanners.map((banner, index) => (
              <div
                className={`flex-shrink-0 w-full relative overflow-hidden ${
                  preview ? "h-80" : "h-80 md:h-120"
                }`}
                key={index}
              >
                {/* <div className="overflow-hidden w-full h-80 relative"> */}
                <Image
                  unoptimized={true}
                  width={100}
                  height={100}
                  src={banner?.imageUrl ?? "https://placehold.co/1200x400"}
                  alt="Banner"
                  className="object-cover w-full "
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black via-transparent to-transparent text-white">
                  <h1 className="text-xl sm:text-2xl font-bold mb-2">
                    {banner?.title ?? "TITLE"}
                  </h1>
                  <p className="max-w-lg text-sm sm:text-base mb-4">
                    {banner?.subtitle ?? "SUBTITLE"}
                  </p>
                  <Link
                    href={`/${banner.link}`}
                    className="bg-white text-black text-sm font-medium px-4 py-2 rounded-full w-fit hover:bg-gray-100 transition"
                  >
                    Beli Sekarang
                  </Link>
                </div>
                {/* </div> */}
              </div>
            ))}
          </div>
        </div>

        {/* Tombol navigasi */}
        {/* {dataBanners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:py-4 rounded-full cursor-pointer z-10"
            >
              &lt;
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:py-4 rounded-full cursor-pointer z-10"
            >
              &gt;
            </button>
          </>
        )}
  
        {totalBanners > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2">
            {dataBanners.map((_, index) => (
              <span
                key={index}
                className={`rounded-full cursor-pointer transition-colors duration-300 ${
                  index === currentSlide
                    ? "bg-white w-3 h-3"
                    : "bg-white bg-opacity-50 w-2 h-2"
                }`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        )} */}
      </section>
    );

  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 overflow-hidden @container">
      <div className="w-full overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {dataBanners.map((banner, index) => (
            <div
              className={`flex-shrink-0 w-full relative overflow-hidden ${
                preview ? "h-80" : "h-80 md:h-120"
              }`}
              key={index}
            >
              {/* <div className="overflow-hidden w-full h-80 relative"> */}
              <Image
                unoptimized={true}
                width={100}
                height={100}
                src={banner?.imageUrl ?? "https://placehold.co/1200x400"}
                alt="Banner"
                className="object-cover w-full "
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black via-transparent to-transparent text-white">
                <h1 className="text-xl sm:text-2xl font-bold mb-2">
                  {banner?.title ?? "TITLE"}
                </h1>
                <p className="max-w-lg text-sm sm:text-base mb-4">
                  {banner?.subtitle ?? "SUBTITLE"}
                </p>
                <Link
                  href={`/${banner.link}`}
                  className="bg-white text-black text-sm font-medium px-4 py-2 rounded-full w-fit hover:bg-gray-100 transition"
                >
                  Beli Sekarang
                </Link>
              </div>
              {/* </div> */}
            </div>
          ))}
        </div>
      </div>

      {/* Tombol navigasi */}
      {dataBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:py-4 rounded-full cursor-pointer z-10"
          >
            &lt;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:py-4 rounded-full cursor-pointer z-10"
          >
            &gt;
          </button>
        </>
      )}

      {totalBanners > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2">
          {dataBanners.map((_, index) => (
            <span
              key={index}
              className={`rounded-full cursor-pointer transition-colors duration-300 ${
                index === currentSlide
                  ? "bg-white w-3 h-3"
                  : "bg-white bg-opacity-50 w-2 h-2"
              }`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      )}
    </section>
  );
}
