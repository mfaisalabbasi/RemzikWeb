"use client";

import { useState } from "react";
import styles from "./styles/Documents.module.css";
import DocumentsFilter from "./DocumentsFilter";
import DocumentCard from "./DocumentCard";
import DocumentDetailDrawer from "./DocumentDetailDrawer";

const mockDocuments = [
  {
    title: "Riyadh Tower Investment Agreement",
    type: "Agreement",
    status: "Pending",
    uploaded: "2026-02-15",
    description: "Agreement for Riyadh Tower residential asset.",
  },
  {
    title: "Jeddah Hub Financial Report",
    type: "Report",
    status: "Approved",
    uploaded: "2026-02-12",
    description: "Quarterly financial report for Jeddah Commercial Hub.",
  },
  {
    title: "Dammam Villas Ownership Certificate",
    type: "Certificate",
    status: "Pending",
    uploaded: "2026-02-10",
    description: "Ownership certificate for Dammam Villas project.",
  },
];

export default function PartnerDocumentsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredDocs = mockDocuments.filter(
    (doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter ? doc.type === typeFilter : true),
  );

  const handleCardClick = (doc: any) => {
    setSelectedDoc(doc);
    setDrawerOpen(true);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>Documents</h2>

      <DocumentsFilter
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
      />

      <div className={styles.documentsGrid}>
        {filteredDocs.map((doc, i) => (
          <DocumentCard
            key={i}
            document={doc}
            onClick={() => handleCardClick(doc)}
          />
        ))}
        {filteredDocs.length === 0 && <p>No documents found.</p>}
      </div>

      <DocumentDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        document={selectedDoc}
      />
    </div>
  );
}
