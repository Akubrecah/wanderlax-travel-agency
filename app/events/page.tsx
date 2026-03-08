import { getUpcomingEvents } from '@/app/actions/eventActions';
import EventCard from '@/components/events/EventCard';

export const metadata = {
  title: 'Exclusive Events | Wanderlux',
  description: 'Discover and reserve tickets for exclusive events around the world.',
};

export default async function EventsPage() {
  const result = await getUpcomingEvents();

  if (!result?.success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">{result?.error || 'Failed to load events'}</p>
      </div>
    );
  }

  const events = result.events || [];

  return (
    <div className="min-h-screen bg-black pb-32">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] -left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-[1400px] mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-bold tracking-widest uppercase mb-8 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Curated Experiences
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.1]">
            Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Events</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From intimate workshops to grand festivals, discover handcrafted events that promise unforgettable moments.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-6 lg:px-10 relative z-10 -mt-10">
        <div className="max-w-[1400px] mx-auto">
          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center p-20 text-center rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[64px] text-slate-600 mb-6">event_busy</span>
                <h3 className="text-2xl font-bold text-white mb-2">No Upcoming Events</h3>
                <p className="text-slate-400 max-w-md">We are currently curating our next selection of exclusive events. Check back soon for updates.</p>
              </div>
          )}
        </div>
      </section>
    </div>
  );
}
