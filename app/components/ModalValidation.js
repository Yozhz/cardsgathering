// app/components/ModalValidation.js
'use client';

import React from 'react';
import Image from 'next/image'; // ¡Añadimos esta importación!
import modalStyles from './Modal.module.css';

export default function ModalValidation({ onClose }) {
  return (
    <div className={modalStyles.modalBackdrop}>
      <div className={modalStyles.modalContent} style={{ textAlign: 'center', maxWidth: '400px', padding: '30px', backgroundColor: '#1a1a1a', borderRadius: '15px' }}>
        <div className={modalStyles.modalHeader} style={{ borderBottom: 'none', paddingBottom: '0' }}>
          {/* Aquí podrías insertar la imagen del logo si es parte del modal */}
          <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '20px' }}>
            <Image src="/CardsGathering_logo.png" alt="Cards Gathering Logo" width={200} height={100} style={{ objectFit: 'contain' }} />
          </h2>
        </div>
        <div className={modalStyles.modalBody} style={{ fontSize: '1.5rem', color: 'white', marginBottom: '30px' }}>
          <p>Su artículo está pasando por un proceso de validación de:</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fd7e14', margin: '15px 0' }}>1 día</p>
          <p>Se le notificará cuando esté en venta.</p>
        </div>
        <div className={modalStyles.modalFooter} style={{ borderTop: 'none', paddingTop: '0' }}>
          <button className={modalStyles.primaryButton} onClick={onClose} style={{ backgroundColor: '#fd7e14', color: 'white', padding: '15px 40px', borderRadius: '10px', fontSize: '1.8rem', fontWeight: 'bold' }}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
