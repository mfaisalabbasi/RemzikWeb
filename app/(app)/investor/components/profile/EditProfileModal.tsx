"use client";

import { useState } from "react";
import styles from "./Profile.module.css";

interface EditProfileModalProps {
  name: string;
  email: string;
  onClose: () => void;
  onSave: (updated: { name: string; email: string }) => void;
}

export default function EditProfileModal({
  name: initialName,
  email: initialEmail,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Edit Profile</h2>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className={styles.modalActions}>
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => {
              onSave({ name, email });
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
