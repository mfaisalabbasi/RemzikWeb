import LoginForm from "@/app/components/auth/InvestorLogin";
export default function LoginPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const role = searchParams.role || "investor"; // default to investor
  return (
    <main>
      <h1 style={{ textAlign: "center", margin: "32px 0", color: "#0f5f3a" }}>
        {role === "partner" ? "Partner Login" : "Investor Login"}
      </h1>
      <LoginForm role={role} />
    </main>
  );
}
