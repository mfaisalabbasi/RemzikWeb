"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/app/(public)/styles/HeroSlider.module.css";
import GetStartedCTA from "./GetStarted";
import { ShieldCheck } from "lucide-react";

const slides = [
  {
    title: "Invest in Prime Real Estate",
    highlight: "Real Estate",
    subtitle:
      "Shariah-compliant digital ownership backed by audited physical assets.",
    image: "/slider/real-estate.jpg",
    badge: "Shariah-Compliant Tokenization",
  },
  {
    title: "Tokenized Institutional Assets",
    highlight: "Institutional Assets",
    subtitle:
      "Real yield, transparent smart contracts, and fractionized liquidity.",
    image: "/slider/global-assets.jpg",
    badge: "Audited Real-World Assets (RWA)",
  },
  {
    title: "Secure & Compliant Vaults",
    highlight: "Compliant Vaults",
    subtitle:
      "Built for long-term institutional and retail investors across KSA.",
    image: "/slider/secure.jpg",
    badge: "Institutional Security Grade",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToSlide = (idx: number) => {
    if (idx === current) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section className={styles.hero}>
      {/* Background Images Layer */}
      <div className={styles.slider}>
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`${styles.slideWrapper} ${
              idx === current ? styles.activeSlide : ""
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={idx === 0}
              className={styles.image}
            />
          </div>
        ))}
        {/* Balanced neutral dark overlay so background images pop */}
        <div className={styles.overlay} />
      </div>

      {/* Main Hero Content */}
      <div
        className={`${styles.content} ${isTransitioning ? styles.contentFadeOut : styles.contentFadeIn}`}
      >
        <div className={styles.badge}>
          <span className={styles.pulseDot} />
          <ShieldCheck size={14} color="#34d399" />
          <span>{slides[current].badge}</span>
        </div>

        <h1 className={styles.title}>
          {slides[current].title.split(slides[current].highlight)[0]}
          <span className={styles.accentText}>{slides[current].highlight}</span>
          {slides[current].title.split(slides[current].highlight)[1]}
        </h1>

        <p className={styles.subtitle}>{slides[current].subtitle}</p>

        <div className={styles.ctaWrapper}>
          <GetStartedCTA />
        </div>
      </div>

      {/* Institutional Progress Indicators */}
      <div className={styles.dots}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`${styles.dotContainer} ${current === idx ? styles.activeDotContainer : ""}`}
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span className={styles.dotBar}>
              {current === idx && <span className={styles.progressBarFill} />}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
