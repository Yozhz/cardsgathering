// app/page.js (or Home.js)
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Home.module.css';

export default function Home() {
  const sidebarImages = [
    '/image1.jpg', // Make sure these paths are correct in your public/ folder
    '/image2.jpg',
    '/image3.jpg',
  ];

  const storeImages = [
    '/stores/store1.png', // Ejemplo de rutas para imágenes de tiendas
    '/stores/store2.png',
    '/stores/store3.png',
    '/stores/store4.png',
    '/stores/store5.png',
    // Puedes añadir más si lo deseas
  ];


  // ==============================================================
  // ESTADOS PARA DATOS DE LA API Y MANEJO DE LA CARTA
  // ==============================================================
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // ESTADOS PARA EL SCROLL Y LA OPACIDAD DEL FONDO (CORRECCIÓN)
  const [scrollY, setScrollY] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [currentSidebarImageIndex, setCurrentSidebarImageIndex] = useState(0);
  // ==============================================================
  // EFECTO PARA FETCHING DE DATOS DE LA API (APITCG.COM)
  // ==============================================================
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const MY_API_KEY = 'f2e9184de767cbf2894f325a6e386c2bc8acf43e5e3317d565f12e0a35d3a8c4';
        const GAME_TYPE = 'pokemon';
        const API_URL = `https://www.apitcg.com/api/${GAME_TYPE}/cards?pageSize=10`;

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': MY_API_KEY,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error de red: ${response.statusText} (Código: ${response.status}). Mensaje: ${errorData.message || 'Desconocido'}`);
        }

        const data = await response.json();

        if (Array.isArray(data.data) && data.data.length > 0) {
          const formattedCards = data.data.map(card => ({
            id: card.id,
            name: card.name,
            image: card.images?.large || card.images?.small,
            gameType: GAME_TYPE,
            rarity: card.rarity,
            hp: card.hp,
            type: card.type || card.cardType,
          }));
          setCards(formattedCards);
        } else {
          setError(`La API no devolvió cartas para ${GAME_TYPE} o el formato es inesperado.`);
          setCards([]);
        }

      } catch (err) {
        console.error("Error al cargar las cartas:", err);
        setError(err.message);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);


  const getCardBackImage = (gameType) => {
    switch (gameType) {
      case 'pokemon':
        return '/cartas/reversocartaP.png';
      case 'one-piece':
        return '/cartas/reversocartaO.png';
      case 'dragon-ball-fusion':
        return '/cartas/reversocartaD.png';
      case 'digimon':
        return '/cartas/reversocartaDi.png';
      case 'magic':
        return '/cartas/reversocartaM.png';
      case 'union-arena':
        return '/cartas/reversocartaU.png';
      case 'gundam':
        return '/cartas/reversocartaG.png';
      default:
        return '/cartas/reversocartaGenerico.png';
    }
  };


  // ==============================================================
  // EFECTOS PARA EL CARRUSEL DE AMIGOS Y SCROLL
  // ==============================================================
  useEffect(() => {
    const sidebarTimer = setInterval(() => {
      setCurrentSidebarImageIndex(i => (i + 1) % sidebarImages.length);
    }, 3000);
    return () => clearInterval(sidebarTimer);
  }, [sidebarImages.length]);

  useEffect(() => {
    let cardTimer;
    if (cards.length > 0 && !isCardHovered && !isCardFlipped) {
      cardTimer = setInterval(() => {
        setCurrentCardIndex(i => (i + 1) % cards.length);
      }, 5000);
    }
    return () => clearInterval(cardTimer);
  }, [cards.length, isCardHovered, isCardFlipped]);


  useEffect(() => {
    function onScroll() {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setOverlayOpacity(Math.min(0.5 + currentScrollY / 800, 0.9));
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll);
      setOverlayOpacity(Math.min(0.5 + window.scrollY / 800, 0.9));
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', onScroll);
      }
    };
  }, []);


  // ==============================================================
  // MANEJADORES DE EVENTOS
  // ==============================================================
  const handleCardClick = () => {
    if (cards.length > 0) {
      setIsCardFlipped(prev => !prev);
    }
  };

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


  const baseTranslateY = -50; // This is now likely irrelevant as card is within pedestal
  const hoverTranslateY = -20; // Slight upward movement on hover
  const hoverScale = 1.15;
  const maxMoveX = 20;
  const maxMoveY = 15;
  const maxRotate = 5;

  const translateZ = isCardHovered ? 50 : 0;

  // We need to adjust cardTransform. It's currently applied to .cardFlipContainer,
  // which is absolutely positioned relative to .pedestalContainer.
  // The translateY properties in cardTransform were trying to move it relative to its *previous* position,
  // which is incorrect when it's already positioned by 'top' in CSS.
  // Let's simplify and make sure the 'top' in CSS handles the main vertical alignment.
  // The transforms here will be for hover effects.
  const cardTransform = `
    translateX(-50%) /* Always keep it centered horizontally */
    translateZ(${translateZ}px)
    rotateX(${-mousePosition.y * maxRotate}deg)
    rotateY(${mousePosition.x * maxRotate}deg)
    ${isCardHovered ? `scale(${hoverScale}) translateY(${hoverTranslateY}px)` : ''} /* Apply hover translate here */
    ${isCardFlipped ? `rotateY(180deg)` : ''}
  `;


  // ==============================================================
  // RENDERIZADO CONDICIONAL BASADO EN EL ESTADO DE LA API
  // ==============================================================
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContent} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ color: 'white', fontSize: '2rem' }}>Cargando cartas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContent} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ color: 'red', fontSize: '1.5rem', textAlign: 'center' }}>Error al cargar las cartas: {error}</p>
          <p style={{ color: 'white', textAlign: 'center' }}>Por favor, inténtalo de nuevo más tarde o revisa tu conexión/configuración.</p>
        </div>
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContent} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ color: 'white', fontSize: '1.5rem', textAlign: 'center' }}>No se encontraron cartas para mostrar con la configuración actual.</p>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];
  const cardBackSrc = getCardBackImage(currentCard.gameType);


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

      <div className={styles.mainContent}> {/* This div now acts as the main content area *excluding* the footer */}
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

        <div className={styles.centerSection}>
          {/* LEFT SIDEBAR - Desktop Only, will be hidden on mobile */}
          <aside className={`${styles.sidebarLeft} ${styles.desktopOnly}`}>
            <div className={styles.infoBoxLeft}>
              <p>Texto 1</p>
              <p>Texto 2</p>
              <p>Texto 3</p>
            </div>
          </aside>

          <main className={styles.contentArea}>
            <h2 className={styles.featuredTitle}>Destacados</h2>

            {/* Wrapper for the card, pedestal, and side buttons */}
            <div className={styles.cardCarouselWrapper}>
              <div className={styles.pedestalContainer}>
                <div className={styles.pedestal}></div> {/* Pedestal is now just a background image */}
                <div
                  ref={cardRef}
                  className={`${styles.cardFlipContainer} ${isCardFlipped ? styles.flipped : ''}`}
                  onMouseEnter={() => setIsCardHovered(true)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleCardClick}
                  style={{ transform: cardTransform }}
                >
                  <div className={styles.cardFront}>
                    <Image
                      src={currentCard.image}
                      alt={`Frente de ${currentCard.name}`}
                      width={240}
                      height={Math.round(240 * 1.4)}
                      className={styles.tcgCardImage}
                      priority={true}
                    />
                  </div>
                  <div className={styles.cardBack}>
                    <Image
                      src={cardBackSrc}
                      alt={`Reverso de ${currentCard.name}`}
                      width={240}
                      height={Math.round(240 * 1.4)}
                      className={styles.tcgCardImage}
                      priority={true}
                    />
                  </div>
                </div>
              </div>

              {/* Carousel navigation buttons - now within the wrapper */}
              {cards.length > 0 && (
                <>
                  <button className={`${styles.carouselNavButton} ${styles.prevButton}`} onClick={() => { setCurrentCardIndex(prev => (prev - 1 + cards.length) % cards.length); setIsCardFlipped(false); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.navArrowIcon}>
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                  <button className={`${styles.carouselNavButton} ${styles.nextButton}`} onClick={() => { setCurrentCardIndex(prev => (prev + 1) % cards.length); setIsCardFlipped(false); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.navArrowIcon}>
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Carousel Indicators (dots) - Still hidden by default, but kept for future use */}
            {cards.length > 0 && (
              <div className={`${styles.cardCarouselIndicators} ${styles.hideCarouselIndicators}`}>
                {cards.map((_, idx) => (
                  <span
                    key={idx}
                    className={`${styles.indicator} ${idx === currentCardIndex ? styles.activeIndicator : ''}`}
                    onClick={() => { setCurrentCardIndex(idx); setIsCardFlipped(false); }}
                  />
                ))}
              </div>
            )}
          </main>

          {/* RIGHT SIDEBAR - Will hold both original right and original left sidebar content */}
          <aside className={styles.sidebarRight}>
            <div className={styles.carouselContainer}>
              <span className={styles.friendsText}>AMIGOS</span>
              <Image
                src={sidebarImages[currentSidebarImageIndex]}
                alt="Carrusel Amigos"
                width={100}
                height={100}
                className={styles.carouselImage}
              />
            </div>
            {/* Original left sidebar content, now placed inside the right sidebar for mobile reordering */}
            <div className={`${styles.infoBoxRight} ${styles.mobileOnly}`}>
              <p>Texto 1</p>
              <p>Texto 2</p>
              <p>Texto 3</p>
            </div>
          </aside>
        </div>

        {/* Scrollable content (main body of the page) */}
        <div className={styles.scrollableContent}>
          {/* Sección 1: TOP VENDEDORES DE LA SEMANA */}
          <section className={styles.scrollSection}>
            <h3>TOP VENDEDORES DE LA SEMANA</h3>
            <p>Aquí se mostrarán los vendedores con más ventas.</p>
            {/* Puedes añadir más contenido aquí, como una lista dinámica */}
            <ul>
                <li>Vendedor A: 150 ventas</li>
                <li>Vendedor B: 120 ventas</li>
                <li>Vendedor C: 90 ventas</li>
            </ul>
          </section>

          {/* Sección 2: TOP CARTAS MÁS VENDIDAS / TOP JUEGOS MÁS VENDIDOS */}
          <section className={styles.scrollSection}>
            <h3>TOP CARTAS MÁS VENDIDAS</h3>
            <p>Descubre las cartas que están volando.</p>
            {/* Puedes añadir más contenido aquí */}
            <ul>
                <li>Carta Épica de Pokémon</li>
                <li>Carta Rara de One Piece</li>
                <li>Carta Legendaria de Magic</li>
            </ul>
            <br />
            <h3>TOP JUEGOS MÁS VENDIDOS</h3>
            <p>Los juegos de TCG más populares de la semana.</p>
            {/* Puedes añadir más contenido aquí */}
            <ul>
                <li>Pokémon TCG</li>
                <li>One Piece TCG</li>
                <li>Magic: The Gathering</li>
            </ul>
          </section>

          {/* Sección 3: TIENDAS AFILIADAS (Carrusel Horizontal/Vertical) */}
          <section className={styles.scrollSection}>
            <h3>TIENDAS AFILIADAS</h3>
            <div className={styles.storesCarousel}>
              {storeImages.map((src, index) => (
                <div key={index} className={styles.storeItem}>
                  {/* Podrías usar <Image> aquí si las imágenes existen en public/stores/ */}
                  <img src={src} alt={`Tienda ${index + 1}`} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </section>

          {/* Último Contenedor: MAPA FUTURO */}
          <section className={styles.scrollSection}>
            <h3>MAPA FUTURO</h3>
            <p>Explora nuestras próximas actualizaciones y características.</p>
          </section>

        </div>
      </div> {/* Close mainContent div */}

      <footer className={styles.footer}></footer> {/* Footer is now outside mainContent */}
    </div>
  );
}