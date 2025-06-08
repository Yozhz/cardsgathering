// Home.js
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Home.module.css';

export default function Home() {
  const sidebarImages = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
  ];

  // Rutas de tus cartas TCG, asegurando la ruta correcta
  const tcgCardImages = [
    '/cartas/carta_pedestal.png', // <--- RUTA ACTUALIZADA AQUÍ
    // Si tienes más cartas para el carrusel, añádelas aquí con sus rutas correctas
    // Ejemplo: '/cartas/otra_carta_1.png',
    // Ejemplo: '/cartas/otra_carta_2.png',
  ];

  const [currentSidebarImageIndex, setCurrentSidebarImageIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const sidebarTimer = setInterval(() => setCurrentSidebarImageIndex(i => (i + 1) % sidebarImages.length), 3000);
    return () => clearInterval(sidebarTimer);
  }, [sidebarImages.length]);

  useEffect(() => {
    const cardTimer = setInterval(() => setCurrentCardIndex(i => (i + 1) % tcgCardImages.length), 5000);
    return () => clearInterval(cardTimer);
  }, [tcgCardImages.length]);

  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const overlayOpacity = Math.min(0.5 + scrollY / 800, 0.9);

  return (
    <div className={styles.container}>
      {/* Fondo con imagen */}
      <div
        className={styles.background}
        style={{ backgroundImage: "url('/fondohome.jpg')" }}
      >
        {/* Degradado con opacidad dinámica */}
        <div
          className={styles.backgroundGradient}
          style={{ opacity: overlayOpacity }}
        ></div>
      </div>

      {/* Contenido principal */}
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
          <div className={styles.userInfo}>
            <div className={styles.userAvatar} />
            <div className={styles.userDetails}>
              <div className={styles.userNameContainer}>
                 <img src="/iconos/yozhz_icon.png" alt="Yozhz Icon" className={styles.yozhzIcon} />
                 <span className={styles.userName}>Yozhz</span>
              </div>
              <span className={styles.userLevel}>NIVEL 19</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className={styles.sidebarLeft}>
            <div className={styles.sidebarButtonsWrapper}>
              <button className={`${styles.sidebarButton} ${styles.glassEffect}`}>Texto1</button>
              <button className={`${styles.sidebarButton} ${styles.glassEffect}`}>Texto2</button>
              <button className={`${styles.sidebarButton} ${styles.glassEffect}`}>Texto3</button>
            </div>
          </aside>

          <main className={styles.contentArea}>
            <div className={styles.pedestalContainer}>
              <div className={styles.pedestal}>
                <img
                  src={tcgCardImages[currentCardIndex]}
                  alt="TCG Card"
                  className={styles.tcgCard}
                />
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

            <div className={styles.scrollableContent}>
                <p>Contenido que aparecerá al hacer scroll...</p>
                <p>Más contenido para hacer que la página sea scrollable...</p>
                <div style={{ height: '800px', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '2rem' }}>
                    Sección de Contenido Desplazable
                </div>
                <p>Fin del contenido scrollable.</p>
            </div>
          </main>

          <aside className={styles.sidebarRight}>
            <div className={styles.carouselContainer}>
              <img
                src={sidebarImages[currentSidebarImageIndex]}
                alt="Carrusel Lateral"
                className={styles.carouselImage}
              />
            </div>
          </aside>
        </div>

        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
}