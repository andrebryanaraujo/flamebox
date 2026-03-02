import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subcategorySchema } from "@/lib/validations";

// POST /api/subcategories — create a subcategory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = subcategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const subcategory = await prisma.subcategory.create({
      data: parsed.data,
    });

    return NextResponse.json(subcategory, { status: 201 });
  } catch (error) {
    console.error("POST /api/subcategories error:", error);
    return NextResponse.json({ error: "Erro ao criar subcategoria" }, { status: 500 });
  }
}
