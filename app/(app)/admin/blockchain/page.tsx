"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Loader2,
  ShieldCheck,
  ArrowUpRight,
  Inbox,
} from "lucide-react";

export default function BlockchainExplorer() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchExplorerData = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/explorer/unified?query=${query}`;
      const response = await fetch(url, { credentials: "include" });
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExplorerData();
  }, [fetchExplorerData]);

  return (
    // Softer Slate Palette: bg-slate-50
    <div className="p-4 md:p-8 bg-slate-50 text-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <ShieldCheck className="text-emerald-600" /> Blockchain Explorer
          </h1>
          <p className="text-slate-500 mt-1">
            Audit log and on-chain verification feed.
          </p>
        </header>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            className="w-full pl-10 p-3 bg-white shadow-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            placeholder="Search hash or target ID..."
            onChange={(e) => fetchExplorerData(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold uppercase text-slate-500">
                  Status
                </th>
                <th className="p-4 text-xs font-bold uppercase text-slate-500">
                  Method
                </th>
                <th className="p-4 text-xs font-bold uppercase text-slate-500 hidden md:table-cell">
                  ID / Target
                </th>
                <th className="p-4 text-xs font-bold uppercase text-slate-500 hidden sm:table-cell">
                  Date
                </th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center">
                    <Loader2 className="animate-spin mx-auto text-emerald-600" />
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() =>
                      router.push(
                        `/admin/blockchain/${item.txHash || item.targetId}`,
                      )
                    }
                    className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">
                        Confirmed
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      {item.eventName || item.action}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500 hidden md:table-cell">
                      {item.txHash?.slice(0, 10) || item.targetId}
                    </td>
                    <td className="p-4 text-sm text-slate-400 hidden sm:table-cell">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <ArrowUpRight size={18} className="text-slate-300" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
