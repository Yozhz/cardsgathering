// app/components/Header.jsx
"use client"; // Asegura que este componente sea un Client Component

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const userName = "Yozhz";
  const userLevel = "NIVEL 19";

  const handleUserClick = () => {
    setShowProfileDropdown(prev => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleProfileClick = () => {
    console.log("¡Navegando a la página de Perfil!");
    setShowProfileDropdown(false);
    // router.push('/profile');
  };

  const handleLogoutClick = () => {
    console.log("¡Cerrando sesión!");
    setShowProfileDropdown(false);
    router.push('/login');
  };

  return (
    <header className="header">
      {/* CAMBIO AQUI: Cambia href="/" a href="/home" */}
      <Link href="/home" className="flex items-center">
        <Image src="/iconos/LOGO.svg" alt="Logo" width={40} height={40} className="h-10 w-auto cursor-pointer" />
      </Link>
      <nav>
        <ul className="navList">
          <li>
            <Link href="/mercado" passHref>
              <button className="navButton">Mercado</button>
            </Link>
          </li>
          <li>
            <Link href="/auction" passHref>
              <button className="navButton">Subastas</button>
            </Link>
          </li>
          <li><button className="navButton">Comprar</button></li>
          <li>
            <Link href="/planes" passHref>
              <button className="navButton">Planes</button>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="userInfo" onClick={handleUserClick} ref={dropdownRef}>
        <Image
          src="/iconos/yozhz_icon.png"
          alt="Icono de Perfil"
          width={40}
          height={40}
          className="userIcon"
        />
        <div className="userDetails">
          <span className="userName">{userName}</span>
          <span className="userLevel">{userLevel}</span>
        </div>

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