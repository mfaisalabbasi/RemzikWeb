import styles from "../components/profile/profile.module.css";
import { AdminProfile } from "../components/profile/AdminProfile";
import { SecuritySettings } from "../components/profile/SecuritySettings";
export default function ProfilePage() {
  return (
    <main className={styles.assetsPage}>
      <div className={styles.gridContainer}>
        <AdminProfile />

        {/* Security Card - Keep it aligned with the grid */}
        {/* <SecuritySettings /> */}
      </div>
    </main>
  );
}
