import Link from "next/link";
import styles from "../styles/Auth.module.css";

export default function SignupForm() {
  return (
    <section className={styles.authCard}>
      <div className={styles.header}>
        <h1>Create Account</h1>
        <p>Secure access to the Remzik Protocol platform</p>
      </div>

      <div className={styles.formWrapper}>
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
            Phone Number
            <input
              type="tel"
              placeholder="+966..."
              className={styles.fieldInput}
            />
          </label>

          <label className={styles.field}>
            Email Address
            <input
              type="email"
              placeholder="john@email.com"
              className={styles.fieldInput}
            />
          </label>

          <label className={styles.field}>
            Password
            <input
              type="password"
              placeholder="Create password"
              className={styles.fieldInput}
            />
          </label>

          <label className={styles.field}>
            Confirm Password
            <input
              type="password"
              placeholder="Confirm password"
              className={styles.fieldInput}
            />
          </label>

          <button className={styles.primary}>Create Account</button>

          <p className={styles.note}>
            Already registered?
            <Link href="/auth/login" className={styles.link}>
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
