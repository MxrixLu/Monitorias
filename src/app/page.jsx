'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import routes from '../routes';
import Auth from './components/Auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      router.push(routes.HOME);
    }
  }, [router]);

  return <Auth />;
}