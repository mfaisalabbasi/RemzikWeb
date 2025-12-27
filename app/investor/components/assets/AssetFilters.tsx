import styles from "@/app/investor/styles/AssetFilters.module.css";

export default function AssetFilters() {
  return (
    <div className={styles.filters}>
      <select>
        <option>All Asset Types</option>
        <option>Real Estate</option>
        <option>Trade Finance</option>
      </select>

      <select>
        <option>Any ROI</option>
        <option>10%+</option>
        <option>15%+</option>
      </select>

      <select>
        <option>Any Tenure</option>
        <option>6 Months</option>
        <option>12 Months</option>
      </select>
    </div>
  );
}
