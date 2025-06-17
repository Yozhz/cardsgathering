"use client";

import Image from 'next/image';
import styles from './LoadingCards.module.css';

export default function LoadingCards() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <Image
          src="/iconos/POSITIVO LOGO.svg"
          alt="Cards Gathering Logo"
          width={180}
          height={50}
          priority
        />
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Cargando cartas...</p>
      </div>
    </div>
  );
}
