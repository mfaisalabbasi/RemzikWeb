"use client";

import Link from "next/link";
import {
  FaChartLine,
  FaRegCalendar,
  FaMoneyBillWave,
  FaBuilding,
} from "react-icons/fa";
import styles from "./Asset.module.css";

interface AssetCardProps {
  title: string;
  subtitle: string;
  roi: string;
  tenure: string;
  minInvest: string;
  type: string;
  image: string;
  href: string;
}

export default function AssetCard({
  title,
  subtitle,
  roi,
  tenure,
  minInvest,
  type,
  image,
  href,
}: AssetCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.assetImage} />
      </div>

      <div className={styles.content}>
        <h3>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>

        <ul className={styles.metrics}>
          <li className={styles.metric}>
            <FaChartLine className={styles.metricIcon} />
            <div>
              <span>ROI</span>
              <strong>{roi}</strong>
            </div>
          </li>
          <li className={styles.metric}>
            <FaRegCalendar className={styles.metricIcon} />
            <div>
              <span>Tenure</span>
              <strong>{tenure}</strong>
            </div>
          </li>
          <li className={styles.metric}>
            <FaMoneyBillWave className={styles.metricIcon} />
            <div>
              <span>Min Invest</span>
              <strong>{minInvest}</strong>
            </div>
          </li>
          <li className={styles.metric}>
            <FaBuilding className={styles.metricIcon} />
            <div>
              <span>Type</span>
              <strong>{type}</strong>
            </div>
          </li>
        </ul>

        <Link href={href} className={styles.cta}>
          View Details
        </Link>
      </div>
    </div>
  );
}
