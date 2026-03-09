import React from 'react';
import Link from 'next/link';
import { currentUser, auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function RedemptionSuccessfulPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const searchParams = await props.searchParams;
  const { userId } = await auth();
  if (!userId) redirect('/portal/login');

  const user = await currentUser();
  if (!user) redirect('/portal/login');

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) redirect('/portal/login');

  const loyaltyPoints = dbUser.loyaltyPoints || 0;
  
  // From search params or defaults
  const rewardName = searchParams?.reward || 'Private Island Dinner';
  const pointsRedeemed = searchParams?.points ? parseInt(searchParams.points) : 15000;
  
  // Create a realistic date (e.g., +2 weeks)
  const tripDate = new Date();
  tripDate.setDate(tripDate.getDate() + 14);
  const formattedDate = tripDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) + ' • 7:00 PM';

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 font-sans">
      <div className="layout-container flex h-full grow flex-col">
        {/* Navigation Header */}
        <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4 lg:px-40 bg-[#f8f6f6] dark:bg-[#221610]">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-6">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">Twende Africa Tours</h2>
          </div>
          <Link href="/portal/loyalty" className="flex items-center justify-center rounded-full h-10 w-10 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </Link>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-4xl mx-auto w-full relative">
          {/* Subtle Glow Effect Decoration */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(236, 91, 19, 0.15) 0%, rgba(34, 22, 16, 0) 70%)' }}></div>
          
          {/* Hero Section */}
          <div className="w-full @container mb-8">
            <div className="relative overflow-hidden rounded-xl aspect-[16/9] lg:aspect-[21/9] shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#221610]/80 via-transparent to-transparent z-10"></div>
              <img 
                alt="Luxury private island dinner setup" 
                className="absolute inset-0 w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAz7P4LtTfQ5sAEnfNqdkgftQXCcukYvI3GBZmraRgRIG_ueVaKnz3iCLdkTi7aT8Nk5eQHz3UU4fAJBy7ZE5jaW4yPhQIKPC2RL3IiBRJBq4M7aTFpQpCWhpOfeuyVgzn_YtC_0ChImO4oFcNkL-YAaJgw6r-ngflM0tw8CoUwVoop0JvT5Glv7SLPmNTV89MJ7YE94lZC0JjcizxYq3wGLVLfqXVSd4QfU-6_B9c99ZCPBuTA89I-vX7TGL19Ys0fkayHbh4YQ"
              />
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-white uppercase">Confirmed</span>
                </div>
                <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight">Adventure Awaits, {dbUser.firstName}!</h1>
              </div>
            </div>
          </div>
          
          {/* Success Message & Summary */}
          <div className="text-center mb-10 relative z-10">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
              <span className="material-symbols-outlined text-4xl">celebration</span>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">Redemption Successful</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              Your exclusive {rewardName} has been secured. Get ready for an unforgettable experience.
            </p>
          </div>
          
          {/* Redemption Details Card */}
          <div className="w-full max-w-2xl bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-xl mb-10 relative overflow-hidden">
            {/* Accent Pattern */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-8xl dark:text-white">diamond</span>
            </div>
            <div className="flex flex-col md:flex-row gap-6 relative z-10">
              <div className="flex-1">
                <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-1">Experience</p>
                <h3 className="text-xl font-bold mb-4 dark:text-white">{rewardName}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                    <span className="text-sm">Signature Retreat</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                    <span className="text-sm">{formattedDate}</span>
                  </div>
                </div>
              </div>
              <div className="md:w-px bg-primary/20"></div>
              <div className="flex flex-col justify-center items-center md:items-end md:text-right">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase mb-1">Updated Balance</p>
                <div className="text-2xl font-bold flex items-center gap-2 dark:text-white">
                  <span className="material-symbols-outlined text-primary">stars</span>
                  {loyaltyPoints.toLocaleString()} <span className="text-sm font-normal text-slate-400 uppercase">pts</span>
                </div>
                <p className="text-primary text-[10px] font-bold mt-1 tracking-wider">-{pointsRedeemed.toLocaleString()} pts redeemed</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md relative z-10">
            <Link href="/portal/dashboard" className="flex-1 bg-primary text-white font-bold py-4 px-8 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
              <span>View Dashboard</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link href="/portal/loyalty" className="flex-1 bg-transparent border border-primary/30 text-primary font-bold py-4 px-8 rounded-xl hover:bg-primary/5 transition-all text-center">
              Back to Loyalty
            </Link>
          </div>
          
          {/* Footer Tagline */}
          <p className="mt-12 text-slate-400 dark:text-slate-500 text-xs uppercase tracking-[0.3em] font-medium relative z-10">
            The pinnacle of luxury travel
          </p>
        </main>
      </div>
    </div>
  );
}
