"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ShieldAlert, Database } from "lucide-react";

export default function TransactionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/explorer/transaction/${id}`,
      {
        credentials: "include",
      },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Transaction record not found");
        return res.json();
      })
      .then((data) => {
        setDetail(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="text-emerald-600 font-medium underline"
        >
          Return to Explorer
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen text-slate-800">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Explorer
        </button>

        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Forensic Analysis
          </h1>
          <p className="text-slate-500 font-mono mt-2 break-all">{id}</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Intent (Audit Logs) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <ShieldAlert className="text-slate-400" size={20} />
              <h2 className="font-bold text-slate-900">Admin Intent (Audit)</h2>
            </div>
            <pre className="text-xs bg-slate-50 p-4 rounded-xl border border-slate-100 overflow-x-auto text-slate-700">
              {detail?.audit
                ? JSON.stringify(detail.audit, null, 2)
                : "No audit trail found for this ID."}
            </pre>
          </div>

          {/* Truth (Blockchain) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <Database className="text-emerald-600" size={20} />
              <h2 className="font-bold text-slate-900">On-Chain Reality</h2>
            </div>
            <pre className="text-xs bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 overflow-x-auto text-emerald-900">
              {detail?.event
                ? JSON.stringify(detail.event, null, 2)
                : "No on-chain event found."}
            </pre>
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="mt-6 p-6 bg-white rounded-2xl shadow-sm border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">
              Timestamp
            </p>
            <p className="text-sm font-medium">
              {new Date(
                detail?.event?.createdAt || detail?.audit?.createdAt,
              ).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">
              Network Status
            </p>
            <p className="text-sm font-medium text-emerald-600">Verified</p>
          </div>
        </div>
      </div>
    </div>
  );
}
