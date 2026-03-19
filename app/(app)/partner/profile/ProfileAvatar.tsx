"use client";

import styles from "./styles/ProfileAvatar.module.css";
import { useRef, useState, useEffect } from "react";
import { uploadAvatar } from "@/app/integrations/api/profile";
import { useAlert } from "@/app/integrations/Alert/AlertContext";
import remzik from "../../../../public/remzik.png";

export default function ProfileAvatar({ avatar, setProfile }: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { showAlert } = useAlert();

  // 1. This ref acts as a "Shield".
  // While true, we ignore any 'avatar' props coming from the parent.
  const isUpdating = useRef(false);
  const [displaySrc, setDisplaySrc] = useState(avatar);
  const [isProcessing, setIsProcessing] = useState(false);

  // 2. Only update from parent if we aren't busy uploading
  useEffect(() => {
    if (!isUpdating.current) {
      setDisplaySrc(avatar);
    }
  }, [avatar]);

  const handleUpload = async (file: File) => {
    try {
      isUpdating.current = true;
      setIsProcessing(true);

      // 3. Instant Local Preview
      const blobUrl = URL.createObjectURL(file);
      setDisplaySrc(blobUrl);

      // 4. Server Upload
      const response = await uploadAvatar(file);
      const serverUrl = response?.avatarUrl || avatar;

      // 5. Update the parent state
      setProfile((prev: any) => ({ ...prev, avatar: serverUrl }));

      // 6. The "Hard Wait"
      // We wait 3 seconds before releasing the "Shield".
      // This ensures the backend has finished writing the file
      // and the browser has cached the NEW version.
      setTimeout(() => {
        const finalUrlWithBuster = `${serverUrl}${serverUrl.includes("?") ? "&" : "?"}v=${Date.now()}`;
        setDisplaySrc(finalUrlWithBuster);

        // Final release
        setTimeout(() => {
          isUpdating.current = false;
          setIsProcessing(false);
          showAlert("success", "Avatar updated!");
        }, 500);
      }, 2500);
    } catch (err) {
      console.error(err);
      isUpdating.current = false;
      setIsProcessing(false);
      setDisplaySrc(avatar);
      showAlert("error", "Upload failed");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.avatarContainer}>
        <img
          key={displaySrc} // Force React to treat every change as a brand new image
          src={displaySrc || remzik.src}
          alt="Profile"
          className={styles.avatar}
          style={{ opacity: isProcessing ? 0.5 : 1 }}
        />
        {isProcessing && <div className={styles.loader}>Processing...</div>}
      </div>

      <button
        className={styles.uploadBtn}
        onClick={() => fileRef.current?.click()}
        disabled={isProcessing}
      >
        Change
      </button>

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
