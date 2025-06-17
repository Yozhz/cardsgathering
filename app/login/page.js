
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Intentando iniciar sesión con:\nCorreo: ${email}\nContraseña: ${password}`);
    console.log('Iniciar sesión con:', { email, password });
  };

  const handleCreateAccount = () => {
    alert('Redirigiendo a la página de Crear Cuenta');
    console.log('Crear Cuenta');
  };

  return (
    <div className={styles.loginPageContainer}>
      {/* Imagen de fondo en contenedor separado */}
      <div className={styles.backgroundImage}>
        <Image
          src="/login_background.jpg"
          alt="Login Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <div className={styles.loginContent}>
        <div className={styles.loginFormCard}>
          <div className={styles.cardsLogo}>
            <Image
              src="/iconos/POSITIVO LOGO.svg"
              alt="Cards Gathering Logo"
              width={180}
              height={50}
              priority
            />
          </div>

          <h2 className={styles.loginTitle}>Iniciar Sesión</h2>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="off"
                className={styles.input}
                placeholder="Escriba su correo aquí"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="off"
                className={styles.input}
                placeholder="Escriba su contraseña aquí"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.loginButton}>
              Iniciar con Correo
            </button>
          </form>

          <p className={styles.noAccountText}>¿No tienes cuenta?</p>
          <button onClick={handleCreateAccount} className={styles.createAccountButton}>
            Crear Cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
