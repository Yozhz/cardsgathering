// app/components/SuccessModal.jsx
import React from 'react';
import Image from 'next/image';
import styles from './ModalExitoPuja.module.css';

const SuccessModal = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <Image
          src="/iconos/cards_gathering_icon_black.png" // Usar el logo del juego
          alt="Cards Gathering Logo"
          width={100}
          height={100}
          className={styles.successLogo}
        />
        <h2 className={styles.successMessage}>Completado Exitosamente</h2>
        <button className={styles.continueButton} onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;