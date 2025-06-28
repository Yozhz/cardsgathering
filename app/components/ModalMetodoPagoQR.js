// app/components/ModalMetodoPagoQR.js
"use client"; // Es un componente de cliente porque usa hooks de React (useState) o interactúa con el DOM

import React from 'react';
import Image from 'next/image'; // Para el QR o iconos
import styles from './ModalMetodoPagoQR.module.css'; // Asegúrate de tener este archivo CSS

const ModalMetodoPagoQR = ({ paymentMethod, onClose, cardPrice }) => {
    // Generar un URL de QR mock. En un escenario real, esto vendría de tu backend.
    const qrCodeData = `Pagar B/.${parseFloat(cardPrice).toFixed(2)} vía ${paymentMethod?.toUpperCase()}.`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeData)}`;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <h2 className={styles.modalTitle}>Pagar con {paymentMethod === 'yappy' ? 'Yappy' : 'PayPal'}</h2>

                <p className={styles.qrInstructions}>Escanea el código QR para completar tu pago de:</p>
                <p className={styles.paymentAmount}>B/. {parseFloat(cardPrice).toFixed(2)}</p>

                <div className={styles.qrCodeContainer}>
                    <Image
                        src={qrCodeUrl}
                        alt="QR Code de Pago"
                        width={200}
                        height={200}
                        className={styles.qrCodeImage}
                    />
                </div>

                <p className={styles.paymentDisclaimer}>
                    Una vez completado el pago, tu orden será procesada.
                </p>
                <button className={styles.confirmButton} onClick={onClose}>Entendido</button>
            </div>
        </div>
    );
};

export default ModalMetodoPagoQR; // <-- ¡Esta línea es FUNDAMENTAL!