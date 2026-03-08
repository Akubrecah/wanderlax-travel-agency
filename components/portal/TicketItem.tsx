import React from 'react';
import Image from 'next/image';

interface TicketEvent {
  title: string;
  startDate: string | Date;
  images?: string[];
  category: string;
  destination?: string;
  location?: string;
}

interface TicketType {
  name: string;
}

interface Ticket {
  id: string;
  attendeeName: string | null;
  status: string;
  event: TicketEvent;
  ticketType?: TicketType;
}

interface TicketItemProps {
  ticket: Ticket;
}

export default function TicketItem({ ticket }: TicketItemProps) {
  const { event, id: ticketNumber, attendeeName, status } = ticket;
  const startDate = new Date(event.startDate);

  const statusColors: Record<string, string> = {
    AVAILABLE: 'bg-green-500/20 text-green-400 border-green-500/30',
    VALID: 'bg-green-500/20 text-green-400 border-green-500/30',
    ISSUED: 'bg-green-500/20 text-green-400 border-green-500/30',
    RESERVED: 'bg-green-500/20 text-green-400 border-green-500/30',
    USED: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    CANCELLED: 'bg-primary/20 text-primary border-primary/30',
    REFUNDED: 'bg-primary/20 text-primary border-primary/30',
  };

  const statusIcons: Record<string, string> = {
    AVAILABLE: 'check_circle',
    VALID: 'check_circle',
    ISSUED: 'check_circle',
    RESERVED: 'hourglass_empty',
    USED: 'done_all',
    CANCELLED: 'cancel',
    REFUNDED: 'undo',
  };

  const colorClass = statusColors[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  const iconName = statusIcons[status] || 'info';
  const isValid = status === 'AVAILABLE' || status === 'VALID' || status === 'ISSUED' || status === 'RESERVED';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md group hover:border-white/20 transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        
        {/* Event Image Side */}
        <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
          {event.images && event.images.length > 0 ? (
            <Image 
              src={event.images[0]} 
              alt={event.title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          ) : (
             <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-slate-600">event</span>
             </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:bg-gradient-to-r md:from-black/50 to-transparent"></div>
          
          <div className="absolute bottom-4 left-4">
             <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${colorClass}`}>
               <span className="material-symbols-outlined text-[14px]">{iconName}</span>
               {status}
             </div>
          </div>
        </div>

        {/* Ticket Details Body */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-dashed border-white/20">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-2xl font-black text-white leading-tight">{event.title}</h3>
              <span className="shrink-0 px-3 py-1 rounded bg-white/10 text-xs font-bold text-white uppercase tracking-wider">{event.category}</span>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
               <div className="flex items-center gap-2 text-slate-400 text-sm">
                 <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
                 {startDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
               </div>
               <div className="flex items-center gap-2 text-slate-400 text-sm">
                 <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                 {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
               <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
               <span className="truncate">{event.destination || event.location}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Attendee</p>
                <p className="text-white font-medium">{attendeeName || 'Not Specified'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Ticket Type</p>
                <p className="text-white font-medium">{ticket.ticketType?.name || 'General Admission'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR / Scan Side */}
        <div className="w-full md:w-56 p-6 flex flex-col items-center justify-center bg-black/50 md:bg-transparent relative">
          <div className="absolute top-0 bottom-0 left-[-15px] w-[30px] hidden md:flex flex-col justify-between py-4">
             <div className="size-8 rounded-full bg-black translate-x-1/2"></div>
             <div className="size-8 rounded-full bg-black translate-x-1/2"></div>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Ticket Number</p>
            <p className="font-mono text-white text-sm tracking-wider bg-white/5 py-1 px-3 rounded border border-white/10">{ticketNumber.substring(0, 8).toUpperCase()}</p>
          </div>
          
           <div className={`size-32 rounded-xl flex items-center justify-center relative overflow-hidden ${isValid ? 'bg-white p-2' : 'bg-white/20 opacity-50 grayscale'}`}>
             {isValid ? (
               <div className="w-full h-full relative">
                 <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketNumber}`} alt="QR Code" fill className="object-contain" />
               </div>
             ) : (
                <span className="material-symbols-outlined text-[48px] text-black/50">qr_code_scanner</span>
             )}
             
             {status === 'USED' && (
               <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                 <span className="text-white font-black uppercase tracking-widest rotate-[-15deg] border-2 border-white px-2 py-1">Scanned</span>
               </div>
             )}
           </div>
           
           <p className="text-[10px] text-slate-500 mt-4 text-center">Present this code at the venue</p>
        </div>

      </div>
    </div>
  );
}
