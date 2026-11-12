import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, syncProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const ProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  role: z.enum(["MURID", "PENGAJAR"]).optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Profil belum tersedia" }, { status: 404 });
  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, image: user.avatar },
  });
}

export async function POST(request: Request) {
  const parsed = ProfileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Data profil tidak valid" }, { status: 400 });
  }
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email || !data.user.email_confirmed_at) {
    return NextResponse.json({ error: "Verifikasi email diperlukan" }, { status: 401 });
  }

  const metadata = {
    ...data.user.user_metadata,
    ...(parsed.data.name ? { full_name: parsed.data.name } : {}),
    ...(parsed.data.role ? { role: parsed.data.role } : {}),
  };
  const profile = await syncProfile({ ...data.user, user_metadata: metadata });
  if (!profile) {
    return NextResponse.json({ error: "Email ini sudah terhubung ke akun lain" }, { status: 409 });
  }
  return NextResponse.json({
    user: { id: profile.id, name: profile.name, email: profile.email, role: profile.role, image: profile.avatar },
  });
}
