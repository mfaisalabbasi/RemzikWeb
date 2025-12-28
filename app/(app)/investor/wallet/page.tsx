import WalletSummary from "../components/wallet/WalletSummary";
import WalletActions from "../components/wallet/WalletActions";
import TransactionHistory from "../components/wallet/TransactionHistory";

export default function WalletPage() {
  return (
    <main>
      <WalletSummary />
      <WalletActions />
      <TransactionHistory />
    </main>
  );
}
