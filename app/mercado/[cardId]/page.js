// app/mercado/[cardId]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import LoadingCards from '../../components/LoadingCards'; // Asegúrate de que este componente exista y funcione
import ModalMetodoPagoQR from '../../components/ModalMetodoPagoQR'; // Asegúrate de que este componente exista y funcione
import ModalSeleccionarTienda from '../../components/ModalSeleccionarTienda'; // Asegúrate de que este componente exista y funcione
import ModalCompraExitosa from '../../components/ModalCompraExitosa'; // Asegúrate de que este componente exista y funcione
import cardDetailStyles from './CardDetail.module.css'; // Estilos para la página de detalle de la carta

// Mover la generación de mock data fuera del componente
// para evitar que se re-genere en cada render y asegurar que los IDs sean consistentes.
const generateMockCardsDetailMap = () => {
    const cardsMap = {};
    for (let i = 0; i < 52; i++) { // Genera 52 cartas (de 1 a 52)
        const id = `market-card-${i + 1}`; // ID crucial que debe coincidir con la página de lista
        const gameType = ['pokemon', 'one-piece', 'magic', 'digimon', 'dragon-ball-fusion'][i % 5];
        const rarity = ['common', 'rare', 'epic', 'legendary', 'mythic'][i % 5];
        const price = (20 + i * 3).toFixed(2);
        const seller = `Vendedor ${String.fromCharCode(65 + (i % 5))}`;
        const location = ['Panamá', 'Chiriquí', 'Colón', 'Veraguas', 'Coclé'][i % 5];
        const verified = i % 2 === 0;
        const image = `/mock-card-${(i % 5) + 1}.png`; // Asegúrate de tener estas imágenes en tu carpeta `public/`

        cardsMap[id] = {
            id: id,
            name: `Carta de Mercado ${i + 1} (${gameType.toUpperCase()})`, // Nombre más descriptivo para el mock
            image,
            gameType,
            price,
            seller,
            location,
            verified,
            rarity,
            description: `Esta es la descripción de la Carta de Mercado ${i + 1}. Es un artículo coleccionable muy buscado y con características únicas para su juego.`,
            game: ['Pokémon TCG', 'One Piece TCG', 'Magic: The Gathering', 'Digimon Card Game', 'Dragon Ball Super TCG'][i % 5],
            type: ['Monstruo', 'Personaje', 'Hechizo', 'Criatura', 'Guerrero'][i % 5],
            collection: `COL-${(i % 10) + 1}`,
            set: `SET-${(i % 5) + 1}`,
            powerToughness: i % 2 === 0 ? `${(i % 5) + 1}/${(i % 5) + 2}` : null,
            stock: Math.floor(Math.random() * 10) + 1,
            condition: ['Near Mint', 'Excellent', 'Good', 'Played'][i % 4],
        };
    }
    return cardsMap;
};

// Generar el mapa una sola vez al cargar el módulo
const MOCK_MARKET_CARDS_DETAIL_MAP = generateMockCardsDetailMap();


