import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getHotelBySlug } from '@/app/actions/hotelActions';
import HotelDetailClient from './HotelDetailClient';

interface HotelDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: HotelDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);
  
  return {
    title: hotel ? `${hotel.name} | Twende Africa Tours` : 'Hotel Not Found',
    description: hotel?.description || 'Hotel details',
  };
}

export default async function HotelDetailPage({ params }: HotelDetailPageProps) {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);

  if (!hotel) {
    notFound();
  }

  return <HotelDetailClient hotel={hotel} />;
}
