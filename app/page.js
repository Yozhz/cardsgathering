"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Home.module.css';

export default function Home() {
  const sidebarImages = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
  ];

  const tcgCardImages = [
    '/cartas/carta1.png',
    '/cartas/carta2.png',
    '/cartas/carta3.png',
  ];

  const cardBackImage = '/cartas/reversocarta.png';

  const [currentSidebarImageIndex, setCurrentSidebarImageIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Efecto para el carrusel de Amigos
  useEffect(() => {
    const sidebarTimer = setInterval(() => {
      setCurrentSidebarImageIndex(i => (i + 1) % sidebarImages.length);
    }, 3000);
    return () => clearInterval(sidebarTimer);
  }, [sidebarImages.length]);

  // Efecto para el carrusel de la carta principal (se pausa al hacer hover o clic)
  useEffect(() => {
    let cardTimer;
    if (!isCardHovered && !isCardFlipped) {
      cardTimer = setInterval(() => {
        setCurrentCardIndex(i => (i + 1) % tcgCardImages.length);
      }, 5000);
    }
    return () => clearInterval(cardTimer);
  }, [tcgCardImages.length, isCardHovered, isCardFlipped]);

  // Efecto para controlar el scroll y la opacidad del degradado de fondo
  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Manejador de clic para voltear/desvoltear la carta
  const handleCardClick = () => {
    setIsCardFlipped(prev => !prev);
  };

  // Manejador de movimiento del mouse sobre el contenedor de la carta
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

  // Manejador al salir el mouse de la carta
  const handleMouseLeave = () => {
    setIsCardHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const overlayOpacity = Math.min(0.5 + scrollY / 800, 0.9);

  // Calcula las transformaciones de la carta dinámicamente
  const baseTranslateY = -50;
  const hoverTranslateY = -75;
  const hoverScale = 1.15;
  const maxMoveX = 20;
  const maxMoveY = 15;
  const maxRotate = 5;

  const translateZ = isCardHovered ? 50 : 0;

  const cardTransform = `
    translateY(${isCardHovered ? hoverTranslateY : baseTranslateY}px)
    translateX(${mousePosition.x * maxMoveX}px)
    translateY(${mousePosition.y * maxMoveY}px)
    translateZ(${translateZ}px)
    rotateX(${-mousePosition.y * maxRotate}deg)
    rotateY(${mousePosition.x * maxRotate}deg)
    ${isCardHovered ? `scale(${hoverScale})` : ''}
    ${isCardFlipped ? `rotateY(180deg)` : ''}
  `;

  return (
    <div className={styles.container}>
      <div
        className={styles.background}
        style={{ backgroundImage: "url('/fondohome.jpg')" }}
      >
        <div
          className={styles.backgroundGradient}
          style={{ opacity: overlayOpacity }}
        ></div>
      </div>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <Link href="/" className="flex items-center">
            <img src="/iconos/LOGO.svg" alt="Logo" className="h-10 w-auto cursor-pointer" />
          </Link>
          <nav>
            <ul className={styles.navList}>
              <li><button className={styles.navButton}>Vender</button></li>
              <li><button className={styles.navButton}>Subasta</button></li>
              <li><button className={styles.navButton}>Comprar</button></li>
              <li><button className={styles.navButton}>Eventos</button></li>
              <li><button className={styles.navButton}>Perfil</button></li>
            </ul>
          </nav>
          {/* USER INFO */}
          <div className={styles.userInfo}>
            <div className={styles.userDetails}>
              <div className={styles.userNameContainer}>
                   <img src="/iconos/yozhz_icon.png" alt="Yozhz Icon" className={styles.yozhzIcon} />
                   <span className={styles.userName}>Yozhz</span>
              </div>
              <span className={styles.userLevel}>NIVEL 19</span>
            </div>
          </div>
        </header>

        {/* This div orchestrates the layout with main content and sidebars */}
        <div className={styles.centerSection}> {/* New div for the center section */}

          {/* Left Sidebar - Now a single information box */}
          <aside className={styles.sidebarLeft}>
            {/* ESTO ES EL CUADRO DE INFORMACIÓN DONDE IRÍAN LOS TEXTOS 1, 2, 3 */}
            <div className={styles.infoBoxLeft}>
              <p>Texto 1</p>
              <p>Texto 2</p>
              <p>Texto 3</p>
              {/* Puedes añadir más contenido aquí */}
            </div>
          </aside>

          <main className={styles.contentArea}>
            {/* Título "Destacados" */}
            <h2 className={styles.featuredTitle}>Destacados</h2>

            <div className={styles.pedestalContainer}>
              <div className={styles.pedestal}>
                <div
                  ref={cardRef}
                  className={styles.cardFlipContainer}
                  onMouseEnter={() => setIsCardHovered(true)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleCardClick}
                  style={{ transform: cardTransform }}
                >
                  <div className={styles.cardFront}>
                    <img
                      src={tcgCardImages[currentCardIndex]}
                      alt="Anverso de la carta TCG"
                      className={styles.tcgCardImage}
                    />
                  </div>
                  <div className={styles.cardBack}>
                    <img
                      src={cardBackImage}
                      alt="Reverso de la carta TCG"
                      className={styles.tcgCardImage}
                    />
                  </div>
                </div>

                <div className={styles.cardCarouselIndicators}>
                  {tcgCardImages.map((_, idx) => (
                    <span
                      key={idx}
                      className={`${styles.indicator} ${idx === currentCardIndex ? styles.activeIndicator : ''}`}
                      onClick={() => setCurrentCardIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar - For the "Carrusel Amigos" */}
          <aside className={styles.sidebarRight}>
            <div className={styles.carouselContainer}>
              <span className={styles.friendsText}>AMIGOS</span>
              <img
                src={sidebarImages[currentSidebarImageIndex]}
                alt="Carrusel Amigos"
                className={styles.carouselImage}
              />
            </div>
          </aside>
        </div> {/* End of new centerSection div */}

        {/* Scrollable Content below the pedestal */}
        <div className={styles.scrollableContent}>
            <p>Contenido que aparecerá al hacer scroll...</p>
            <p>Más contenido para hacer que la página sea scrollable...</p>
            <div style={{ height: '800px', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '2rem', marginTop: '2rem' }}>
                Sección de Contenido Desplazable Adicional
            </div>
            <p>Fin del contenido scrollable.</p>
        </div>

        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
}