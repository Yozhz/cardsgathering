// app/components/PlaceBidModal.jsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ModalPujar.module.css';

const PlaceBidModal = ({ card, currentBid, onClose, onPlaceBid }) => {
  const [yourBid, setYourBid] = useState(parseFloat(currentBid) + 0.50); // Puja mínima sugerida
  const [errorMessage, setErrorMessage] = useState('');

  // Asegura que yourBid se actualice si currentBid cambia (ej. si se abre de nuevo para otra carta)
  useEffect(() => {
    setYourBid(parseFloat(currentBid) + 0.50);
  }, [currentBid]);

  const handleBidSubmit = () => {
    const minBid = parseFloat(currentBid);
    const enteredBid = parseFloat(yourBid);

    if (isNaN(enteredBid) || enteredBid <= minBid) {
      setErrorMessage(`Tu puja debe ser mayor que la puja actual (B/. ${minBid.toFixed(2)}).`);
      return;
    }

    setErrorMessage('');
    onPlaceBid(enteredBid.toFixed(2)); // Pasa la puja al padre
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.bidHeader}>
          <Image
            src="/iconos/cards_gathering_icon_black.png" // Icono de carta para el header del modal
            alt="Cards Gathering Icon"
            width={80}
            height={80}
            className={styles.headerIcon}
          />
        </div>

        <div className={styles.bidInputs}>
          <div className={styles.bidField}>
            <span className={styles.bidLabel}>Puja Actual</span>
            <span className={styles.bidValue}>B/. {parseFloat(currentBid).toFixed(2)}</span>
          </div>

          <div className={styles.bidField}>
            <label htmlFor="yourBid" className={styles.bidLabel}>Tu Puja</label>
            <input
              id="yourBid"
              type="number" // Para teclado numérico en móviles
              step="0.01" // Permite decimales
              min={parseFloat(currentBid) + 0.01} // Establece un mínimo para la puja
              value={yourBid}
              onChange={(e) => {
                setYourBid(e.target.value);
                setErrorMessage(''); // Limpia el mensaje de error al escribir
              }}
              className={styles.bidInput}
            />
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.placeBidButton} onClick={handleBidSubmit}>
            Pujar
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceBidModal;