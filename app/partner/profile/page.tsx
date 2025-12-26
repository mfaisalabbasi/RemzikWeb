import ProfileInfo from "../components/Profile/ProfileInfo";
import KYCStatus from "../components/Profile/KYCStatus";
import ProfileSettings from "../components/Profile/ProfileSettings";

export default function PartnerProfilePage() {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <ProfileInfo />
      <KYCStatus />
      <ProfileSettings />
    </section>
  );
}
