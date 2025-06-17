// app/home/page.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Home.module.css';
import CardDisplay from '../components/CardDisplay';
import Header from '../components/Header';
import LoadingCards from '../components/LoadingCards';

export default function Home() {
  const sidebarImages = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
  ];

  const storeImages = [
    '/stores/store1.png',
    '/stores/store2.png',
    '/stores/store3.png',
    '/stores/store4.png',
    '/stores/store5.png',
  ];

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true); // Inicia en true para mostrar el cargador
  const [error, setError] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [currentSidebarImageIndex, setCurrentSidebarImageIndex] = useState(0);
  const cardCarouselIntervalRef = useRef(null);

  const resetCardCarouselTimer = () => {
    if (cardCarouselIntervalRef.current) {
      clearInterval(cardCarouselIntervalRef.current);
    }
    cardCarouselIntervalRef.current = setInterval(() => {
      setCurrentCardIndex(prev => (prev + 1) % cards.length);
    }, 6000);
  };

  useEffect(() => {
    // ############ CAMBIO CLAVE AQUÍ ############
    // Simular carga de 3 segundos
    const loadingTimer = setTimeout(() => {
      setLoading(false); // Después de 3 segundos, loading es false
    }, 3000); // 3 segundos

    // Aquí iría tu lógica de fetch de API REAL.
    // Como la API no está disponible, simplemente simulamos algunas cartas.
    // Puedes comentar o eliminar la llamada a fetch si no quieres que intente cargar.

    const MY_API_KEY = 'f2e9184de767cbf2894f325a6e386c2bc8acf43e5e3317d565f12e0a35d3a8c4';
    const GAME_TYPE = 'pokemon';
    const API_URL = `https://www.apitcg.com/api/${GAME_TYPE}/cards?pageSize=10`;

    const fetchCards = async () => {
      try {
        // La siguiente llamada a fetch podría fallar si la API no está activa o el límite se excedió.
        // Por ahora, como queremos simular, podemos incluso obviar esta llamada real por completo
        // y solo poblar `cards` con datos mock.
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': MY_API_KEY,
          },
        });

        if (!response.ok) {
          // Si la API falla, no mostramos un error fatal, pero registramos la advertencia.
          console.warn(`API HOME ERROR: ${response.status} - ${response.statusText}`);
          // Fallback a datos mock si la API falla
          setCards(MOCK_CARDS); // <-- Usaremos datos mock aquí
          return;
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
          console.warn("API HOME: No se devolvieron cartas o el formato es inesperado. Usando datos mock.");
          setCards(MOCK_CARDS); // <-- Usaremos datos mock aquí
        }
      } catch (err) {
        console.error("Error general al cargar cartas en HOME:", err);
        setError("Problema al cargar las cartas. Mostrando datos de ejemplo.");
        setCards(MOCK_CARDS); // <-- Usaremos datos mock aquí en caso de error de red
      }
    };

    fetchCards(); // Intentamos la carga de la API, pero el `loading` se controla por el timer.

    // Limpia el temporizador si el componente se desmonta antes de que termine
    return () => clearTimeout(loadingTimer);
  }, []); // El array de dependencias está vacío porque fetchCards solo se ejecuta una vez al montar.

  // Datos mock para usar cuando la API no esté disponible o falle
  const MOCK_CARDS = [
    { id: 'mock1', name: 'Charizard Simulado', image: '/mock-card-charizard.png', gameType: 'pokemon', rarity: 'Rare', hp: '150', type: 'Fire' },
    { id: 'mock2', name: 'Luffy Simulado', image: '/mock-card-luffy.png', gameType: 'onepiece', rarity: 'Super Rare', hp: '1000', type: 'Leader' },
    { id: 'mock3', name: 'Blue-Eyes Simulado', image: '/mock-card-blueeyes.png', gameType: 'magic', rarity: 'Ultra Rare', hp: '3000', type: 'Dragon' },
    // Añade más cartas mock según sea necesario
  ];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSidebarImageIndex(i => (i + 1) % sidebarImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [sidebarImages.length]);

  useEffect(() => {
    if (cards.length > 0) {
      resetCardCarouselTimer();
    }
    return () => {
      if (cardCarouselIntervalRef.current) {
        clearInterval(cardCarouselIntervalRef.current);
      }
    };
  }, [cards.length]);

  useEffect(() => {
    function onScroll() {
      const currentScrollY = window.scrollY;
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

  // 🔄 Carga o error - AHORA BASADO SOLO EN EL ESTADO 'loading'
  if (loading) {
    return <LoadingCards mensaje="Cargando tus cartas coleccionables..." />;
  }
  // Si loading es false y hay un error, puedes mostrar un mensaje diferente
  if (error) {
    return <LoadingCards mensaje={`Ops! ${error}`} />;
  }
  // Si loading es false, no hay error y no hay cartas (quizás los mocks también fallaron o la API devolvió vacío)
  if (cards.length === 0 && !loading && !error) {
     return <LoadingCards mensaje="No se encontraron cartas para mostrar. Intenta de nuevo más tarde." />;
  }


  const currentCard = cards.length > 0 ? cards[currentCardIndex] : null;

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.background} style={{ backgroundImage: "url('/fhome.jpg')" }}>
        <div className={styles.backgroundGradient} style={{ opacity: overlayOpacity }} />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.centerSection}>
          <aside className={`${styles.sidebarLeft} ${styles.desktopOnly}`}>
            <div className={styles.infoBoxLeft}>
              <p>Texto 1</p>
              <p>Texto 2</p>
              <p>Texto 3</p>
            </div>
          </aside>

          <main className={styles.contentArea}>
            <h2 className={styles.featuredTitle}>Destacados</h2>

            <div className={styles.cardCarouselWrapper}>
              <div className={styles.pedestalContainer}>
                <div className={styles.pedestal}></div>
                {currentCard ? <CardDisplay card={currentCard} cssClasses={styles} /> : <p>Cargando carta...</p>}
              </div>

              <button
                className={`${styles.carouselNavButton} ${styles.prevButton}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (cards.length > 0) {
                    setCurrentCardIndex(prev => (prev - 1 + cards.length) % cards.length);
                    resetCardCarouselTimer();
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <button
                className={`${styles.carouselNavButton} ${styles.nextButton}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (cards.length > 0) {
                    setCurrentCardIndex(prev => (prev + 1) % cards.length);
                    resetCardCarouselTimer();
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            <div className={`${styles.cardCarouselIndicators} ${styles.hideCarouselIndicators}`}>
              {cards.map((_, idx) => (
                <span
                  key={idx}
                  className={`${styles.indicator} ${idx === currentCardIndex ? styles.activeIndicator : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (cards.length > 0) {
                      setCurrentCardIndex(idx);
                      resetCardCarouselTimer();
                    }
                  }}
                />
              ))}
            </div>
          </main>

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
            <div className={`${styles.infoBoxRight} ${styles.mobileOnly}`}>
              <p>Texto 1</p>
              <p>Texto 2</p>
              <p>Texto 3</p>
            </div>
          </aside>
        </div>

        <div className={styles.scrollableContent}>
          <section className={styles.scrollSection}>
            <h3>TOP VENDEDORES DE LA SEMANA</h3>
            <ul>
              <li>Vendedor A: 150 ventas</li>
              <li>Vendedor B: 120 ventas</li>
              <li>Vendedor C: 90 ventas</li>
            </ul>
          </section>

          <section className={styles.scrollSection}>
            <h3>TOP CARTAS MÁS VENDIDAS</h3>
            <ul>
              <li>Carta Épica de Pokémon</li>
              <li>Carta Rara de One Piece</li>
              <li>Carta Legendaria de Magic</li>
            </ul>
            <h3>TOP JUEGOS MÁS VENDIDOS</h3>
            <ul>
              <li>Pokémon TCG</li>
              <li>One Piece TCG</li>
              <li>Magic: The Gathering</li>
            </ul>
          </section>

          <section className={styles.scrollSection}>
            <h3>TIENDAS AFILIADAS</h3>
            <div className={styles.storesCarousel}>
              {storeImages.map((src, index) => (
                <div key={index} className={styles.storeItem}>
                  <img src={src} alt={`Tienda ${index + 1}`} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </section>

          <section className={styles.scrollSection}>
            <h3>MAPA FUTURO</h3>
            <p>Explora nuestras próximas actualizaciones y características.</p>
          </section>
        </div>
      </div>

      <footer className={styles.footer}></footer>
    </div>
  );
}