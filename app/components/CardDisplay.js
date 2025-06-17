// app/components/CardDisplay.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
// LA LÍNEA 'import styles from '../Home.module.css';' DEBE ELIMINARSE DE AQUÍ.
// NO DEBE HABER NINGUNA IMPORTACIÓN DE ESTILOS EN ESTE ARCHIVO.

// Función para determinar la imagen de reverso de la carta
const getCardBackImage = (gameType) => {
  switch (gameType) {
    case 'pokemon':
      return '/cartas/reversocartaP.png'; // Asegúrate de que esta ruta sea correcta en tu carpeta public
    case 'onepiece':
      return '/cartas/reversocartaO.png'; // Asegúrate de que esta ruta sea correcta en tu carpeta public
    case 'magic':
      return '/cartas/reversocartaM.png'; // Asegúrate de que esta ruta sea correcta en tu carpeta public
    default:
      return '/cartas/reversocartaDefault.png'; // Ruta por defecto si no coincide ninguno
  }
};

// CardDisplay ahora acepta una prop adicional llamada 'cssClasses'
export default function CardDisplay({ card, cssClasses }) { // <-- CAMBIO AQUÍ: Añade 'cssClasses'
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // MANEJADORES DE EVENTOS DE LA CARTA
  const handleCardClick = () => {
    setIsCardFlipped(prev => !prev);
  };

  const handleMouseMove = (e) => {
    // El movimiento 3D del ratón solo aplica si está hovered y NO FLIPPED
    if (cardRef.current && isCardHovered && !isCardFlipped) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const mouseX = e.clientX - cardRect.left;
      const mouseY = e.clientY - cardRect.top;

      const normalizedX = (mouseX / cardRect.width) - 0.5;
      const normalizedY = (mouseY / cardRect.height) - 0.5;

      setMousePosition({ x: normalizedX, y: normalizedY });
    }
  };

  const handleMouseEnter = () => {
    if (!isCardFlipped) {
      setIsCardHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Parámetros de la transformación
  const hoverTranslateY = -20;
  const hoverScale = 1.15;
  const maxRotate = 5;

  const translateZ = isCardHovered ? 50 : 0;

  let cardTransform = `translateX(-50%)`;

  if (isCardHovered) {
    cardTransform += ` translateY(${hoverTranslateY}px) scale(${hoverScale}) translateZ(${translateZ}px)`;

    if (!isCardFlipped) {
      cardTransform += ` rotateX(${-mousePosition.y * maxRotate}deg) rotateY(${mousePosition.x * maxRotate}deg)`;
    }
  } else {
    cardTransform += ` translateY(0px) scale(1) translateZ(0px) rotateX(0deg) rotateY(0deg)`;
  }

  // Cuando la carta cambia, resetea los estados
  useEffect(() => {
    setIsCardFlipped(false);
    setIsCardHovered(false);
    setMousePosition({ x: 0, y: 0 });
  }, [card.id]);

  // Obtiene la imagen de reverso basada en el gameType de la carta
  const cardBackSrc = getCardBackImage(card.gameType);

  return (
    <div
      ref={cardRef}
      // CAMBIO CLAVE AQUÍ: Usa 'cssClasses' en lugar de 'styles'
      className={cssClasses.cardFlipContainer}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        transform: cardTransform,
      }}
    >
      {/* CAMBIO CLAVE AQUÍ: Usa 'cssClasses' en lugar de 'styles' */}
      <div className={`${cssClasses.flipper} ${isCardFlipped ? cssClasses.flipped : ''}`}>
        <div className={cssClasses.cardFront}>
          <Image
            src={card.image}
            alt={`Frente de ${card.name}`}
            width={240}
            height={Math.round(240 * 1.4)}
            className={cssClasses.tcgCardImage} // CAMBIO AQUÍ
            priority={true}
          />
        </div>
        <div className={cssClasses.cardBack}>
          <Image
            src={cardBackSrc}
            alt={`Reverso de ${card.name}`}
            width={240}
            height={Math.round(240 * 1.4)}
            className={cssClasses.tcgCardImage} // CAMBIO AQUÍ
            priority={true}
          />
        </div>
      </div>
    </div>
  );
}