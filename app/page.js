// app/page.js
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirigir directamente a la página de login
  redirect('/login');

  // Si por alguna razón la redirección no funciona inmediatamente o quieres un fallback visual:
  // return null; // No renderiza nada si la redirección es instantánea
  // o
  // return <div>Redirigiendo a la página de inicio de sesión...</div>;
}