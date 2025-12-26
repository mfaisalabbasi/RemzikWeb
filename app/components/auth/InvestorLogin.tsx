import styles from "./Auth.module.css";

export default function LoginForm({ role }: { role: string }) {
  return (
    <section className={styles.authCard}>
      <form className={styles.form}>
        <label className={styles.field}>
          Email
          <input
            type="email"
            placeholder="Enter your email"
            className={styles.fieldInput}
          />
        </label>

        <label className={styles.field}>
          Password
          <input
            type="password"
            placeholder="Enter your password"
            className={styles.fieldInput}
          />
        </label>

        <button className={styles.primary}>Login</button>
        <p className={styles.note}>
          New to {role === "partner" ? "Partner" : "Investor"}?
          <a href={`/auth/signup?role=${role}`} className={styles.link}>
            {" "}
            Sign Up
          </a>
        </p>
      </form>
    </section>
  );
}
