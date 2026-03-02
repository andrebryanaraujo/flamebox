import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/subcategories/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug } = body;

    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
      },
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("PUT /api/subcategories/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar subcategoria" }, { status: 500 });
  }
}

// DELETE /api/subcategories/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.subcategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/subcategories/[id] error:", error);
    return NextResponse.json({ error: "Erro ao deletar subcategoria" }, { status: 500 });
  }
}