export default function CardDetailPage({ params }) {
    const { cardId } = params; // Obtiene el ID de la URL (ej. 'market-card-1')
    const router = useRouter();

    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para los modales
    const [showMetodoPagoQRModal, setShowMetodoPagoQRModal] = useState(false);
    const [showSeleccionarTiendaModal, setShowSeleccionarTiendaModal] = useState(false);
    const [showCompraExitosaModal, setShowCompraExitosaModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('tienda');
    const [selectedStore, setSelectedStore] = useState(null);

    useEffect(() => {
        const fetchCardDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                // Simular un retardo de red para la carga de detalles
                await new Promise(resolve => setTimeout(resolve, 500));

                const fetchedCard = MOCK_MARKET_CARDS_DETAIL_MAP[cardId];
                if (fetchedCard) {
                    setCard(fetchedCard);
                } else {
                    // Si la carta no se encuentra en el mock, lanza un error.
                    // Esto se mostrará en tu UI de error.
                    throw new Error(`Carta con ID "${cardId}" no encontrada en el mercado simulado.`);
                }
            } catch (err) {
                console.error("Error fetching card details:", err);
                setError(err.message || "No se pudo cargar los detalles de la carta. Intenta de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        if (cardId) { // Solo intenta buscar si hay un cardId presente
            fetchCardDetail();
        }
    }, [cardId]); // Dependencia en cardId para re-ejecutar si la URL dinámica cambia (aunque en este caso no lo hará)


    const handleBackClick = () => {
        router.back(); // Vuelve a la página anterior (MercadoPage)
    };

    const handleAddToCart = () => {
        console.log("Añadir al Carrito Clicked!", card.id);
        alert(`Funcionalidad "Añadir a Carrito" para ${card.name} en desarrollo.`);
    };

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
        // Aquí no abrimos el modal inmediatamente, solo lo preparamos para "Comprar"
        console.log("Método de pago seleccionado:", method);
    };

    const handleDeliveryMethodSelect = (method) => {
        setSelectedDeliveryMethod(method);
        if (method === 'tienda') {
            setShowSeleccionarTiendaModal(true); // Abre el modal de tienda si es entrega en tienda
        } else {
            console.log("Entrega por Flete seleccionada.");
            alert("Funcionalidad de entrega por Flete en desarrollo.");
            setSelectedStore(null); // Asegúrate de limpiar la tienda si cambia a flete
        }
    };

    const handleSelectStore = (store) => {
        setSelectedStore(store);
        setShowSeleccionarTiendaModal(false);
        console.log("Tienda seleccionada:", store);
    };

    const handleBuyClick = () => {
        console.log("Comprar Clicked!", card.id);
        if (!selectedPaymentMethod) {
            alert("Por favor, selecciona un método de pago.");
            return;
        }
        if (selectedDeliveryMethod === 'tienda' && !selectedStore) {
            alert("Por favor, selecciona una tienda para la entrega.");
            return;
        }

        // Si todo está bien, abre el modal de QR
        setShowMetodoPagoQRModal(true);
        // Cuando el modal QR se cierre/confirme, abrirías el de compra exitosa
        // Por simplicidad, aquí puedes encadenarlos, o tener una lógica en el modal QR
    };

    // Renderizado condicional para estados de carga y error
    if (loading) {
        return <LoadingCards mensaje="Cargando detalles de la carta..." />;
    }

    if (error) {
        return (
            <div className={cardDetailStyles.detailPageContainer}>
                <Header />
                <div className={cardDetailStyles.errorMessage}>
                    <p>{error}</p>
                    <button onClick={handleBackClick} className={cardDetailStyles.retryButton}>
                        Volver al Mercado
                    </button>
                </div>
            </div>
        );
    }

    // Si no hay carta y no hay error (ej. al inicio antes de fetch o si cardId es null), no renderizar nada
    if (!card) {
        return null;
    }

    // Si todo está bien y la carta se cargó
    return (
        <div className={cardDetailStyles.detailPageContainer}>
            <Header />

            <div className={cardDetailStyles.detailBackground} style={{ backgroundImage: "url('/fhome2.jpg')" }}>
                <div className={cardDetailStyles.detailBackgroundGradient}></div>
            </div>

            <div className={cardDetailStyles.detailMainContent}>
                <div className={cardDetailStyles.detailHeader}>
                    <button className={cardDetailStyles.backButton} onClick={handleBackClick}>
                        Atrás
                    </button>
                    <h2 className={cardDetailStyles.detailTitle}>
                        Comprar
                    </h2>
                </div>

                <div className={cardDetailStyles.cardContentArea}>
                    <div className={cardDetailStyles.cardImageColumn}>
                        <div className={cardDetailStyles.cardImageContainer}>
                            <Image
                                src={card.image}
                                alt={card.name}
                                width={280}
                                height={390}
                                objectFit="contain"
                                className={cardDetailStyles.cardImage}
                            />
                        </div>
                    </div>

                    <div className={cardDetailStyles.cardInfoColumn}>
                        <h1 className={cardDetailStyles.itemName}>{card.name}</h1>
                        <p className={cardDetailStyles.sellerInfo}><span className={cardDetailStyles.label}>Vendedor:</span> {card.seller} {card.verified && <span className={cardDetailStyles.verifiedBadge}>✓ Verificado</span>}</p>
                        <p className={cardDetailStyles.locationInfo}><span className={cardDetailStyles.label}>Ubicación:</span> {card.location}</p>

                        <div className={cardDetailStyles.cardDetailsBlock}>
                            <h3 className={cardDetailStyles.blockTitle}>Información de Carta</h3>
                            <p className={cardDetailStyles.detailItem}><span className={cardDetailStyles.label}>Juego:</span> {card.game}</p>
                            <p className={cardDetailStyles.detailItem}><span className={cardDetailStyles.label}>Tipo:</span> {card.type}</p>
                            <p className={cardDetailStyles.detailItem}><span className={cardDetailStyles.label}>Colección:</span> {card.collection}</p>
                            <p className={cardDetailStyles.detailItem}><span className={cardDetailStyles.label}>Set:</span> {card.set}</p>
                            {card.powerToughness && <p className={cardDetailStyles.detailItem}><span className={cardDetailStyles.label}>Fuerza/Resistencia:</span> {card.powerToughness}</p>}
                            <p className={cardDetailStyles.detailItem}><span className={cardDetailStyles.label}>Rareza:</span> {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}</p>
                            <p className={cardDetailStyles.detailItem}><span className={cardDetailStyles.label}>Condición:</span> {card.condition}</p>
                            <p className={cardDetailStyles.detailItem}><span className={cardDetailStyles.label}>Stock Disponible:</span> {card.stock}</p>
                            {card.description && <p className={cardDetailStyles.descriptionText}>{card.description}</p>}
                        </div>
                    </div>

                    <div className={cardDetailStyles.purchaseOptionsColumn}>
                        <p className={cardDetailStyles.itemPrice}>Precio <br/>B/. {parseFloat(card.price).toFixed(2)}</p>

                        <button className={cardDetailStyles.addToCartButton} onClick={handleAddToCart}>
                            Añadir a Carrito
                        </button>

                        <div className={cardDetailStyles.paymentOptionsBlock}>
                            <h3 className={cardDetailStyles.blockTitle}>Opciones de Compra</h3>
                            <p className={cardDetailStyles.subLabel}>Método de Pago</p>
                            <div className={cardDetailStyles.paymentButtons}>
                                <button className={`${cardDetailStyles.paymentButton} ${selectedPaymentMethod === 'yappy' ? cardDetailStyles.selected : ''}`} onClick={() => handlePaymentMethodSelect('yappy')}>
                                    <Image src="/icons/yappy-icon.png" alt="Yappy" width={40} height={40} />
                                </button>
                                <button className={`${cardDetailStyles.paymentButton} ${selectedPaymentMethod === 'paypal' ? cardDetailStyles.selected : ''}`} onClick={() => handlePaymentMethodSelect('paypal')}>
                                    <Image src="/icons/paypal-icon.png" alt="PayPal" width={40} height={40} />
                                </button>
                                {/* Puedes añadir más métodos de pago aquí */}
                            </div>
                            {selectedPaymentMethod && <p className={cardDetailStyles.selectedMethodText}>Seleccionado: {selectedPaymentMethod.toUpperCase()}</p>}
                        </div>

                        <div className={cardDetailStyles.deliveryOptionsBlock}>
                            <h3 className={cardDetailStyles.blockTitle}>Entrega</h3>
                            <div className={cardDetailStyles.deliveryButtons}>
                                <button className={`${cardDetailStyles.deliveryButton} ${selectedDeliveryMethod === 'tienda' ? cardDetailStyles.selected : ''}`} onClick={() => handleDeliveryMethodSelect('tienda')}>
                                    <Image src="/icons/store-icon.png" alt="Tienda" width={40} height={40} />
                                    Tienda
                                </button>
                                <button className={`${cardDetailStyles.deliveryButton} ${selectedDeliveryMethod === 'flete' ? cardDetailStyles.selected : ''}`} onClick={() => handleDeliveryMethodSelect('flete')}>
                                    <Image src="/icons/delivery-icon.png" alt="Flete" width={40} height={40} />
                                    Flete
                                </button>
                            </div>
                            {selectedDeliveryMethod === 'tienda' && selectedStore && (
                                <p className={cardDetailStyles.selectedStoreText}>Tienda Seleccionada: {selectedStore.name}</p>
                            )}
                            {selectedDeliveryMethod === 'tienda' && !selectedStore && (
                                <button className={cardDetailStyles.configureDeliveryButton} onClick={() => setShowSeleccionarTiendaModal(true)}>
                                    Seleccionar Tienda
                                </button>
                            )}
                            {selectedDeliveryMethod === 'flete' && (
                                <button className={cardDetailStyles.configureDeliveryButton}>
                                    Configurar dirección de envío
                                </button>
                            )}
                        </div>

                        <button className={cardDetailStyles.buyButton} onClick={handleBuyClick}>
                            Comprar
                        </button>
                    </div>
                </div>
            </div>

            <footer className={cardDetailStyles.detailFooter}>© {new Date().getFullYear()} Cards Gathering. Todos los derechos reservados.</footer>

            {/* Modales */}
            {showMetodoPagoQRModal && (
                <ModalMetodoPagoQR
                    paymentMethod={selectedPaymentMethod}
                    onClose={() => {
                        setShowMetodoPagoQRModal(false);
                        setShowCompraExitosaModal(true); // Una vez que se cierra el QR, se asume éxito y se muestra el de compra exitosa
                    }}
                    cardPrice={card.price}
                />
            )}

            {showSeleccionarTiendaModal && (
                <ModalSeleccionarTienda
                    onClose={() => setShowSeleccionarTiendaModal(false)}
                    onSelectStore={handleSelectStore}
                />
            )}

            {showCompraExitosaModal && (
                <ModalCompraExitosa
                    onClose={() => {
                        setShowCompraExitosaModal(false);
                        router.push('/mercado'); // Redirige al mercado después de la compra exitosa
                    }}
                />
            )}
        </div>
    );
}