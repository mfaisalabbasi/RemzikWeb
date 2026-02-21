import Link from "next/link";
import styles from "../styles/Auth.module.css";

export default function LoginForm() {
  return (
    <section className={styles.authCard}>
      <div className={styles.header}>
        <h1>Welcome Back</h1>
        <p>Authenticate to continue to Remzik Protocol</p>
      </div>

      <form className={styles.form}>
        <label className={styles.field}>
          Email Address
          <input
            type="email"
            placeholder="name@email.com"
            className={styles.fieldInput}
          />
        </label>

        <label className={styles.field}>
          Password
          <input
            type="password"
            placeholder="Enter password"
            className={styles.fieldInput}
          />
        </label>

        <button className={styles.primary}>Login</button>

        <p className={styles.note}>
          Don’t have an account?
          <Link href="/auth/signup" className={styles.link}>
            Create Account
          </Link>
        </p>
      </form>
    </section>
  );
}
