import PortfolioSummary from "../components/portfolio/PortfolioSummary";
import InvestmentList from "../components/portfolio/InvestmentList";
export default function PortfolioPage() {
  return (
    <main>
      <h1 style={{ textAlign: "center", margin: "32px 0", color: "#111827" }}>
        My Portfolio
      </h1>
      <PortfolioSummary />
      <InvestmentList />
    </main>
  );
}
