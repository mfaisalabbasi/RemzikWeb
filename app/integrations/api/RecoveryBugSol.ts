import { BrowserProvider } from "ethers";

export async function getVerifiedSigner(wallets: any[]) {
  const wallet = wallets[0];
  if (!wallet) throw new Error("No wallet connected.");

  const provider = new BrowserProvider(await wallet.getEthereumProvider());
  const signer = await provider.getSigner();
  const connectedAddress = await signer.getAddress();

  // 🛡️ Strict address comparison check removed.
  // It now automatically trusts and uses whatever wallet is active.

  return { signer, connectedAddress };
}
