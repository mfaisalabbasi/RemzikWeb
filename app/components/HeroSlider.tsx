"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import GetStartedCTA from "@/app/components/GetStarted";
import styles from "@/app/styles/HeroSlider.module.css";

const slides = [
  {
    title: "Invest in Real Estate",
    subtitle: "Shariah-compliant digital ownership",
    image: "/slider/real-estate.jpg",
  },
  {
    title: "Tokenized Global Assets",
    subtitle: "Real value. Transparent structure.",
    image: "/slider/global-assets.jpg",
  },
  {
    title: "Secure & Trusted Platform",
    subtitle: "Built for long-term investors",
    image: "/slider/secure.jpg",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Slider Image */}
      <div className={styles.slider}>
        <Image
          src={slides[current].image}
          alt={slides[current].title}
          fill
          priority
          className={styles.image}
        />
        <div className={styles.overlay} />
      </div>

      {/* Content Overlay */}
      <div className={styles.content}>
        <h1 className={styles.title}>{slides[current].title}</h1>
        <p className={styles.subtitle}>{slides[current].subtitle}</p>
        <GetStartedCTA />
      </div>

      {/* Dots */}
      <div className={styles.dots}>
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`${styles.dot} ${current === idx ? styles.active : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
