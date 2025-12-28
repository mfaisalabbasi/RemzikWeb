import styles from "@/app/(app)/partner/styles/ProfileInfo.module.css";

export default function ProfileInfo() {
  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>Partner Information</h2>
      <p>
        <strong>Name:</strong> John Doe
      </p>
      <p>
        <strong>Email:</strong> john@example.com
      </p>
      <p>
        <strong>Phone:</strong> +123456789
      </p>
    </div>
  );
}
