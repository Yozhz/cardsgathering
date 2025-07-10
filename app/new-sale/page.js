// app/new-sale/page.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import auctionStyles from '../auction/Auction.module.css'; // Reutilizamos estilos de subastas
import Header from '../components/Header';
import ModalValidation from '../components/ModalValidation'; // Modal de validación

export default function NewSalePage() {
  const router = useRouter();

  // Estados del formulario
  const [cardName, setCardName] = useState('');
  const [gameType, setGameType] = useState('pokemon'); // Valor inicial
  const [cardCode, setCardCode] = useState('');
  const [initialValue, setInitialValue] = useState(''); // Usaremos string para el input
  const [cardImage, setCardImage] = useState(null); // Para la imagen
  const [previewImage, setPreviewImage] = useState('/file.svg'); // Imagen de previsualización
  const [location, setLocation] = useState('Panamá'); // Estado para la ubicación

  // Estado del modal de validación
  const [showValidationModal, setShowValidationModal] = useState(false);

  const gameTypeOptions = [
    { value: 'pokemon', label: 'Pokémon' },
    { value: 'one-piece', label: 'One Piece' },
    { value: 'dragon-ball-fusion', label: 'Dragon Ball Fusion' },
    { value: 'digimon', label: 'Digimon' },
    { value: 'magic', label: 'Magic The Gathering' },
    { value: 'union-arena', label: 'Union Arena' },
    { value: 'gundam', label: 'Gundam' },
    { value: 'other', label: 'Otros' }, // Opción "Otros"
  ];

  // Lista de las 9 provincias de Panamá (sin comarcas)
  const panamaProvinces = [
    'Bocas del Toro',
    'Coclé',
    'Colón',
    'Chiriquí',
    'Darién',
    'Herrera',
    'Los Santos',
    'Panamá',
    'Veraguas'
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCardImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setCardImage(null);
      setPreviewImage('/file.svg'); // Vuelve a la imagen por defecto
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos al backend (cuando exista)
    // Por ahora, simulamos el envío y mostramos el modal de validación.
    console.log('Datos de la nueva venta:', {
      cardName,
      gameType,
      cardCode,
      initialValue: parseFloat(initialValue), // Convertir a número para enviar
      cardImage: cardImage ? cardImage.name : 'No image',
      location, // Añadimos la ubicación
    });

    // Muestra el modal de validación
    setShowValidationModal(true);
  };

  const handleCloseValidationModal = () => {
    setShowValidationModal(false);
    // Redirige al usuario de vuelta a la página de mercado o a una página de éxito
    router.push('/mercado');
  };

  return (
    <div className={auctionStyles.auctionPageContainer}>
      <Header />

      <div className={auctionStyles.auctionBackground} style={{ backgroundImage: "url('/fhome2.jpg')" }}>
        <div className={auctionStyles.auctionBackgroundGradient}></div>
      </div>

      <div className={auctionStyles.auctionMainContent}>
        <div className={auctionStyles.auctionTopRow}>
          <button className={auctionStyles.backButton} onClick={() => router.back()}>
            Atrás
          </button>
          <h2 className={auctionStyles.auctionTitle} style={{textAlign: 'center', flexGrow: 1}}>
            Nueva Venta
          </h2>
        </div>

        {/* Contenedor principal del formulario (reutilizando estilos de subasta) */}
        <form onSubmit={handleSubmit} className={auctionStyles.newAuctionFormContainer}>
          <div className={auctionStyles.formLeft}>
            <label htmlFor="cardImageUpload" className={auctionStyles.imageUploadBox}>
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Previsualización de la carta"
                  layout="fill"
                  objectFit="contain"
                  className={auctionStyles.uploadedImagePreview}
                />
              ) : (
                <span>Insertar foto de la Carta</span>
              )}
              <input
                id="cardImageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={auctionStyles.hiddenInput}
              />
            </label>
          </div>

          <div className={auctionStyles.formRight}>
            <div className={auctionStyles.formField}>
              <label htmlFor="cardName" className={auctionStyles.fieldLabel}>Nombre de la Artículo</label>
              <input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Ej: Charizard Brillante"
                required
                className={auctionStyles.formInput}
              />
            </div>

            {/* Modificado: Ubicación ahora es un select */}
            <div className={auctionStyles.formField}>
              <label htmlFor="location" className={auctionStyles.fieldLabel}>Ubicación</label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={auctionStyles.formSelect}
                required
              >
                {panamaProvinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div className={auctionStyles.cardInfoSection}>
              <h4 className={auctionStyles.cardInfoTitle}>Información de Carta</h4>

              <div className={auctionStyles.formFieldInline}>
                <label htmlFor="gameType" className={auctionStyles.fieldLabel}>Juego</label>
                <select
                  id="gameType"
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value)}
                  className={auctionStyles.formSelect}
                  required
                >
                  {gameTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className={auctionStyles.formFieldInline}>
                <label htmlFor="cardCode" className={auctionStyles.fieldLabel}>Código de carta</label>
                <input
                  id="cardCode"
                  type="text"
                  value={cardCode}
                  onChange={(e) => setCardCode(e.target.value)}
                  placeholder="Ej: 1/150, XY-123"
                  className={auctionStyles.formInput}
                />
              </div>
            </div>

            <div className={auctionStyles.initialValueSection}>
              <label htmlFor="initialValue" className={auctionStyles.fieldLabel}>Inserte valor</label>
              <input
                id="initialValue"
                type="number" // Tipo number para permitir solo números
                value={initialValue}
                onChange={(e) => {
                  // Asegúrate de que solo se guarden números y puntos
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value) || value === '') { // Permite números y un solo punto decimal
                    setInitialValue(value);
                  }
                }}
                placeholder="5.00"
                step="0.01" // Permite valores decimales de dos cifras
                min="0.01" // Valor mínimo
                required
                className={auctionStyles.initialValueInput}
              />
              <button type="submit" className={auctionStyles.submitBidButton}>Vender</button>
            </div>
          </div>
        </form>
      </div>

      <footer className={auctionStyles.auctionFooter}></footer>

      {/* Modal de Validación */}
      {showValidationModal && (
        <ModalValidation onClose={handleCloseValidationModal} />
      )}
    </div>
  );
}
