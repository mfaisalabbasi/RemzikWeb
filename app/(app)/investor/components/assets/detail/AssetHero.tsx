import React from "react";
import styles from "./Details.module.css";

interface AssetHeroProps {
  title: string;
  location: string;
  image: string;
}

export default function AssetHero({ title, location, image }: AssetHeroProps) {
  return (
    <div className={styles.hero} style={{ backgroundImage: `url(${image})` }}>
      <div className={styles.overlay}>
        <h1>{title}</h1>
        <p>{location}</p>
      </div>
    </div>
  );
}
