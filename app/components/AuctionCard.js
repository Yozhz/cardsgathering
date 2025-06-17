// app/components/AuctionCard.js
"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import auctionStyles from '../auction/Auction.module.css';

// El componente AuctionCard recibe 'card' y 'onClick'
const AuctionCard = ({ card, onClick }) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const mouseX = e.clientX - cardRect.left;
      const mouseY = e.clientY - cardRect.top;

      const normalizedX = (mouseX / cardRect.width) - 0.5;
      const normalizedY = (mouseY / cardRect.height) - 0.5;

      setMousePosition({ x: normalizedX, y: normalizedY });
    }
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const hoverTranslateY = -15;
  const hoverScale = 1.08;
  const maxRotate = 4;

  const translateZ = isCardHovered ? 30 : 0;

  // Transformación de la carta al hacer hover, sin ninguna referencia a 'isCardFlipped'
  const cardTransform = `
    translateZ(${translateZ}px)
    rotateX(${-mousePosition.y * maxRotate}deg)
    rotateY(${mousePosition.x * maxRotate}deg)
    ${isCardHovered ? `scale(${hoverScale}) translateY(${hoverTranslateY}px)` : ''}
  `;

  // Icono de estrella para "Verificada"
  const VerifiedIcon = () => (
    <div className={auctionStyles.verifiedIcon} title="Carta Verificada">
      ⭐
    </div>
  );

  return (
    <div
      ref={cardRef}
      className={`${auctionStyles.auctionCardContainer}`}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Se puede añadir un onClick aquí si quieres una acción al hacer clic,
      // pero ya no será para voltear la carta.
      onClick={() => onClick(card)} // Llama a la función onClick pasada por props
      style={{ transform: cardTransform }}
    >
      {/* Ya no necesitamos .flipper, .cardFront, .cardBack. Solo un wrapper para la imagen. */}
      <div className={auctionStyles.auctionCardImageWrapper}>
        <Image
          src={card.image} // Siempre muestra la imagen del frente
          alt={`Frente de ${card.name}`}
          width={200} // Puedes ajustar el ancho base si lo deseas
          height={Math.round(200 * 1.4)} // La relación de aspecto 1:1.4
          className={auctionStyles.tcgCardImage}
          priority={false}
        />
      </div>

      <div className={auctionStyles.auctionCardInfo}>
        <h4 className={auctionStyles.auctionCardName}>{card.name}</h4>
        <p className={auctionStyles.auctionCardPrice}>
          Oferta Actual: ${parseFloat(card.price).toFixed(2)}
        </p>
        <p className={auctionStyles.auctionCardTime}>
          Tiempo Restante: {card.timeLeft}
        </p>
        {card.verified && <VerifiedIcon />}
      </div>
    </div>
  );
};

export default AuctionCard;