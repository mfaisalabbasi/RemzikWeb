import Link from "next/link";
import styles from "./partner.module.css";

export const PartnerGrid = ({ partners, loading }: any) => {
  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading Partners...
      </div>
    );

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Partner</th>
            <th>Email</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner: any) => (
            <tr key={partner.id}>
              <td>
                <strong>{partner.companyName || "N/A"}</strong>
              </td>
              <td>{partner.user?.email}</td>
              <td>
                <span
                  className={
                    partner.status === "APPROVED"
                      ? styles.pillApproved
                      : styles.pillPending
                  }
                >
                  {partner.status}
                </span>
              </td>
              <td style={{ textAlign: "right" }}>
                <Link
                  href={`/admin/partner/${partner.id}`}
                  style={{ color: "#2563eb", fontWeight: 600 }}
                >
                  Manage
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
