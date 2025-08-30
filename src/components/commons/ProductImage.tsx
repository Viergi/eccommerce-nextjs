"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductImage({
  imageUrl,
  zoomFactor = 1.5,
}: {
  imageUrl: string | null;
  zoomFactor?: number;
}) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  const backgroundPosition = `${position.x}% ${position.y}%`;
  const backgroundSize = `${zoomFactor * 100}% ${zoomFactor * 100}%`;

  return (
    <div
      className="md:w-1/2 relative hover:cursor-zoom-in border rounded-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        unoptimized={true}
        src={imageUrl || "/placeholder-product.jpg"}
        alt="Gambar produk utama"
        width={500}
        height={500}
        className="w-full h-auto max-h-[400px] object-contain rounded-md"
      />
      <div
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition,
          backgroundSize,
        }}
        className={`
          absolute top-0 w-[100%] h-[100%] 
          pointer-events-none transition-opacity duration-300 rounded-md
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
      />
    </div>
  );
}
