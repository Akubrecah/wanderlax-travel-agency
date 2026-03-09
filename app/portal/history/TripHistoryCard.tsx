'use client';

import React from 'react';
import Image from 'next/image';

import { jsPDF } from 'jspdf';

interface Booking {
  id: string;
  status: string;
  serviceType: 'TOUR_PACKAGE' | 'HOTEL' | 'CAR_HIRE';
  finalAmount: number;
  tourBooking?: {
    startDate: string;
    endDate: string;
    tourPackage?: {
      title: string;
      destination?: { country: string };
      images?: string[];
    };
  };
  hotelBooking?: {
    checkIn: string;
    checkOut: string;
    totalNights: number;
    hotel?: {
      name: string;
      destination?: { country: string };
      images?: string[];
    };
  };
  carHireBooking?: {
    pickupDateTime: string;
    returnDateTime: string;
    totalDays: number;
    pickupLocation: string;
    car?: {
      make: string;
      model: string;
      images?: string[];
    };
  };
}

export function TripHistoryCard({ 
  booking 
}: { 
  booking: Booking 
}) {
  const [isReviewing, setIsReviewing] = React.useState(false);
  const [rating, setRating] = React.useState(5);
  const [reviewContent, setReviewContent] = React.useState('');
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);
  let title = "Booking";
  let location = "Location";
  let imageSrc = "https://lh3.googleusercontent.com/aida-public/AB6AXuA8yFgf6CPJSPp1CnNXdtrf-RFZeRCGjHN91Kgmu6Gno1ZypluJ4FF_xDCKPCK0KrDWZebpPEOb8EKy7zN54W9ypVKDkgBHHynrEZxuEn41TtE4Uus5CisLa8NfcwfGwkowFoypurxSAg6aKl6EaX_riNB4jPOBdxDbvFvE2H5dsxHki430La3MDFW4PPcZH6y_FxFobUMHTmm4jxc_AwJupjl5NlilBqrMsDSfya0lReF3h7g_JVTik41VivFvuFmvRTme0mL46Q";
  let dateRange = "Dates TBD";
  let duration = "";
  // Use let so we can override for hotel/car based on end date
  let isCompleted = booking.status === 'COMPLETED';

  if (booking.serviceType === 'TOUR_PACKAGE' && booking.tourBooking) {
    title = booking.tourBooking.tourPackage?.title || title;
    location = booking.tourBooking.tourPackage?.destination?.country || location;
    imageSrc = booking.tourBooking.tourPackage?.images?.[0] || imageSrc;
    
    const start = new Date(booking.tourBooking.startDate);
    const end = new Date(booking.tourBooking.endDate);
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    dateRange = `${startStr} - ${endStr}`;
    duration = `• ${days} Days`;
    
  } else if (booking.serviceType === 'HOTEL' && booking.hotelBooking) {
    title = booking.hotelBooking.hotel?.name || "Hotel Stay";
    location = booking.hotelBooking.hotel?.destination?.country || location;
    imageSrc = booking.hotelBooking.hotel?.images?.[0] || imageSrc;
    
    const start = new Date(booking.hotelBooking.checkIn);
    const end = new Date(booking.hotelBooking.checkOut);
    const nights = booking.hotelBooking.totalNights;
    
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    dateRange = `${startStr} - ${endStr}`;
    duration = `• ${nights} Nights`;
    if (end < new Date()) isCompleted = true;

  } else if (booking.serviceType === 'CAR_HIRE' && booking.carHireBooking) {
    const make = booking.carHireBooking.car?.make;
    const model = booking.carHireBooking.car?.model;
    title = make && model ? `${make} ${model} Rental` : "Car Rental";
    location = booking.carHireBooking.pickupLocation || location;
    imageSrc = booking.carHireBooking.car?.images?.[0] || imageSrc;
    const start = new Date(booking.carHireBooking.pickupDateTime);
    const end = new Date(booking.carHireBooking.returnDateTime);
    const days = booking.carHireBooking.totalDays;
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    dateRange = `${startStr} - ${endStr}`;
    duration = `• ${days} Days`;
    if (end < new Date()) isCompleted = true;
  }

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      // 1. Header Section
      doc.setFillColor(198, 16, 16);
      doc.rect(0, 0, pageWidth, 8, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(198, 16, 16);
      doc.setFontSize(28);
      doc.text("TWENDE AFRICA TOURS", margin, 25);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Luxury Travel & Concierge", margin, 32);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("BOOKING ITINERARY", pageWidth - margin, 25, { align: "right" });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.text(`Issued: ${today}`, pageWidth - margin, 32, { align: "right" });

      // 2. Booking Information 
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Booking Reference:", margin, 50);
      
      doc.setFont("helvetica", "normal");
      doc.text(`#${(booking.id ?? 'UNKNOWN').substring(0, 8).toUpperCase()}`, margin + 40, 50);
      
      doc.setFont("helvetica", "bold");
      doc.text("Status:", pageWidth - margin - 40, 50);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(isCompleted ? 16 : 37, isCompleted ? 185 : 99, isCompleted ? 129 : 235);
      doc.text(isCompleted ? 'COMPLETED' : 'UPCOMING', pageWidth - margin, 50, { align: "right" });

      // Divider
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, 58, pageWidth - margin, 58);

      // 3. Service Details
      let currentY = 75;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Service Details", margin, currentY);
      
      currentY += 12;
      
      const addRow = (label: string, value: string, yPos: number) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(label, margin, yPos);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42);
        doc.text(value, margin + 40, yPos);
      };

      addRow("Service Type:", booking.serviceType.replaceAll('_', ' '), currentY);
      currentY += 10;
      addRow("Destination:", location, currentY);
      currentY += 10;
      addRow("Package/Item:", title, currentY);
      currentY += 10;
      addRow("Schedule:", `${dateRange} (${duration.replace('• ', '')})`, currentY);
      
      currentY += 20;

      // 4. Payment Summary Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 40, 3, 3, 'FD');
      
      currentY += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("Payment Summary", margin + 10, currentY);
      
      currentY += 15;
      doc.setFontSize(14);
      doc.text("Total Amount Paid:", margin + 10, currentY);
      
      doc.setFontSize(16);
      doc.setTextColor(16, 185, 129);
      doc.text(`$${Number(booking.finalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - margin - 10, currentY, { align: "right" });

      // 5. Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text("Thank you for choosing Twende Africa Tours.", pageWidth / 2, pageHeight - 20, { align: "center" });
      doc.text("For support, contact us at info@twendeafricatours.com or call +1 (800) WANDER-LUX.", pageWidth / 2, pageHeight - 15, { align: "center" });
      
      doc.save(`Twende_Itinerary_${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleReviewTrip = () => {
    setIsReviewing(!isReviewing);
  };

  const submitReview = async () => {
    setIsSubmittingReview(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setReviewSubmitted(true);
      setIsReviewing(false);
    } catch (error) {
       console.error("Failed to submit review", error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <article className="group relative flex flex-col gap-0 bg-white dark:bg-card-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-border-dark shadow-xl hover:border-primary/40 transition-all duration-500 print:shadow-none print:border-none">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-2/5 h-64 lg:h-auto overflow-hidden relative print:hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          <Image fill alt={title} className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 1024px) 100vw, 40vw" src={imageSrc}/>
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20">{location}</span>
          </div>
        </div>
        <div className="lg:w-3/5 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight uppercase italic">{title}</h3>
              {isCompleted ? (
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-tighter rounded border border-emerald-500/30">Completed</span>
              ) : (
                 <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-tighter rounded border border-blue-500/30">Upcoming</span>
              )}
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                <span className="text-sm font-medium">{dateRange} {duration}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-sm">payments</span>
                <span className="text-sm font-medium">Total: <span className="text-slate-900 dark:text-white font-bold">${(Number(booking.finalAmount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100 dark:border-border-dark print:hidden">
            <button 
              className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
              title="Coming soon"
            >
              View Itinerary
            </button>
            <button 
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
              onClick={handleDownloadPDF}
              title="Saves this itinerary as a standalone PDF format."
            >
              Download PDF
            </button>
            {isCompleted && !reviewSubmitted && (
              <button 
                className="px-6 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all ml-auto"
                onClick={handleReviewTrip}
              >
                {isReviewing ? "Cancel Review" : "Review Trip"}
              </button>
            )}
            {reviewSubmitted && (
               <span className="ml-auto flex items-center gap-1 text-emerald-500 font-bold text-sm">
                 <span className="material-symbols-outlined text-base">check_circle</span> Reviewed
               </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Review Form Expansion */}
      {isReviewing && (
        <div className="border-t border-slate-100 dark:border-border-dark p-8 flex flex-col gap-6 bg-slate-50 dark:bg-surface-dark">
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Rate your experience</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className="text-2xl hover:scale-110 transition-transform focus:outline-none"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  aria-pressed={rating >= star}
                >
                  <span className={`material-symbols-outlined ${rating >= star ? 'filled text-yellow-400' : 'text-slate-300 dark:text-slate-700'}`}>
                    star
                  </span>
                </button>
              ))}
            </div>
          </div>
          <label htmlFor="review-content" className="sr-only">Your review</label>
          <textarea 
            id="review-content"
            className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y min-h-[100px]"
            placeholder="Share your experience (optional)..."
            aria-label="Share your experience"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          />
          <div className="flex justify-end pt-2">
            <button 
              className="px-6 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              onClick={submitReview}
              disabled={isSubmittingReview}
            >
              {isSubmittingReview ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
