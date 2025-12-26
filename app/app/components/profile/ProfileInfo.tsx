import styles from "./Profile.module.css";

export default function ProfileInfo() {
  return (
    <section className={styles.section}>
      <h2>Personal Information</h2>
      <form className={styles.form}>
        <label className={styles.field}>
          Full Name
          <input
            type="text"
            placeholder="John Doe"
            className={styles.fieldInput}
          />
        </label>
        <label className={styles.field}>
          Email
          <input
            type="email"
            placeholder="john@example.com"
            className={styles.fieldInput}
          />
        </label>
        <label className={styles.field}>
          Phone Number
          <input
            type="tel"
            placeholder="+966 5XXXXXXXX"
            className={styles.fieldInput}
          />
        </label>
        <button className={styles.primary}>Update Info</button>
      </form>
    </section>
  );
}
