import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminSidebarProvider } from '@/components/admin/AdminSidebarContext';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authObject = await auth();
  const userId = authObject?.userId ?? null;
  
  let user = null;
  if (userId) {
    try {
      const client = await clerkClient();
      user = await client.users.getUser(userId);
    } catch (err: unknown) {
      // Transient Clerk API errors (network hiccup, rate limit) should not crash the layout.
      // If we can't verify the user, redirect to login for safety.
      const message = err instanceof Error ? err.message : String(err);
      console.error("Clerk getUser() Error in AdminLayout:", message);
      redirect('/portal/login');
    }
  }

  // If not authenticated, redirect to login
  if (!userId || !user) {
    redirect('/portal/login');
  }

  const primaryEmail = user.emailAddresses?.[0]?.emailAddress;
  const isAdminEmail = primaryEmail?.toLowerCase() === 'poweldayck@gmail.com';

  // Check if user has admin role in the database
  let dbUser: { role: string } | null = null;
  try {
    if (userId) {
      dbUser = await prisma.user.findFirst({
        where: { 
          OR: [
            { clerkId: userId },
            { email: primaryEmail || '' }
          ]
        },
        select: { role: true },
      });
    }
  } catch (error) {
    console.error("Error fetching user role in admin layout:", error);
    // Fall back to email-based check if DB query fails or other Prisma error occurs
  }

  const role = dbUser?.role || (isAdminEmail ? 'ADMIN' : 'CUSTOMER');

  // ADMIN and SUPER_ADMIN have full access.
  // CONSULTANT also gets access as a staff member view.
  const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'CONSULTANT'];
  if (!allowedRoles.includes(role)) {
    redirect('/portal/dashboard');
  }

  return (
    <AdminSidebarProvider>
      {children}
    </AdminSidebarProvider>
  );
}
