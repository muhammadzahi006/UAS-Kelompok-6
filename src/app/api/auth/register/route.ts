import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan login." },
        { status: 400 }
      );
    }

    // Role validation: default is MURID, can choose PENGAJAR, ADMIN is restricted
    let assignedRole: Role = Role.MURID;
    if (role === "PENGAJAR") {
      assignedRole = Role.PENGAJAR;
    } else if (role === "ADMIN") {
      // Allow initial admin creation if no admin exists in DB
      const adminCount = await prisma.user.count({
        where: { role: Role.ADMIN },
      });
      if (adminCount === 0) {
        assignedRole = Role.ADMIN;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: assignedRole,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          name
        )}`,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        message: "Akun berhasil dibuat! Silakan masuk.",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat pendaftaran. Coba lagi nanti." },
      { status: 500 }
    );
  }
}

