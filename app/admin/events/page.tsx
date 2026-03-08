import { getAdminEvents } from '@/app/actions/eventActions';
import { AdminEventsClient } from '@/components/admin/AdminEventsClient';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Events Management - Admin',
  description: 'Manage your events and ticket sales',
};

export const dynamic = 'force-dynamic';

export default async function EventsAdminPage() {
  const result = await getAdminEvents() as any;
  const safeEvents = result?.success && result?.events ? result.events : [];

  return (
    <div className="stitch-screen">
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-[#120d0d] relative">
          <AdminEventsClient initialEvents={safeEvents} />
        </main>
      </div>
    </div>
  );
}
