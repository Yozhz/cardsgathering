// app/components/ModalSeleccionarTienda.js
"use client"; // Es un componente de cliente

import React, { useState } from 'react';
import styles from './ModalSeleccionarTienda.module.css'; // Asegúrate de tener este archivo CSS

const MOCK_STORES = [
    { id: 'store-1', name: 'Tienda Central - Ciudad de Panamá', address: 'Calle 50, Edificio Global, Piso 10', schedule: 'L-V: 9am-6pm' },
    { id: 'store-2', name: 'Tienda Albrook Mall - Panamá', address: 'Pasillo del Delfín, Local 123', schedule: 'L-D: 10am-8pm' },
    { id: 'store-3', name: 'Tienda Chiriquí - David', address: 'Vía Interamericana, Centro Comercial El Bosque', schedule: 'L-S: 9am-7pm' },
    { id: 'store-4', name: 'Tienda Colón - 4 Altos', address: 'Ave. Bolívar, Local 45', schedule: 'L-V: 8am-5pm' },
    { id: 'store-5', name: 'Tienda Westland Mall - Arraiján', address: 'Autopista Arraiján-La Chorrera', schedule: 'L-D: 10am-8pm' },
];

const ModalSeleccionarTienda = ({ onClose, onSelectStore }) => {
    const [selectedStoreId, setSelectedStoreId] = useState(null);

    const handleSelect = () => {
        const store = MOCK_STORES.find(s => s.id === selectedStoreId);
        if (store) {
            onSelectStore(store);
        } else {
            alert("Por favor, selecciona una tienda."); // Usa un modal personalizado en vez de alert en producción
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <h2 className={styles.modalTitle}>Selecciona una Tienda</h2>

                <div className={styles.storeList}>
                    {MOCK_STORES.map(store => (
                        <div
                            key={store.id}
                            className={`${styles.storeItem} ${selectedStoreId === store.id ? styles.selected : ''}`}
                            onClick={() => setSelectedStoreId(store.id)}
                        >
                            <h3 className={styles.storeName}>{store.name}</h3>
                            <p className={styles.storeAddress}>{store.address}</p>
                            <p className={styles.storeSchedule}>Horario: {store.schedule}</p>
                        </div>
                    ))}
                </div>

                <button
                    className={styles.confirmButton}
                    onClick={handleSelect}
                    disabled={!selectedStoreId} // Deshabilita si no hay tienda seleccionada
                >
                    Confirmar Tienda
                </button>
            </div>
        </div>
    );
};

export default ModalSeleccionarTienda; // <-- ¡Esta línea es FUNDAMENTAL!