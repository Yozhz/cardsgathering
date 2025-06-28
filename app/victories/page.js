// app/victories/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '../components/Header';
import LoadingCards from '../components/LoadingCards'; // Reutilizamos LoadingCards
import victoriesStyles from './Victories.module.css';

export default function VictoriesPage() {
    const [victories, setVictories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // MOCK DATA para el desarrollo del Front-end
    const MOCK_VICTORIES = [
        {
            id: 'win-1',
            cardName: 'AURELIA, LA LEY IMPERANTE',
            cardImage: '/mock-card-aurelia.png', // Usar una imagen mock existente
            seller: 'EduardoElCrack',
            location: 'Chiriquí',
            amountWon: '75.50',
            status: 'unpaid', // 'unpaid' o 'paid'
            // NOTA AL BACKEND: Añadir fecha de victoria, ID de transacción, etc.
        },
        {
            id: 'win-2',
            cardName: 'Super Conductor Tyranno',
            cardImage: '/mock-card-tyranno.png', // Necesitarás una imagen para esto, o usar una genérica
            seller: 'Yoshua123',
            location: 'Ciudad de Panamá',
            amountWon: '150.00',
            status: 'unpaid',
            // NOTA AL BACKEND: Añadir fecha de victoria, ID de transacción, etc.
        },
        // Puedes añadir más victorias mock aquí para probar el scroll y diferentes estados
        {
            id: 'win-3',
            cardName: 'Blue-Eyes White Dragon',
            cardImage: '/mock-card-blueeyes.png', // Necesitarás una imagen
            seller: 'KaibaCorp',
            location: 'Tokyo',
            amountWon: '500.00',
            status: 'paid', // Ejemplo de una ya pagada
        },
    ];

    useEffect(() => {
        // Simular carga de datos del backend
        const fetchVictories = async () => {
            setLoading(true);
            setError(null);
            try {
                // NOTA AL BACKEND: Aquí iría la llamada a la API real
                // const response = await fetch('/api/user/victories');
                // if (!response.ok) throw new Error('Failed to fetch victories');
                // const data = await response.json();
                // setVictories(data);

                // Por ahora, usamos los datos mock
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simular retardo de red
                setVictories(MOCK_VICTORIES);
            } catch (err) {
                console.error("Error fetching victories:", err);
                setError("No se pudieron cargar tus victorias. Intenta de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchVictories();
    }, []);

    const handlePayClick = (victoryId) => {
        console.log(`Pagar por la victoria con ID: ${victoryId}`);
        // NOTA AL BACKEND:
        // - Implementar la lógica de pago aquí.
        // - Esto probablemente redirigirá a una pasarela de pago o mostrará un modal de confirmación de pago.
        // - Una vez el pago es exitoso, el estado de la victoria en la DB debe actualizarse a 'paid'.
        // - Luego, el frontend debe recargar o actualizar el estado para reflejar el cambio (ej. deshabilitar el botón de pagar).
        alert(`Funcionalidad de pago para ${victoryId} en desarrollo.`);
    };

    const handleDownloadInvoiceClick = (victoryId) => {
        console.log(`Descargar factura para la victoria con ID: ${victoryId}`);
        // NOTA AL BACKEND:
        // - Implementar la lógica para generar y descargar la factura (probablemente un PDF).
        // - El backend necesitará tener acceso a los detalles de la transacción y de la carta.
        alert(`Funcionalidad de descarga de factura para ${victoryId} en desarrollo.`);
    };

    if (loading) {
        return <LoadingCards mensaje="Cargando tus victorias..." />;
    }

    if (error) {
        return (
            <div className={victoriesStyles.victoriesPageContainer}>
                <Header />
                <div className={victoriesStyles.errorMessage}>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className={victoriesStyles.retryButton}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={victoriesStyles.victoriesPageContainer}>
            <Header />

            <div className={victoriesStyles.victoriesBackground} style={{ backgroundImage: "url('/fhome2.jpg')" }}>
                <div className={victoriesStyles.victoriesBackgroundGradient}></div>
            </div>

            <div className={victoriesStyles.victoriesMainContent}>
                <div className={victoriesStyles.victoriesTopRow}>
                    {/* Botón Atrás que navega a la página de subastas */}
                    <button className={victoriesStyles.backButton} onClick={() => window.history.back()}>
                        Atrás
                    </button>
                    <h2 className={victoriesStyles.victoriesTitle}>
                        Victorias
                    </h2>
                </div>

                <div className={victoriesStyles.victoriesGridContainer}>
                    <main className={victoriesStyles.victoriesContentArea}>
                        {victories.length > 0 ? (
                            <div className={victoriesStyles.victoriesList}>
                                {victories.map(victory => (
                                    <div key={victory.id} className={victoriesStyles.victoryCard}>
                                        <div className={victoriesStyles.victoryCardImageContainer}>
                                            <Image
                                                src={victory.cardImage}
                                                alt={victory.cardName}
                                                width={100}
                                                height={140}
                                                objectFit="contain"
                                                className={victoriesStyles.victoryCardImage}
                                            />
                                        </div>
                                        <div className={victoriesStyles.victoryCardInfo}>
                                            <h3 className={victoriesStyles.victoryCardName}>{victory.cardName}</h3>
                                            <p className={victoriesStyles.victoryCardDetail}>
                                                <span className={victoriesStyles.detailLabel}>Vendedor:</span> {victory.seller}
                                            </p>
                                            <p className={victoriesStyles.victoryCardDetail}>
                                                <span className={victoriesStyles.detailLabel}>Ubicación:</span> {victory.location}
                                            </p>
                                            <p className={victoriesStyles.victoryCardAmount}>
                                                Monto Ganado: B/. {parseFloat(victory.amountWon).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className={victoriesStyles.victoryCardActions}>
                                            {victory.status === 'unpaid' ? (
                                                <button
                                                    className={victoriesStyles.payButton}
                                                    onClick={() => handlePayClick(victory.id)}
                                                >
                                                    Pagar
                                                </button>
                                            ) : (
                                                <button
                                                    className={victoriesStyles.paidButton}
                                                    disabled
                                                >
                                                    Pagado
                                                </button>
                                            )}
                                            <button
                                                className={victoriesStyles.downloadInvoiceButton}
                                                onClick={() => handleDownloadInvoiceClick(victory.id)}
                                            >
                                                Descargar Factura
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={victoriesStyles.noVictoriesMessage}>Aún no has ganado ninguna subasta. ¡Sigue pujando!</p>
                        )}
                    </main>
                </div>
            </div>

            <footer className={victoriesStyles.victoriesFooter}></footer>
        </div>
    );
}