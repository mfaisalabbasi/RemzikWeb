import ProfileInfo from "../components/profile/ProfileInfo";
import KYCStatus from "../components/profile/KYCStatus";
import SecuritySettings from "../components/profile/SecuritySettings";

export default function ProfilePage() {
  return (
    <main>
      <h1 style={{ textAlign: "center", margin: "32px 0", color: "#111827" }}>
        My Profile
      </h1>
      <ProfileInfo />
      <KYCStatus />
      <SecuritySettings />
    </main>
  );
}
