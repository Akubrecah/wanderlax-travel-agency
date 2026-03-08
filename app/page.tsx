import React from 'react';
import HomeClient from '@/components/HomeClient';
import { getPublicEvents } from '@/app/actions/eventActions';

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const result = await getPublicEvents();
  const featuredEvents = result.success ? result.events || [] : [];
  
  return <HomeClient featuredEvents={featuredEvents as any} />;
}
