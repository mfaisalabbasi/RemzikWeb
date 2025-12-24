"use client";

import { useState, useEffect } from "react";
import GetStartedCTA from "./GetStarted";
import Image from "next/image";
import styles from "@/app/styles/HeroSlider.module.css";

const slides = [
  {
    title: "Invest in Real Estate",
    subtitle: "Shariah-compliant ownership",
    image: "/slider/real-estate.jpg",
  },
  {
    title: "Global Assets",
    subtitle: "Tokenized real-world properties",
    image: "/slider/global-assets.jpg",
  },
  {
    title: "Transparent & Secure",
    subtitle: "Full audit and protection",
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
      <div className={styles.imageContainer}>
        <Image
          src={slides[current].image}
          alt={slides[current].title}
          fill
          className={styles.image}
        />
      </div>

      <h1 className={styles.title}>{slides[current].title}</h1>
      <p className={styles.subtitle}>{slides[current].subtitle}</p>
      <GetStartedCTA />

      <div className={styles.dots}>
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`${styles.dot} ${current === idx ? styles.active : ""}`}
          ></span>
        ))}
      </div>
    </section>
  );
}
