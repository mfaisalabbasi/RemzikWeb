import WalletSummary from "../components/wallet/WalletSummary";
import WalletActions from "../components/wallet/WalletActions";
import TransactionHistory from "../components/wallet/TransactionHistory";

export default function WalletPage() {
  return (
    <main>
      <h1 style={{ textAlign: "center", margin: "32px 0", color: "#111827" }}>
        My Wallet
      </h1>
      <WalletSummary />
      <WalletActions />
      <TransactionHistory />
    </main>
  );
}
