import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserTickets } from '@/app/actions/eventBookingActions';
import TicketItem from '@/components/portal/TicketItem';
import Link from 'next/link';

export const metadata = {
  title: 'My Tickets | Member Portal',
};

export default async function TicketsPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/portal/login');
  }

  const { success, tickets } = await getUserTickets(user.id);
  
  if (!success) {
    return (
      <div className="p-8 text-center text-red-500">Failed to load tickets. Please try again later.</div>
    );
  }

  const validTickets = tickets?.filter(t => t.status === 'AVAILABLE' || t.status === 'VALID' || t.status === 'ISSUED') || [];
  const pastTickets = tickets?.filter(t => t.status !== 'AVAILABLE' && t.status !== 'VALID' && t.status !== 'ISSUED') || [];

  return (
    <div className="max-w-[1200px] mx-auto p-6 lg:p-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-4">My Tickets</h1>
          <p className="text-slate-400 text-lg">Manage your event reservations and digital passes.</p>
        </div>
        
        <Link 
          href="/events"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">explore</span>
          Discover Upcoming Events
        </Link>
      </div>

      <div className="space-y-16">
        {/* Valid Tickets Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="size-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/30">
               <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
            </span>
            Active Passes
            <span className="ml-auto text-sm font-medium text-slate-500">{validTickets.length} items</span>
          </h2>
          
          {validTickets.length > 0 ? (
            <div className="space-y-6">
              {validTickets.map(ticket => (
                <TicketItem key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
             <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-sm">
               <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                 <span className="material-symbols-outlined text-[32px] text-slate-500">local_activity</span>
               </div>
               <h3 className="text-xl font-bold text-white mb-2">No active tickets</h3>
               <p className="text-slate-400 max-w-sm mx-auto">You don't have any upcoming event tickets. Explore our curated events and secure your spot.</p>
             </div>
          )}
        </section>

        {/* Past/Cancelled Tickets Section */}
        {pastTickets.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 opacity-70">
              <span className="size-8 rounded-full bg-white/5 text-slate-400 flex items-center justify-center border border-white/10">
                 <span className="material-symbols-outlined text-[18px]">history</span>
              </span>
              Past & Utilized
              <span className="ml-auto text-sm font-medium text-slate-500">{pastTickets.length} items</span>
            </h2>
            
            <div className="space-y-6 opacity-70 hover:opacity-100 transition-opacity duration-300">
              {pastTickets.map(ticket => (
                <TicketItem key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
