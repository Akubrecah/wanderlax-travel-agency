"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getStaff() {
  try {
    const allUsers = await prisma.user.findMany({
      include: {
        staffProfile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const targetEmail = 'poweldayck@gmail.com';
    const staff = allUsers.filter(user => {
      const isStaff = user.staffProfile !== null || 
                     (['ADMIN', 'SUPER_ADMIN', 'CONSULTANT', 'SUPPLIER'] as string[]).includes(user.role);
      const isTarget = user.email.toLowerCase().trim() === targetEmail;
      return isStaff || isTarget;
    });

    return { 
      count: allUsers.length, 
      result: JSON.parse(JSON.stringify(staff)) 
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching staff:", error);
    return { count: 0, result: [], error: message };
  }
}

export async function updateStaffRole(id: string, role: string) {
  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { role: role as Role }
    });
    return { success: true, user: JSON.parse(JSON.stringify(updated)) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating staff role:", error);
    return { success: false, error: message };
  }
}

export async function toggleStaffStatus(id: string, isActive: boolean) {
  try {
    const updated = await prisma.staffProfile.upsert({
      where: { userId: id },
      update: { isActive },
      create: { 
        userId: id, 
        isActive,
        jobTitle: "Staff Member" // Default for new profile
      }
    });
    return { success: true, profile: JSON.parse(JSON.stringify(updated)) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error toggling staff status:", error);
    return { success: false, error: message };
  }
}

export async function deleteStaff(id: string) {
  try {
    // 1. Find bookings to delete their invoices/payments first
    const bookings = await prisma.booking.findMany({ where: { userId: id }, select: { id: true } });
    const bookingIds = bookings.map(b => b.id);
    if (bookingIds.length > 0) {
      await prisma.invoice.deleteMany({ where: { bookingId: { in: bookingIds } } });
      await prisma.payment.deleteMany({ where: { bookingId: { in: bookingIds } } });
      await prisma.booking.deleteMany({ where: { id: { in: bookingIds } } });
    }

    // 2. Delete sub-bookings (they have their own userId field)
    const tourBookings = await prisma.tourBooking.findMany({ where: { userId: id }, select: { id: true } });
    if (tourBookings.length > 0) {
      await prisma.tourTraveler.deleteMany({ where: { tourBookingId: { in: tourBookings.map(t => t.id) } } });
    }
    await prisma.tourBooking.deleteMany({ where: { userId: id } });
    await prisma.hotelBooking.deleteMany({ where: { userId: id } });
    await prisma.carHireBooking.deleteMany({ where: { userId: id } });

    // 3. Delete other user-owned records
    await prisma.payment.deleteMany({ where: { userId: id } });
    await prisma.review.deleteMany({ where: { userId: id } });
    await prisma.notification.deleteMany({ where: { userId: id } });
    await prisma.session.deleteMany({ where: { userId: id } });
    await prisma.wishlistItem.deleteMany({ where: { userId: id } });
    await prisma.activityLog.deleteMany({ where: { userId: id } });

    // 4. Delete inquiry messages (uses senderId), then inquiries
    await prisma.inquiryMessage.deleteMany({ where: { senderId: id } });
    const inquiries = await prisma.inquiry.findMany({ where: { userId: id }, select: { id: true } });
    if (inquiries.length > 0) {
      await prisma.inquiryMessage.deleteMany({ where: { inquiryId: { in: inquiries.map(i => i.id) } } });
    }
    await prisma.inquiry.deleteMany({ where: { userId: id } });

    // 5. Delete appointments (as client or consultant)
    await prisma.appointment.deleteMany({ where: { OR: [{ clientId: id }, { consultantId: id }] } });

    // 6. Delete staff profile (permissions cascade via schema onDelete)
    await prisma.staffProfile.deleteMany({ where: { userId: id } });

    // 7. Finally delete the user
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting staff:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function createStaff(data: { firstName: string, lastName: string, email: string, role: string }) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      include: { staffProfile: true }
    });

    if (existingUser) {
      if (existingUser.staffProfile) {
        return { success: false, error: "A staff member with this email already exists." };
      }

      // User exists but is not a staff member, upgrade them
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: data.role as Role,
          staffProfile: {
            upsert: {
              update: {
                isActive: true,
                jobTitle: data.role === 'CONSULTANT' ? 'Travel Consultant' : 'Staff Member'
              },
              create: {
                isActive: true,
                jobTitle: data.role === 'CONSULTANT' ? 'Travel Consultant' : 'Staff Member'
              }
            }
          }
        },
        include: { staffProfile: true }
      });
      return { success: true, user: JSON.parse(JSON.stringify(updatedUser)), message: "Existing user upgraded to staff." };
    }

    // New user creation
    const user = await prisma.user.create({
      data: {
        clerkId: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role as Role,
        staffProfile: {
          create: {
            isActive: true,
            jobTitle: data.role === 'CONSULTANT' ? 'Travel Consultant' : 'Staff Member'
          }
        }
      },
      include: { staffProfile: true }
    });
    return { success: true, user: JSON.parse(JSON.stringify(user)) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating staff:", error);
    return { success: false, error: message };
  }
}

export async function getStaffWithPermissions(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        staffProfile: {
          include: {
            permissions: true
          }
        }
      }
    });
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error fetching staff permissions:", error);
    return null;
  }
}

export async function updateStaffPermissions(staffProfileId: string, permissions: unknown) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const permsMap = permissions as Record<string, any>;
    const modules = Object.keys(permsMap);
    
    for (const mod of modules) {
      const perms = permsMap[mod];
      const upsertData = {
        canView: !!perms.view,
        canCreate: !!perms.create,
        canEdit: !!perms.edit,
        canDelete: !!perms.delete,
        canExport: !!perms.export
      };

      await prisma.staffPermission.upsert({
        where: {
          staffProfileId_module: {
            staffProfileId,
            module: mod.toUpperCase()
          }
        },
        update: {
          ...upsertData
        },
        create: {
          staffProfileId,
          module: mod.toUpperCase(),
          ...upsertData
        }
      });
    }
    
    revalidatePath('/admin/staff');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating permissions:", error);
    return { success: false, error: message };
  }
}
