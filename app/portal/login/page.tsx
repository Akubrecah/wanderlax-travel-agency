"use client";
import React from 'react';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function TwendeLoginPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-noise opacity-50 mix-blend-overlay"></div>
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Main Content */}
      <div className="layout-container flex h-full grow flex-col relative z-10 justify-center items-center py-10 px-4 sm:px-6 lg:px-8 min-h-screen pt-[72px]">
        {/* Login Card */}
        <div className="w-full max-w-md space-y-8 bg-surface-dark/90 backdrop-blur-xl border border-primary/20 p-8 rounded-xl shadow-2xl">
          {/* Logo Area */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 ring-1 ring-primary/40">
              <span className="material-symbols-outlined text-primary text-3xl">flight_takeoff</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Twende Africa Tours</h2>
            <p className="mt-2 text-sm text-slate-400">Sign in to manage your travel experiences</p>
          </div>

          {/* Clerk Sign In Component */}
          <div className="mt-8">
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'mx-auto w-full',
                  card: 'bg-transparent shadow-none border-none p-0 w-full',
                  cardBox: 'shadow-none w-full',
                  header: 'hidden',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 'bg-surface-input border-primary/20 text-white hover:bg-[#4a3232] transition-colors duration-200',
                  socialButtonsBlockButtonText: 'text-white font-medium',
                  socialButtonsBlockButtonArrow: 'text-white',
                  dividerLine: 'bg-primary/10',
                  dividerText: 'text-slate-500 text-xs',
                  formFieldLabel: 'text-sm font-medium text-slate-300 mb-1',
                  formFieldInput: 'appearance-none w-full py-3 px-3 border border-primary/20 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm bg-surface-input transition-colors duration-200',
                  formButtonPrimary: 'w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300',
                  footerAction: 'text-center',
                  footerActionLink: 'font-medium text-primary hover:text-red-400 transition-colors',
                  footerActionText: 'text-slate-400',
                  identityPreviewEditButton: 'text-primary hover:text-red-400',
                  identityPreviewText: 'text-white',
                  formFieldAction: 'text-primary hover:text-red-400 transition-colors text-sm font-medium',
                  formFieldInputShowPasswordButton: 'text-slate-500 hover:text-primary transition-colors',
                  otpCodeFieldInput: 'w-10 h-12 text-center text-xl font-bold bg-surface-input border border-primary/20 rounded focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none transition-all',
                  formResendCodeLink: 'text-xs text-slate-500 hover:text-slate-300 underline',
                  alert: 'bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg',
                  alertText: 'text-red-400 text-sm',
                  main: 'w-full',
                  form: 'w-full',
                },
                layout: {
                  socialButtonsPlacement: 'bottom',
                },
              }}
              routing="hash"
              afterSignInUrl="/auth-redirect"
            />
          </div>

          {/* Security Badge */}
          <div className="pt-6 border-t border-primary/10">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex items-center gap-2 text-primary/80">
                <span className="material-symbols-outlined text-sm">security</span>
                <p className="text-xs font-semibold uppercase tracking-wider">Secured Access</p>
              </div>
              <p className="text-xs text-slate-400 max-w-xs">Your connection is encrypted and protected with enterprise-grade security.</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>© 2025 Twende Africa Tours. Secure Access.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link className="hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link>
            <span className="text-slate-700">|</span>
            <Link className="hover:text-primary transition-colors" href="/contact">Support</Link>
          </div>
        </div>
      </div>

      {/* Hero Image Area */}
      <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-1/2 -z-10">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background-dark/80 to-background-dark z-10"></div>
        <div className="w-full h-full bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAzpIu_py7Z33OgRtA-uyXR1c1zZP1Lyl5-2hkyLtK7qHDRNQsuxHwlnsAwe39y_ZRRMbGJ_InDib3iQjLnafD9xlsIZQjNX-l-MvP4PPllgNKS2xMm4x5VfswYVor5PaRakG8PmWdaU-GaRokgzId3SKN7RwwPp4xnCXu3JJVpQnG42D5yBwRyZcVmJ7TxfCHj5RulByB6a68KJ0pKwjbc_3MsQEATv-V3QkFpdYEvC38NK-dswhMVNLJTRoE-E8cBRib8QSn-Rg')" }}></div>
      </div>

      {/* Shimmer Animation */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
