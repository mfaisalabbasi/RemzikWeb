import SignupForm from "@/app/components/auth/PartnerSignup";
export default function SignupPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const role = searchParams.role || "investor";
  return (
    <main>
      <h1 style={{ textAlign: "center", margin: "32px 0", color: "#0f5f3a" }}>
        {role === "partner" ? "Partner Signup" : "Investor Signup"}
      </h1>
      <SignupForm role={role} />
    </main>
  );
}
