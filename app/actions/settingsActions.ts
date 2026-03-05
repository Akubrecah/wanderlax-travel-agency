"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGeneralSettings() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "general_settings" },
    });
    
    if (setting && setting.value) {
      return setting.value as {
        siteName: string;
        siteImage: string;
        language: string;
        timeZone: string;
        currency: string;
        contactEmail?: string;
        contactPhone?: string;
        whatsappUrl?: string;
        instagramUrl?: string;
        facebookUrl?: string;
        xUrl?: string;
        telegramUrl?: string;
      };
    }
    
    // Default settings
    return {
      siteName: "Wanderlax",
      siteImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
      language: "en",
      timeZone: "UTC",
      currency: "USD",
      contactEmail: "info@wanderlax.com",
      contactPhone: "+1 234 567 890",
      whatsappUrl: "",
      instagramUrl: "",
      facebookUrl: "",
      xUrl: "",
      telegramUrl: "",
    };
  } catch (error) {
    console.error("Error fetching general settings:", error);
    return null;
  }
}

export async function updateGeneralSettings(data: Record<string, string | number | boolean | null>) {
  try {
    const setting = await prisma.siteSetting.upsert({
      where: { key: "general_settings" },
      update: {
        value: data,
      },
      create: {
        key: "general_settings",
        value: data,
        description: "General Site Settings",
      },
    });
    
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    
    return { success: true, data: setting.value };
  } catch (error) {
    console.error("Error updating general settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
