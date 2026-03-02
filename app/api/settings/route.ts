import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/settings — get current site settings
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: "default" },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Erro ao buscar configurações" }, { status: 500 });
  }
}

// PUT /api/settings — update site settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Only pick valid fields to avoid Prisma errors
    const data = {
      storeName: body.storeName ?? "Minha Loja",
      storeDescription: body.storeDescription ?? "",
      logoIcon: body.logoIcon ?? "🏪",
      primaryColor: body.primaryColor ?? "#7c3aed",
      secondaryColor: body.secondaryColor ?? "#6d28d9",
      accentColor: body.accentColor ?? "#a78bfa",
      contactEmail: body.contactEmail ?? "",
      pixKey: body.pixKey ?? "",
      pixBeneficiary: body.pixBeneficiary ?? "",
      backgroundImage: body.backgroundImage ?? "",
      bannerUrl: body.bannerUrl ?? "",
      logoUrl: body.logoUrl ?? "",
      faviconUrl: body.faviconUrl ?? "",
      ogImageUrl: body.ogImageUrl ?? "",
      instagramUrl: body.instagramUrl ?? "",
      whatsappUrl: body.whatsappUrl ?? "",
      discordUrl: body.discordUrl ?? "",
      tiktokUrl: body.tiktokUrl ?? "",
    };

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: data,
      create: { id: "default", ...data },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ error: "Erro ao salvar configurações" }, { status: 500 });
  }
}
