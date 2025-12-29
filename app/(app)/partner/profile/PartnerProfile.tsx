"use client";

import styles from "./styles/PartnerProfile.module.css";

export default function PartnerProfile() {
  const partner = {
    name: "ABC Company",
    email: "partner@abc.com",
    phone: "+966 5XXXXXXXX",
    address: "Riyadh, Saudi Arabia",
  };

  return (
    <div className={styles.profile}>
      <h2 className={styles.heading}>Partner Profile</h2>
      <div className={styles.info}>
        <div className={styles.field}>
          <span className={styles.label}>Name</span>
          <span className={styles.value}>{partner.name}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Email</span>
          <span className={styles.value}>{partner.email}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Phone</span>
          <span className={styles.value}>{partner.phone}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Address</span>
          <span className={styles.value}>{partner.address}</span>
        </div>
      </div>
      <button className={styles.edit}>Edit Profile</button>
    </div>
  );
}
