// app/auction/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import auctionStyles from './Auction.module.css';
import AuctionCard from '../components/AuctionCard';
import Header from '../components/Header';
import LoadingCards from '../components/LoadingCards';

export default function AuctionPage() {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGameType, setFilterGameType] = useState('all');
  const [filterTime, setFilterTime] = useState('any');
  const [filterPriceRange, setFilterPriceRange] = useState('all');

  // Datos mock para la página de subastas
  const MOCK_AUCTION_CARDS = [
    { id: 'auction-mock1', name: 'Mewtwo Simulado', image: '/mock-card-mewtwo.png', gameType: 'pokemon', price: '75.50', timeLeft: '1d 10h', verified: true },
    { id: 'auction-mock2', name: 'Zoro Simulado', image: '/mock-card-zoro.png', gameType: 'one-piece', price: '120.00', timeLeft: '2d 5h', verified: false },
    { id: 'auction-mock3', name: 'Goku Simulado', image: '/mock-card-goku.png', gameType: 'dragon-ball-fusion', price: '99.99', timeLeft: '0d 15h', verified: true },
    { id: 'auction-mock4', name: 'Omnimon Simulado', image: '/mock-card-omnimon.png', gameType: 'digimon', price: '150.00', timeLeft: '1d 23h', verified: true },
    { id: 'auction-mock5', name: 'Jace Simulado', image: '/mock-card-jace.png', gameType: 'magic', price: '45.75', timeLeft: '0d 3h', verified: false },
    { id: 'auction-mock6', name: 'Charizard Auction', image: '/mock-card-charizard.png', gameType: 'pokemon', price: '250.00', timeLeft: '3d 18h', verified: true },
    { id: 'auction-mock7', name: 'Nami (OP) Auction', image: '/mock-card-luffy.png', gameType: 'one-piece', price: '80.00', timeLeft: '1d 2h', verified: true },
    { id: 'auction-mock8', name: 'Vegeta Fusion', image: '/mock-card-goku.png', gameType: 'dragon-ball-fusion', price: '110.00', timeLeft: '0d 8h', verified: false },
    { id: 'auction-mock9', name: 'Wargreymon', image: '/mock-card-omnimon.png', gameType: 'digimon', price: '90.00', timeLeft: '2d 12h', verified: true },
    { id: 'auction-mock10', name: 'Black Lotus (MTG)', image: '/mock-card-jace.png', gameType: 'magic', price: '15000.00', timeLeft: '0d 0h', verified: true },
  ];

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
      setCards(MOCK_AUCTION_CARDS);
      setFilteredCards(MOCK_AUCTION_CARDS.slice(0, 20));
    }, 3000);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    let cardsToFilter = [...cards];

    if (searchTerm)
      cardsToFilter = cardsToFilter.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (filterGameType !== 'all')
      cardsToFilter = cardsToFilter.filter(card => card.gameType === filterGameType);

    if (filterTime === '24h' || filterTime === '3d') {
      const maxMinutes = filterTime === '24h' ? 1440 : 4320;

      cardsToFilter = cardsToFilter.filter(card => {
        const [daysStr, hoursStr] = card.timeLeft.split('d');
        const days = parseInt(daysStr) || 0;
        const hours = parseInt(hoursStr?.split('h')[0]) || 0;
        const totalMinutes = days * 24 * 60 + hours * 60;
        return totalMinutes <= maxMinutes;
      });
    }

    if (filterPriceRange !== 'all') {
      const [min, max] = filterPriceRange.split('-').map(Number);
      cardsToFilter = cardsToFilter.filter(card => {
        const price = parseFloat(card.price);
        return price >= min && price <= max;
      });
    }

    setFilteredCards(cardsToFilter.slice(0, 20));
  }, [searchTerm, filterGameType, filterTime, filterPriceRange, cards]);

  const handleCardClick = (card) => console.log('Clicked card:', card);
  const handleCreateAuctionClick = () => alert("Funcionalidad en desarrollo!");

  const getGameTypeOptions = () => ['all', 'pokemon', 'one-piece', 'dragon-ball-fusion', 'digimon', 'magic', 'union-arena', 'gundam'];

  if (loading) {
    return <LoadingCards mensaje="Cargando subastas..." />;
  }

  return (
    <div className={auctionStyles.auctionPageContainer}>
      <Header />
      {/* CAMBIO AQUÍ: La ruta de la imagen de fondo */}
      <div className={auctionStyles.auctionBackground} style={{ backgroundImage: "url('/fhome2.jpg')" }}>
        <div className={auctionStyles.auctionBackgroundGradient}></div>
      </div>

      <div className={auctionStyles.auctionMainContent}>
        <h2 className={auctionStyles.auctionTitle}>Subastas Activas</h2>

        <div className={auctionStyles.auctionGridContainer}>
          <div className={auctionStyles.auctionCenterSection}>
            <aside className={auctionStyles.auctionSidebarLeft}>
              <div className={auctionStyles.filterSection}>
                <h3>Buscar Carta</h3>
                <input type="text" className={auctionStyles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Nombre de la carta..." />
              </div>

              <div className={auctionStyles.filterSection}>
                <h3>Filtrar por Juego</h3>
                <select className={auctionStyles.filterSelect} value={filterGameType} onChange={(e) => setFilterGameType(e.target.value)}>
                  {getGameTypeOptions().map(gameType => (
                    <option key={gameType} value={gameType}>{gameType === 'all' ? 'Todos los Juegos' : gameType.replace('-', ' ')}</option>
                  ))}
                </select>
              </div>

              <div className={auctionStyles.filterSection}>
                <h3>Filtrar por Tiempo</h3>
                <select className={auctionStyles.filterSelect} value={filterTime} onChange={(e) => setFilterTime(e.target.value)}>
                  <option value="any">Cualquier Momento</option>
                  <option value="24h">Menos de 24 Horas</option>
                  <option value="3d">Menos de 3 Días</option>
                </select>
              </div>

              <div className={auctionStyles.filterSection}>
                <h3>Filtrar por Precio</h3>
                <select className={auctionStyles.filterSelect} value={filterPriceRange} onChange={(e) => setFilterPriceRange(e.target.value)}>
                  <option value="all">Todos</option>
                  <option value="0-50">$0 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100-200">$100 - $200</option>
                  <option value="200-500">$200 - $500</option>
                  <option value="500-100000">Más de $500</option>
                </select>
              </div>

              <div className={auctionStyles.createAuctionSection}>
                <button className={auctionStyles.createAuctionButton} onClick={handleCreateAuctionClick}>
                  Crear Nueva Subasta
                </button>
              </div>
            </aside>

            <main className={auctionStyles.auctionContentArea}>
              <div className={auctionStyles.auctionCardsGrid}>
                {filteredCards.length > 0 ? (
                  filteredCards.map(card => (
                    <AuctionCard key={card.id} card={card} onClick={() => handleCardClick(card)} />
                  ))
                ) : (
                  <p className={auctionStyles.noAuctionsMessage}>No se encontraron subastas con los filtros aplicados. Prueba ajustar los filtros o crea una nueva subasta.</p>
                )}
              </div>
            </main>
          </div>
        </div>

        <div className={auctionStyles.auctionScrollableContent}>
          <section className={auctionStyles.scrollSection}>
            <h3>Más Información sobre Subastas</h3>
            <p>Explora cómo funcionan las subastas, reglas y beneficios.</p>
          </section>
        </div>
      </div>

      <footer className={auctionStyles.auctionFooter}></footer>
    </div>
  );
}