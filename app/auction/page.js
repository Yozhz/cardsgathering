// app/auction/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import auctionStyles from './Auction.module.css';
import AuctionCard from '../components/AuctionCard';
import Header from '../components/Header';
import LoadingCards from '../components/LoadingCards';
import { useRouter } from 'next/navigation'; // Importa useRouter

// Importa los nuevos componentes de modal
import ModalDetalleSubasta from '../components/ModalDetalleSubasta';
import ModalPujar from '../components/ModalPujar';
import ModalExitoPuja from '../components/ModalExitoPuja';

export default function AuctionPage() {
  const router = useRouter(); // Inicializa el router

  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showButtons, setShowButtons] = useState(true); // Botones siempre visibles

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGameType, setFilterGameType] = useState('all');
  const [filterTime, setFilterTime] = useState('any');
  const [filterPriceRange, setFilterPriceRange] = useState('all');

  // --- Estados para los modales ---
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBidInputModal, setShowBidInputModal] = useState(false);
  const [showBidSuccessModal, setShowBidSuccessModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentBidAmount, setCurrentBidAmount] = useState('5.00');
  // ---------------------------------

  const MOCK_AUCTION_CARDS = [
    { id: 'auction-mock1', name: 'AURELIA, LA LEY IMPERANTE', image: '/mock-card-aurelia.png', gameType: 'magic', price: '75.50', timeLeft: '0d 0h', verified: true,
      description: 'Criatura legendaria - Ángel. Vuela, vigilancia, prisa. Siempre que un jugador ataque con tres o más criaturas, robas una carta. Siempre que un jugador ataque con cinco o más criaturas, Aurelia, la Ley Imperante hace 3 puntos de daño a cada uno de tus oponentes y tú ganas 3 vidas.',
      seller: 'EduardoElCrack', location: 'Chiriquí', game: 'Magic: The Gathering', type: 'Criatura Legendaria - Ángel', collection: 'R 0357', set: 'MKM•SP', actualBid: '5.00' },
    { id: 'auction-mock2', name: 'Zoro Simulado', image: '/mock-card-zoro.png', gameType: 'one-piece', price: '120.00', timeLeft: '2d 5h', verified: false,
      description: 'Una carta de Zoro de One Piece.', seller: 'FanDeZoro', location: 'Panamá', game: 'One Piece TCG', type: 'Personaje', collection: 'OP-01', set: 'Romance Dawn', actualBid: '110.00' },
    { id: 'auction-mock3', name: 'Goku Simulado', image: '/mock-card-goku.png', gameType: 'dragon-ball-fusion', price: '99.99', timeLeft: '0d 15h', verified: true,
      description: 'Una carta poderosa de Goku.', seller: 'DragonBallZFan', location: 'Veraguas', game: 'Dragon Ball Super TCG', type: 'Guerrero', collection: 'BT-01', set: 'Galactic Battle', actualBid: '90.00' },
    { id: 'auction-mock4', name: 'Omnimon Simulado', image: '/mock-card-omnimon.png', gameType: 'digimon', price: '150.00', timeLeft: '1d 23h', verified: true,
      description: 'Digimon legendario, combinación de WarGreymon y MetalGarurumon.', seller: 'DigiFan', location: 'Colon', game: 'Digimon Card Game', type: 'Digimon', collection: 'BT1', set: 'New Evolution', actualBid: '130.00' },
    { id: 'auction-mock5', name: 'Jace Simulado', image: '/mock-card-jace.png', gameType: 'magic', price: '45.75', timeLeft: '0d 3h', verified: false,
      description: 'Un planeswalker con habilidades de control.', seller: 'MagicPlayer', location: 'Chiriquí', game: 'Magic: The Gathering', type: 'Planeswalker', collection: 'M21', set: 'Core Set 2021', actualBid: '40.00' },
    { id: 'auction-mock6', name: 'Charizard Auction', image: '/mock-card-charizard.png', gameType: 'pokemon', price: '250.00', timeLeft: '3d 18h', verified: true,
      description: 'Un Charizard brillante y poderoso.', seller: 'PokeMaster', location: 'Panamá', game: 'Pokémon TCG', type: 'Pokémon Fuego', collection: 'Base Set', set: 'Unlimited', actualBid: '200.00' },
    { id: 'auction-mock7', name: 'Nami (OP) Auction', image: '/mock-card-luffy.png', gameType: 'one-piece', price: '80.00', timeLeft: '1d 2h', verified: true,
      description: 'Nami, la navegante de los Sombrero de Paja.', seller: 'StrawHatFan', location: 'Darién', game: 'One Piece TCG', type: 'Personaje', collection: 'OP-02', set: 'Paramount War', actualBid: '70.00' },
    { id: 'auction-mock8', name: 'Vegeta Fusion', image: '/mock-card-goku.png', gameType: 'dragon-ball-fusion', price: '110.00', timeLeft: '0d 8h', verified: false,
      description: 'La poderosa fusión de Vegeta.', seller: 'SaiyanPrince', location: 'Coclé', game: 'Dragon Ball Super TCG', type: 'Guerrero', collection: 'BT-04', set: 'Destructive Harmony', actualBid: '100.00' },
    { id: 'auction-mock9', name: 'Wargreymon', image: '/mock-card-omnimon.png', gameType: 'digimon', price: '90.00', timeLeft: '2d 12h', verified: true,
      description: 'El poderoso Digimon Guerrero definitivo.', seller: 'DigiFanatic', location: 'Bocas del Toro', game: 'Digimon Card Game', type: 'Digimon', collection: 'BT1', set: 'New Evolution', actualBid: '85.00' },
    { id: 'auction-mock10', name: 'Black Lotus (MTG)', image: '/mock-card-jace.png', gameType: 'magic', price: '15000.00', timeLeft: '0d 0h', verified: true,
      description: 'Una de las cartas más raras y poderosas de Magic.', seller: 'CollectorMTG', location: 'Panamá', game: 'Magic: The Gathering', type: 'Artefacto', collection: 'Alpha', set: 'Limited Edition Alpha', actualBid: '14500.00' },
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

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setCurrentBidAmount(card.actualBid);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCard(null);
  };

  const handleOpenBidInputModal = () => {
    setShowDetailModal(false);
    setShowBidInputModal(true);
  };

  const handleCloseBidInputModal = () => {
    setShowBidInputModal(false);
    setShowDetailModal(true);
  };

  const handlePlaceBid = (bidAmount) => {
    console.log(`Pujando ${bidAmount} por la carta ${selectedCard.name}`);
    setShowBidInputModal(false);
    setShowBidSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowBidSuccessModal(false);
    setShowDetailModal(false);
    setSelectedCard(null);
  };

  // MODIFICACIÓN: Ahora navega a la nueva página /new-auction
  const handleCreateAuctionClick = () => {
    router.push('/new-auction'); // Navega a la nueva ruta para crear subastas
  };

  // NUEVA FUNCIÓN para navegar a la página de victorias
  const handleVictoriesClick = () => {
    router.push('/victories'); // Navega a la nueva ruta /victories
  };

  const getGameTypeOptions = () => ['all', 'pokemon', 'one-piece', 'dragon-ball-fusion', 'digimon', 'magic', 'union-arena', 'gundam'];

  if (loading) {
    return <LoadingCards mensaje="Cargando subastas..." />;
  }

  return (
    <div className={auctionStyles.auctionPageContainer}>
      <Header />

      <div className={auctionStyles.auctionBackground} style={{ backgroundImage: "url('/fhome2.jpg')" }}>
        <div className={auctionStyles.auctionBackgroundGradient}></div>
      </div>

      <div className={auctionStyles.auctionMainContent}>
        <div className={`${auctionStyles.auctionTopRow} ${showButtons ? auctionStyles.auctionTopRowExpanded : ''}`}>
          <h2 className={auctionStyles.auctionTitle}>
            Subastas
          </h2>
          <div className={`${auctionStyles.auctionButtonsGroup} ${auctionStyles.auctionButtonsGroupVisible}`}>
            <button className={auctionStyles.createAuctionTopButton} onClick={handleCreateAuctionClick}>
              Subastar🔨
            </button>
            {/* ACTUALIZADO: Botón Victorias */}
            <button className={auctionStyles.victoriesTopButton} onClick={handleVictoriesClick}>
              Victorias🏆
            </button>
          </div>
        </div>

        <div className={auctionStyles.auctionFiltersBar}>
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
        </div>

        <div className={auctionStyles.auctionGridContainer}>
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

        <div className={auctionStyles.auctionScrollableContent}>
          <section className={auctionStyles.scrollSection}>
            <h3>Más Información sobre Subastas</h3>
            <p>Explora cómo funcionan las subastas, reglas y beneficios.</p>
          </section>
        </div>
      </div>

      <footer className={auctionStyles.auctionFooter}></footer>

      {/* --- Modales --- */}
      {showDetailModal && selectedCard && (
        <ModalDetalleSubasta
          card={selectedCard}
          currentBid={currentBidAmount}
          onClose={handleCloseDetailModal}
          onPlaceBidClick={handleOpenBidInputModal}
        />
      )}

      {showBidInputModal && selectedCard && (
        <ModalPujar
          card={selectedCard}
          currentBid={currentBidAmount}
          onClose={handleCloseBidInputModal}
          onPlaceBid={handlePlaceBid}
        />
      )}

      {showBidSuccessModal && (
        <ModalExitoPuja
          onClose={handleCloseSuccessModal}
        />
      )}
      {/* ----------------- */}
    </div>
  );
}
