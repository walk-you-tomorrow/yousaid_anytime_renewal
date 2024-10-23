"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarPage } from '@/components/calendar-page';

export default function Calendar() {
  const router = useRouter();

  useEffect(() => {
    const nickname = localStorage.getItem('anytime-nickname');
    if (!nickname) {
      router.replace('/');
    }
  }, [router]);

  return <CalendarPage />;
}