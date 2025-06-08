'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import routes from '../routes';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      router.push(routes.HOME);
    } else {
      router.push(routes.LOGIN);
    }
  }, [router]);

  return null; // No renderizamos nada mientras se realiza la redirección
}