import InvestmentList from "../components/portfolio/InvestmentList";

export default function PortfolioPage() {
  return (
    <main
      style={{
        padding: "1.5rem 2rem 4rem 2rem",
        maxWidth: "1320px",
        margin: "0 auto",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <InvestmentList />
    </main>
  );
}
