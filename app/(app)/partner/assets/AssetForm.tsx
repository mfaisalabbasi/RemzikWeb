import styles from "@/app/(app)/partner/styles/AssetForm.module.css";

interface Props {
  assetId?: string;
}

export default function AssetForm({ assetId }: Props) {
  return (
    <section className={styles.section}>
      <h1 className={styles.heading}>
        {assetId ? "Edit Asset" : "Submit New Asset"}
      </h1>
      <form className={styles.form}>
        <label className={styles.field}>
          Asset Name
          <input
            type="text"
            placeholder="Enter asset name"
            className={styles.input}
          />
        </label>
        <label className={styles.field}>
          Asset Value
          <input type="text" placeholder="$0.00" className={styles.input} />
        </label>
        <label className={styles.field}>
          Description
          <textarea
            placeholder="Enter description"
            className={styles.input}
          ></textarea>
        </label>
        <button type="submit" className={styles.submit}>
          {assetId ? "Update Asset" : "Submit Asset"}
        </button>
      </form>
    </section>
  );
}
