"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  alt: string;
}

export default function ProductImageCarousel({ images, alt }: Props) {
  const [current, setCurrent] = useState(0);

  // Deduplicate and filter empty strings
  const slides = images.filter(Boolean);

  if (slides.length === 0) return null;

  if (slides.length === 1) {
    return (
      <div className="product-detail-image-wrapper">
        <Image
          src={slides[0]}
          alt={alt}
          width={600}
          height={450}
          className="product-detail-image"
        />
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  return (
    <div className="img-carousel-wrapper">
      {/* Main slide */}
      <div className="img-carousel-stage">
        {slides.map((src, i) => (
          <div
            key={i}
            className={`img-carousel-slide${i === current ? " active" : ""}`}
            aria-hidden={i !== current}
          >
            <Image
              src={src}
              alt={`${alt} — imagem ${i + 1}`}
              width={600}
              height={450}
              className="product-detail-image"
              style={{ display: i === current ? "block" : "none" }}
            />
          </div>
        ))}

        {/* Arrows */}
        <button
          className="img-carousel-arrow left"
          onClick={prev}
          aria-label="Imagem anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="img-carousel-arrow right"
          onClick={next}
          aria-label="Próxima imagem"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="img-carousel-thumbs">
        {slides.map((src, i) => (
          <button
            key={i}
            className={`img-carousel-thumb${i === current ? " active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Ir para imagem ${i + 1}`}
          >
            <Image
              src={src}
              alt={`Miniatura ${i + 1}`}
              width={64}
              height={48}
              style={{ objectFit: "cover", borderRadius: 6, width: "100%", height: "100%" }}
            />
          </button>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="img-carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`img-carousel-dot${i === current ? " active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Imagem ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
