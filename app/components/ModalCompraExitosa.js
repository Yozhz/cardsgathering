// app/components/ModalCompraExitosa.js
"use client"; // Es un componente de cliente

import React from 'react';
import Image from 'next/image'; // Para tu logo
import styles from './ModalCompraExitosa.module.css'; // Asegúrate de tener este archivo CSS

const ModalCompraExitosa = ({ onClose }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Completado Exitosamente</h2>
                <div className={styles.imageContainer}>
                    <Image src="/logo-full.png" alt="Cards Gathering Logo" width={150} height={150} /> {/* Asegúrate de que esta ruta sea correcta */}
                </div>
                <p className={styles.successMessage}>
                    Tu compra ha sido procesada con éxito.
                    <br/>¡Gracias por tu compra!
                </p>
                <button className={styles.continueButton} onClick={onClose}>
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default ModalCompraExitosa; // <-- ¡Esta línea es FUNDAMENTAL!