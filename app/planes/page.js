// app/planes/page.js
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '../components/Header';
import styles from './Planes.module.css';

export default function PlanesPage() {
    const [viewType, setViewType] = useState('players'); // 'players' o 'stores', inicia en 'players'

    const PLAYER_PLANS = [
        { id: 'novato', name: 'NOVATO', icon: '/iconos/newbie_icon.svg' },
        { id: 'zorro', name: 'ZORRO', icon: '/iconos/fox_icon.svg' },
        { id: 'dragon', name: 'DRAGÓN', icon: '/iconos/dragon_icon.svg' },
        { id: 'reydelmeta', name: 'REY DEL META', icon: '/iconos/crown_icon.svg' },
    ];

    const STORE_PLANS = [
        { id: 'store-basic', name: 'PLAN BÁSICO', description: 'Ideal para pequeñas tiendas. Acceso a funciones esenciales.', features: ['Publicación limitada', 'Soporte básico'] },
        { id: 'store-pro', name: 'PLAN PROFESIONAL', description: 'Para tiendas en crecimiento. Más publicaciones y herramientas.', features: ['Publicación ilimitada', 'Soporte prioritario', 'Estadísticas'] },
        { id: 'store-premium', name: 'PLAN SÚPER', description: 'Solución completa para grandes volúmenes. Todas las funciones.', features: ['Publicación ilimitada', 'Soporte 24/7', 'Analíticas avanzadas', 'Asesor personalizado'] },
    ];

    return (
        <div className={styles.planesPageContainer}>
            <Header /> {/* Incluye el componente Header */}

            {/* Fondo de la página */}
            <div className={styles.planesBackground} style={{ backgroundImage: "url('/fplanes.jpg')" }}>
                <div className={styles.planesBackgroundGradient}></div>
            </div>

            <div className={styles.planesMainContent}>
                {/* Nuevo contenedor para el logo, el título y el toggle */}
                <div className={styles.topSection}>
                    {/* Logo de Cards Gathering */}
                    <Image 
                        src="/iconos/POSITIVO LOGO.svg" 
                        alt="Cards Gathering Logo" 
                        width={200} // Ancho inicial para PC, se ajustará con media queries en CSS
                        height={200} // Altura inicial para PC, se ajustará con media queries en CSS
                        className={styles.topSectionLogo} 
                    />
                    {/* Contenedor del título y el toggle switch */}
                    <div className={styles.titleAndToggleWrapper}>
                        <h2 className={styles.planesTitleExpanded}>Planes</h2>
                        <div className={styles.toggleSwitch}>
                            <button
                                className={`${styles.toggleButton} ${viewType === 'stores' ? styles.toggleButtonActiveStore : ''}`}
                                onClick={() => setViewType('stores')}
                            >
                                TIENDAS
                            </button>
                            <button
                                className={`${styles.toggleButton} ${viewType === 'players' ? styles.toggleButtonActivePlayer : ''}`}
                                onClick={() => setViewType('players')}
                            >
                                JUGADORES
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contenedor de las grillas de planes (Jugador o Tienda) */}
                <div className={styles.plansGridContainer}>
                    {viewType === 'players' && (
                        <div className={`${styles.playersPlansGrid} ${styles.plansGridTransition}`}>
                            {PLAYER_PLANS.map(plan => (
                                <div key={plan.id} className={styles.planCard}>
                                    {/* Iconos de los planes de jugador */}
                                    {plan.id === 'novato' && <Image src="/iconos/newbie_icon.svg" alt="Novato Icon" width={100} height={100} className={styles.planIcon} onError={(e) => e.target.src = 'https://placehold.co/100x100/FFD700/000000?text=👶'} />}
                                    {plan.id === 'zorro' && <Image src="/iconos/fox_icon.svg" alt="Zorro Icon" width={100} height={100} className={styles.planIcon} onError={(e) => e.target.src = 'https://placehold.co/100x100/FF8C00/000000?text=🦊'} />}
                                    {plan.id === 'dragon' && <Image src="/iconos/dragon_icon.svg" alt="Dragón Icon" width={100} height={100} className={styles.planIcon} onError={(e) => e.target.src = 'https://placehold.co/100x100/00FF00/000000?text=🐉'} />}
                                    {plan.id === 'reydelmeta' && <Image src="/iconos/crown_icon.svg" alt="Rey del Meta Icon" width={100} height={100} className={styles.planIcon} onError={(e) => e.target.src = 'https://placehold.co/100x100/FFD700/000000?text=👑'} />}

                                    <h3 className={styles.planName}>{plan.name}</h3>
                                    <button className={styles.viewDetailsButton}>Ver Detalles</button>
                                </div>
                            ))}
                        </div>
                    )}
                    {viewType === 'stores' && (
                        <div className={`${styles.storesPlansGrid} ${styles.plansGridTransition}`}>
                            {STORE_PLANS.map(plan => (
                                <div key={plan.id} className={styles.planCard}>
                                    {/* Iconos de estrellas para planes de tienda (emojis) */}
                                    {plan.id === 'store-basic' && <div className={styles.storePlanStars}>⭐</div>}
                                    {plan.id === 'store-pro' && <div className={styles.storePlanStars}>⭐⭐</div>}
                                    {plan.id === 'store-premium' && <div className={styles.storePlanStars}>🌟</div>} {/* Estrella brillante para el plan SÚPER */}

                                    <h3 className={styles.planName}>{plan.name}</h3>
                                    <p className={styles.planDescription}>{plan.description}</p>
                                    {plan.features && (
                                        <ul className={styles.planFeaturesList}>
                                            {plan.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    )}
                                    <button className={styles.viewDetailsButton}>Ver Detalles</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className={styles.planesFooter}>
                <div className={styles.footerContent}>
                    <div className={styles.footerSection}>
                        <Image src="/iconos/LOGO.svg" alt="Prófugos Studios Logo" width={50} height={50} className={styles.footerLogo}/>
                        <p>Prófugos Studios</p>
                        <p>Todos los derechos reservados</p>
                    </div>
                    <div className={styles.footerSection}>
                        <h4>¿TIENES PROBLEMAS?</h4>
                        <p>Contacta con nosotros</p>
                        <p>profugosstudios@gmail.com</p>
                    </div>
                    <div className={styles.footerSection}>
                        <p>Términos y Condiciones</p>
                        <p>Políticas de Privacidad</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
