"use client";

import styles from "./styles/ProfileAvatar.module.css";
import { useRef, useState, useEffect } from "react";
import { uploadAvatar } from "@/app/integrations/api/profile";
import { useAlert } from "@/app/integrations/Alert/AlertContext";
import remzik from "../../../../public/remzik.png";
import { Camera, RefreshCw } from "lucide-react";

export default function ProfileAvatar({ avatar, setProfile }: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { showAlert } = useAlert();

  const isUpdating = useRef(false);
  const [displaySrc, setDisplaySrc] = useState(avatar);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isUpdating.current) {
      setDisplaySrc(avatar);
    }
  }, [avatar]);

  const handleUpload = async (file: File) => {
    try {
      isUpdating.current = true;
      setIsProcessing(true);

      const blobUrl = URL.createObjectURL(file);
      setDisplaySrc(blobUrl);

      const response = await uploadAvatar(file);
      const serverUrl = response?.avatarUrl || avatar;

      setProfile((prev: any) => ({ ...prev, avatar: serverUrl }));

      setTimeout(() => {
        const finalUrlWithBuster = `${serverUrl}${serverUrl.includes("?") ? "&" : "?"}v=${Date.now()}`;
        setDisplaySrc(finalUrlWithBuster);

        setTimeout(() => {
          isUpdating.current = false;
          setIsProcessing(false);
          showAlert("success", "Avatar updated successfully!");
        }, 500);
      }, 2500);
    } catch (err) {
      console.error(err);
      isUpdating.current = false;
      setIsProcessing(false);
      setDisplaySrc(avatar);
      showAlert("error", "Upload failed. Please try again.");
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Corporate Avatar</h3>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatarContainer}>
          <img
            key={displaySrc}
            src={displaySrc || remzik.src}
            alt="Profile"
            className={styles.avatar}
            style={{ opacity: isProcessing ? 0.4 : 1 }}
          />
          {isProcessing && (
            <div className={styles.loaderOverlay}>
              <RefreshCw size={20} className={styles.spinIcon} />
              <span>Processing...</span>
            </div>
          )}
        </div>

        <div className={styles.avatarInfo}>
          <p className={styles.avatarHint}>
            Recommended square image, PNG or JPG under 5MB.
          </p>
          <button
            className={styles.uploadBtn}
            onClick={() => fileRef.current?.click()}
            disabled={isProcessing}
          >
            <Camera size={14} /> Change Avatar
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileRef}
        hidden
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) handleUpload(e.target.files[0]);
        }}
      />
    </div>
  );
}
