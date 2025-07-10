// app/new-auction/page.js
'use client';

import React, { useState, useMemo } from 'react'; // Importamos useMemo para optimizar
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import auctionStyles from '../auction/Auction.module.css';
import Header from '../components/Header';
import ModalValidation from '../components/ModalValidation';

export default function NewAuctionPage() {
  const router = useRouter();

  // Estados del formulario
  const [cardName, setCardName] = useState('');
  const [gameType, setGameType] = useState('pokemon'); // Valor inicial
  const [cardCode, setCardCode] = useState('');
  const [initialValue, setInitialValue] = useState('');
  const [cardImage, setCardImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('/file.svg'); // Usamos useState para la imagen de previsualización
  const [location, setLocation] = useState('Panamá'); // Estado para la ubicación

  // Estado del modal de validación
  const [showValidationModal, setShowValidationModal] = useState(false); // <-- showValidationModal está definido aquí.

  // Opciones de tipo de juego, incluyendo Yu-Gi-Oh!
  const gameTypeOptions = [
    { value: 'pokemon', label: 'Pokémon' },
    { value: 'one-piece', label: 'One Piece' },
    { value: 'dragon-ball-super', label: 'Dragon Ball Super Card Game' }, // Nombre actualizado para mayor claridad
    { value: 'digimon', label: 'Digimon' },
    { value: 'magic', label: 'Magic The Gathering' },
    { value: 'gundam', label: 'Gundam (General)' }, // Opción general para Gundam
    { value: 'yu-gi-oh', label: 'Yu-Gi-Oh!' }, // Añadido Yu-Gi-Oh!
    { value: 'other', label: 'Otros' },
  ];

  // Lista de las 9 provincias de Panamá
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

  // Función para obtener el placeholder dinámico del código de carta
  const getCardCodePlaceholder = useMemo(() => {
    switch (gameType) {
      case 'pokemon':
        return 'Ej: 151/165 PGO o 004/102';
      case 'one-piece':
        return 'Ej: OP01-001 L o ST01-002 C';
      case 'dragon-ball-super':
        return 'Ej: BT1-001 SR o P-001 PR';
      case 'digimon':
        return 'Ej: BT1-001 o ST1-01';
      case 'magic':
        return 'Ej: 206/285 AFR o 100/269 MH2';
      case 'gundam':
        return 'Ej: GW-01-001 (Gundam War) o UA01ST/GMA-1-001 (Union Arena)';
      case 'union-arena':
        return 'Ej: UA01ST/GMA-1-001'; // Más específico para Union Arena
      case 'yu-gi-oh':
        return 'Ej: 38167735 (Card ID) o LOB-EN001 (Set Code)';
      default:
        return 'Ej: 1/150, XY-123, o ID único';
    }
  }, [gameType]); // Se recalcula solo cuando gameType cambia

  // Función para obtener el texto de ayuda dinámico
  const getCardCodeHelperText = useMemo(() => {
    switch (gameType) {
      case 'pokemon':
        return 'Formato: Número de carta/Total de set (Código de expansión).';
      case 'one-piece':
        return 'Formato: Código de set-Número de carta Rareza.';
      case 'dragon-ball-super':
        return 'Formato: Código de set-Número de carta Rareza.';
      case 'digimon':
        return 'Formato: Código de set-Número de carta.';
      case 'magic':
        return 'Formato: Número de carta/Total de set Código de expansión.';
      case 'gundam':
        return 'El formato varía mucho. Intenta el código de set-número.';
      case 'union-arena':
        return 'Formato: Código de set/Franquicia-Número de unidad-Número de carta.';
      case 'yu-gi-oh':
        return 'Puedes usar el ID de 8 dígitos o el código de set (Ej: LOB-EN001).';
      default:
        return 'Introduce el código o identificador único de la carta.';
    }
  }, [gameType]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCardImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setCardImage(null);
      setPreviewImage('/file.svg');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de la nueva subasta:', {
      cardName,
      gameType,
      cardCode,
      initialValue: parseFloat(initialValue),
      cardImage: cardImage ? cardImage.name : 'No image',
      location, // Añadimos la ubicación
    });

    setShowValidationModal(true);
  };

  const handleCloseValidationModal = () => {
    setShowValidationModal(false);
    router.push('/auction');
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
            Nueva Subasta
          </h2>
        </div>

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

            {/* Eliminado: <p className={auctionStyles.sellerInfo}>Vendedor: Alexus3.14</p> */}
            
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
                  placeholder={getCardCodePlaceholder}
                  className={auctionStyles.formInput}
                />
                {/* Texto de ayuda dinámico */}
                <p className={auctionStyles.helperText}>{getCardCodeHelperText}</p>
              </div>
            </div>

            <div className={auctionStyles.initialValueSection}>
              <label htmlFor="initialValue" className={auctionStyles.fieldLabel}>Inserte valor</label> {/* Texto de etiqueta actualizado */}
              <input
                id="initialValue"
                type="number"
                value={initialValue}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value) || value === '') {
                    setInitialValue(value);
                  }
                }}
                placeholder="5.00"
                step="0.01"
                min="0.01"
                required
                className={auctionStyles.initialValueInput}
              />
              <button type="submit" className={auctionStyles.submitBidButton}>Subastar</button>
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
