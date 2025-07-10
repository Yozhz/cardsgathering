"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import LoadingCards from '../components/LoadingCards';
import MercadoCard from '../components/MercadoCard';
import mercadoStyles from './Mercado.module.css';
import { useRouter } from 'next/navigation'; // Importa useRouter

export default function MercadoPage() {
    const router = useRouter(); // Inicializa el router

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterGameType, setFilterGameType] = useState('all');
    const [filterPriceRange, setFilterPriceRange] = useState('all');
    const [filterVerified, setFilterVerified] = useState(false);
    const [filterRarity, setFilterRarity] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const CARDS_PER_PAGE = 20;

    const MOCK_MARKET_CARDS = useMemo(() => {
        return Array.from({ length: 52 }, (_, i) => {
            const id = `market-card-${i + 1}`;
            const gameType = ['pokemon', 'one-piece', 'magic', 'digimon', 'dragon-ball-fusion'][i % 5];
            const rarity = ['common', 'rare', 'epic', 'legendary', 'mythic'][i % 5];
            const price = (20 + i * 3).toFixed(2);
            const seller = `Vendedor ${String.fromCharCode(65 + (i % 5))}`;
            const location = ['Panamá', 'Chiriquí', 'Colón', 'Veraguas', 'Coclé'][i % 5];
            const verified = i % 2 === 0;
            const image = `/mock-card-${(i % 5) + 1}.png`;

            return {
                id,
                name: `Carta de Mercado ${i + 1} (${gameType.toUpperCase()})`,
                image,
                gameType,
                price,
                seller,
                location,
                verified,
                rarity,
                description: `Esta es la descripción de la Carta de Mercado ${i + 1}. Es un artículo coleccionable muy buscado.`,
                game: ['Pokémon TCG', 'One Piece TCG', 'Magic: The Gathering', 'Digimon Card Game', 'Dragon Ball Super TCG'][i % 5],
                type: ['Monstruo', 'Personaje', 'Hechizo', 'Criatura', 'Guerrero'][i % 5],
                collection: `COL-${(i % 10) + 1}`,
                set: `SET-${(i % 5) + 1}`,
                powerToughness: i % 2 === 0 ? `${(i % 5) + 1}/${(i % 5) + 2}` : null,
                stock: Math.floor(Math.random() * 10) + 1,
                condition: ['Near Mint', 'Excellent', 'Good', 'Played'][i % 4],
            };
        });
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchCards = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                setCards(MOCK_MARKET_CARDS);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching market cards:", err);
                setError("No se pudieron cargar las cartas del mercado. Intenta de nuevo más tarde.");
                setLoading(false);
            }
        };
        fetchCards();
    }, [MOCK_MARKET_CARDS]);

    const filteredAndSearchedCards = useMemo(() => {
        let currentFilteredCards = [...cards];

        if (searchTerm) {
            currentFilteredCards = currentFilteredCards.filter(card =>
                card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                card.seller.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterGameType !== 'all') {
            currentFilteredCards = currentFilteredCards.filter(card =>
                card.gameType === filterGameType
            );
        }

        if (filterPriceRange !== 'all') {
            currentFilteredCards = currentFilteredCards.filter(card => {
                const price = parseFloat(card.price);
                if (filterPriceRange === '0-50') return price >= 0 && price <= 50;
                if (filterPriceRange === '50-100') return price > 50 && price <= 100;
                if (filterPriceRange === '100-300') return price > 100 && price <= 300;
                if (filterPriceRange === '300-100000') return price > 300;
                return true;
            });
        }

        if (filterVerified) {
            currentFilteredCards = currentFilteredCards.filter(card => card.verified);
        }

        if (filterRarity !== 'all') {
            currentFilteredCards = currentFilteredCards.filter(card => card.rarity === filterRarity);
        }

        return currentFilteredCards;
    }, [cards, searchTerm, filterGameType, filterPriceRange, filterVerified, filterRarity]);

    const totalPages = Math.ceil(filteredAndSearchedCards.length / CARDS_PER_PAGE);
    const paginatedCards = useMemo(() => {
        const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
        const endIndex = startIndex + CARDS_PER_PAGE;
        return filteredAndSearchedCards.slice(startIndex, endIndex);
    }, [currentPage, filteredAndSearchedCards]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterGameType, filterPriceRange, filterVerified, filterRarity]);

    // MODIFICACIÓN: Ahora navega a la nueva página /new-sale
    const handleSellButtonClick = () => {
        router.push('/new-sale'); // Navega a la nueva ruta para vender cartas
    };

    const getGameTypeOptions = () => ['all', 'pokemon', 'one-piece', 'dragon-ball-fusion', 'digimon', 'magic', 'union-arena', 'gundam'];
    const getRarityOptions = () => ['all', 'common', 'rare', 'epic', 'legendary', 'mythic'];

    if (loading) {
        return <LoadingCards mensaje="Cargando cartas del mercado..." />;
    }

    if (error) {
        return (
            <div className={mercadoStyles.mercadoPageContainer}>
                <Header />
                <div className={mercadoStyles.errorMessage}>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className={mercadoStyles.retryButton}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={mercadoStyles.mercadoPageContainer}>
            <Header />

            <div className={mercadoStyles.mercadoBackground} style={{ backgroundImage: "url('/fhome2.jpg')" }}>
                <div className={mercadoStyles.mercadoBackgroundGradient}></div>
            </div>

            <div className={mercadoStyles.mercadoMainContent}>
                <div className={mercadoStyles.mercadoHeaderRow}>
                    <h2 className={mercadoStyles.mercadoTitle}>Mercado</h2>
                    <div className={mercadoStyles.sellButtonContainer}>
                        <button className={mercadoStyles.sellButton} onClick={handleSellButtonClick}>
                            Vender💰
                        </button>
                    </div>
                </div>

                <div className={mercadoStyles.mercadoFilterBar}>
                    <input
                        className={mercadoStyles.searchInput}
                        placeholder="Buscar carta..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select className={mercadoStyles.filterSelect} value={filterGameType} onChange={(e) => setFilterGameType(e.target.value)}>
                        {getGameTypeOptions().map(gameType => (
                            <option key={gameType} value={gameType}>
                                {gameType === 'all' ? 'Todos los Juegos' : gameType.replace(/-/g, ' ')}
                            </option>
                        ))}
                    </select>
                    <select className={mercadoStyles.filterSelect} value={filterPriceRange} onChange={(e) => setFilterPriceRange(e.target.value)}>
                        <option value="all">Precio</option>
                        <option value="0-50">B/. 0 - B/. 50</option>
                        <option value="50-100">B/. 50 - B/. 100</option>
                        <option value="100-300">B/. 100 - B/. 300</option>
                        <option value="300-100000">Más de B/. 300</option>
                    </select>
                    <select className={mercadoStyles.filterSelect} value={filterRarity} onChange={(e) => setFilterRarity(e.target.value)}>
                        {getRarityOptions().map(rarity => (
                            <option key={rarity} value={rarity}>
                                {rarity === 'all' ? 'Todas las Rarezas' : rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                            </option>
                        ))}
                    </select>
                    <label className={mercadoStyles.checkboxContainer}>
                        <input type="checkbox" checked={filterVerified} onChange={(e) => setFilterVerified(e.target.checked)} /> Verificadas
                    </label>
                </div>

                <div className={mercadoStyles.mercadoGridContainer}>
                    <div className={mercadoStyles.mercadoCardsGrid}>
                        {paginatedCards.length > 0 ? (
                            paginatedCards.map(card => (
                                <MercadoCard key={card.id} card={card} />
                            ))
                        ) : (
                            <p className={mercadoStyles.noResultsMessage}>
                                No se encontraron cartas en el mercado con esos filtros.
                            </p>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className={mercadoStyles.pagination}>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={mercadoStyles.paginationButton}
                            >
                                Anterior
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`${mercadoStyles.paginationButton} ${currentPage === i + 1 ? mercadoStyles.activePage : ''}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={mercadoStyles.paginationButton}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <footer className={mercadoStyles.mercadoFooter}>
                © {new Date().getFullYear()} Cards Gathering. Todos los derechos reservados.
            </footer>
        </div>
    );
}
