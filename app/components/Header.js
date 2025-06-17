// app/components/Header.jsx
"use client"; // Asegúrate de que este componente sea un Client Component

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Para usar el componente Image de Next.js
import { useRouter } from 'next/navigation'; // Importa useRouter para la navegación

export default function Header() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null); // Ref para detectar clics fuera del dropdown
  const router = useRouter(); // Inicializa el hook useRouter

  // --- Placeholder para el nombre y nivel del usuario ---
  // En una aplicación real, estas variables vendrían de un estado de autenticación
  // (ej. Context API, Redux, Zustand) o de props pasadas a este componente,
  // una vez que el usuario haya iniciado sesión.
  const userName = "Yozhz";
  const userLevel = "NIVEL 19";
  // ----------------------------------------------------

  // Función para alternar la visibilidad del dropdown
  const handleUserClick = () => {
    setShowProfileDropdown(prev => !prev);
  };

  // Función para cerrar el dropdown si se hace clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    // Adjuntar el listener de eventos al montar el componente
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Limpiar el listener de eventos al desmontar el componente
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Funciones placeholder para las acciones del menú
  const handleProfileClick = () => {
    alert("¡Navegando a la página de Perfil!");
    setShowProfileDropdown(false); // Cierra el dropdown después de la acción
    // Aquí puedes añadir la lógica real para navegar a la página de perfil
    // router.push('/profile'); // Ejemplo de navegación real a la página de perfil
  };

  const handleLogoutClick = () => {
    // Aquí iría la lógica real para cerrar la sesión del usuario (ej. limpiar tokens de autenticación, etc.)
    alert("¡Cerrando sesión!"); // Alerta temporal para confirmar la acción
    setShowProfileDropdown(false); // Cierra el dropdown después de la acción
    router.push('/login'); // Redirige a la página de login
  };

  return (
    <header className="header">
      <Link href="/" className="flex items-center">
        {/* Usamos Image de Next.js para optimización, define width y height */}
        <Image src="/iconos/LOGO.svg" alt="Logo" width={40} height={40} className="h-10 w-auto cursor-pointer" />
      </Link>
      <nav>
        <ul className="navList">
          <li><button className="navButton">Mercado</button></li>
          <li>
            <Link href="/auction" passHref>
              <button className="navButton">Subastas</button>
            </Link>
          </li>
          <li><button className="navButton">Comprar</button></li>
          <li><button className="navButton">Planes</button></li>
          {/* El enlace de Perfil aquí no es necesario si se usa el área de usuario para el dropdown */}
          {/* <li><button className="navButton">Perfil</button></li> */}
        </ul>
      </nav>

      {/* Sección del usuario - Incluye el icono, nombre y nivel, y el menú desplegable */}
      {/* Todo el div es clickeable para abrir/cerrar el dropdown */}
      <div className="userInfo" onClick={handleUserClick} ref={dropdownRef}>
        {/* Icono de perfil (asegúrate de que esta imagen sea solo el icono y no incluya el texto "Yozhz" si quieres evitar duplicación) */}
        <Image
          src="/iconos/yozhz_icon.png" // Ruta a tu imagen de icono de usuario
          alt="Icono de Perfil"
          width={40} // Ajusta el tamaño del icono
          height={40}
          className="userIcon" // Aplica los estilos CSS definidos en globals.css
        />
        <div className="userDetails">
          {/* Muestra el nombre de usuario y el nivel dinámicamente */}
          <span className="userName">{userName}</span>
          <span className="userLevel">{userLevel}</span>
        </div>

        {/* Menú desplegable, visible solo cuando showProfileDropdown es true */}
        {showProfileDropdown && (
          <div className="profileDropdown">
            <div className="dropdownItem" onClick={handleProfileClick}>
              Perfil
            </div>
            <div className="dropdownItem" onClick={handleLogoutClick}>
              Cerrar sesión
            </div>
          </div>
        )}
      </div>
    </header>
  );
}