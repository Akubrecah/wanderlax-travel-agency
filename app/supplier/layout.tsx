import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function SupplierLayout({
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
      const message = err instanceof Error ? err.message : String(err);
      console.error('Clerk getUser() Error in SupplierLayout:', message);
      redirect('/portal/login');
    }
  }

  if (!userId || !user) {
    redirect('/portal/login');
  }

  const primaryEmail = user.emailAddresses?.[0]?.emailAddress;

  let dbUser: { role: string } | null = null;
  try {
    if (userId) {
      dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { clerkId: userId },
            { email: primaryEmail || '' },
          ],
        },
        select: { role: true },
      });
    }
  } catch (error) {
    console.error('Error fetching user role in supplier layout:', error);
  }

  const role = dbUser?.role || 'CUSTOMER';

  // Only SUPPLIER, ADMIN, and SUPER_ADMIN can access the supplier dashboard
  const allowedRoles = ['SUPPLIER', 'ADMIN', 'SUPER_ADMIN'];
  if (!allowedRoles.includes(role)) {
    redirect('/portal/dashboard');
  }

  return <>{children}</>;
}
