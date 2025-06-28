// app/components/AuctionDetailModal.jsx
import React from 'react';
import Image from 'next/image';
import styles from './ModalDetalleSubasta.module.css';

const AuctionDetailModal = ({ card, currentBid, onClose, onPlaceBidClick }) => {
    if (!card) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>

                <div className={styles.modalHeader}>
                    <button className={styles.backButton} onClick={onClose}>Atrás</button>
                    <h2 className={styles.modalTitle}>Subastas</h2>
                    {/* El tiempo restante sigue oculto por CSS, pero puedes poner el valor real aquí si lo tienes */}
                    <span className={styles.timeLeft}>0:10</span>
                </div>

                <div className={styles.cardDetailsSection}>
                    <div className={styles.cardImageContainer}>
                        <Image
                            src={card.image}
                            alt={card.name}
                            width={250} // **AJUSTADO: Más pequeño**
                            height={350} // **AJUSTADO: Más pequeño**
                            objectFit="contain"
                            className={styles.cardImage}
                        />
                    </div>

                    <div className={styles.infoColumn}>
                        <h1 className={styles.cardName}>{card.name}</h1>
                        <p className={styles.detailText}><span className={styles.detailLabel}>Vendedor:</span> {card.seller}</p>
                        <p className={styles.detailText}><span className={styles.detailLabel}>Ubicación:</span> {card.location}</p>

                        <h3 className={styles.detailTitle}>Información de Carta</h3>
                        <p className={styles.detailText}><span className={styles.detailLabel}>Juego:</span> {card.game}</p>
                        <p className={styles.detailText}><span className={styles.detailLabel}>Tipo:</span> {card.type}</p>
                        <p className={styles.detailText}><span className={styles.detailLabel}>Colección:</span> {card.collection}</p>
                        <p className={styles.detailText}><span className={styles.detailLabel}>Set:</span> {card.set}</p>
                        {card.description && <p className={styles.cardDescription}>{card.description}</p>}

                        <div className={styles.bidSection}>
                            <span className={styles.currentBidLabel}>Puja Actual</span>
                            <span className={styles.currentBidAmount}>B/. {parseFloat(currentBid).toFixed(2)}</span>
                            <button className={styles.placeBidButton} onClick={onPlaceBidClick}>
                                Pujar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionDetailModal;