import ProfileInfo from "../components/profile/ProfileInfo";
import KYCStatus from "../components/profile/KYCStatus";
import SecuritySettings from "../components/profile/SecuritySettings";

export default function ProfilePage() {
  return (
    <main>
      <ProfileInfo />
      <KYCStatus />
      <SecuritySettings />
    </main>
  );
}
