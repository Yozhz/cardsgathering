// app/components/MercadoCard.js
"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './MercadoCard.module.css'; // Estilos para el componente individual de la carta

const MercadoCard = ({ card }) => {
    const router = useRouter();

    if (!card) return null; // No renderizar si no hay datos de la carta

    const handleClick = () => {
        router.push(`/mercado/${card.id}`); // Navega a la página de detalle de la carta
    };

    return (
        <div className={styles.mercadoCard} onClick={handleClick}>
            <div className={styles.cardImageContainer}>
                <Image
                    src={card.image}
                    alt={card.name}
                    width={180} // Ajusta el tamaño según sea necesario para la vista de lista
                    height={250} // Ajusta el tamaño
                    objectFit="contain"
                    className={styles.cardImage}
                    // Optional: placeholder="blur" blurDataURL={base64-encoded image} for better loading
                />
            </div>
            <div className={styles.cardInfo}>
                <h3 className={styles.cardName}>{card.name}</h3>
                <p className={styles.cardPrice}>B/. {parseFloat(card.price).toFixed(2)}</p>
                <p className={styles.cardSeller}>{card.seller} {card.verified && <span className={styles.verifiedBadge}>✓</span>}</p> {/* Añadido badge de verificación */}
            </div>
        </div>
    );
};

export default MercadoCard;