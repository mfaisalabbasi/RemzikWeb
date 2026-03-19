"use client";

import { useEffect, useState } from "react";
import styles from "./styles/Documents.module.css";
import DocumentsFilter from "./DocumentsFilter";
import DocumentCard from "./DocumentCard";
import DocumentDetailDrawer from "./DocumentDetailDrawer";
import { getPartnerDocuments } from "@/app/integrations/api/asset";
export default function PartnerDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await getPartnerDocuments();
        setDocuments(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocs();
  }, []);

  const filteredDocs = documents.filter(
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
        {filteredDocs.map((doc) => (
          <DocumentCard
            key={doc.id}
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
