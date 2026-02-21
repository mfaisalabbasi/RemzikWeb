"use client";

import styles from "./styles/ProfileAvatar.module.css";
import { FiUpload } from "react-icons/fi";

interface Props {
  avatar: string | null;
  onChange: (url: string) => void;
}

export default function ProfileAvatar({ avatar, onChange }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onChange(url);
    }
  };

  return (
    <div className={styles.avatarWrapper}>
      <div className={styles.avatar}>
        {avatar ? <img src={avatar} alt="Avatar" /> : <span>Upload</span>}
      </div>
      <label className={styles.uploadBtn}>
        <FiUpload size={18} />
        Change Avatar
        <input type="file" onChange={handleFileChange} hidden />
      </label>
    </div>
  );
}
