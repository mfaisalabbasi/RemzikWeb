import styles from "./Auth.module.css";

export default function SignupForm({ role }: { role: string }) {
  return (
    <section className={styles.authCard}>
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
          Password
          <input
            type="password"
            placeholder="Create a password"
            className={styles.fieldInput}
          />
        </label>

        <button className={styles.primary}>Sign Up</button>
        <p className={styles.note}>
          Already have an account?
          <a href={`/auth/login?role=${role}`} className={styles.link}>
            {" "}
            Login
          </a>
        </p>
      </form>
    </section>
  );
}
