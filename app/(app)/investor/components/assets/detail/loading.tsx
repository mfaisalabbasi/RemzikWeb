import styles from "./Details.module.css";

export default function Loading() {
  return (
    <div className={styles.page}>
      <div className={styles.skeletonHero} />

      <div className={styles.skeletonBar} />

      <div className={styles.mainGrid}>
        <div className={styles.left}>
          <div className={styles.skeletonBlock} />
        </div>

        <div className={styles.right}>
          <div className={styles.skeletonPanel} />
        </div>
      </div>
    </div>
  );
}
