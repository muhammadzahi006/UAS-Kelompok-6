import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function syncProfile(authUser: {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  user_metadata?: Record<string, unknown>;
}) {
  if (!authUser.email || !authUser.email_confirmed_at) return null;

  const existing = await prisma.user.findUnique({ where: { email: authUser.email } });
  if (existing) {
    if (existing.authUserId && existing.authUserId !== authUser.id) return null;
    return prisma.user.update({
      where: { id: existing.id },
      data: { authUserId: authUser.id },
    });
  }

  const metadata = authUser.user_metadata ?? {};
  const requestedRole = metadata.role === "PENGAJAR" ? Role.PENGAJAR : Role.MURID;
  const name = typeof metadata.full_name === "string" ? metadata.full_name.trim() : "";
  if (!name) return null;

  return prisma.user.upsert({
    where: { authUserId: authUser.id },
    update: {},
    create: {
      authUserId: authUser.id,
      name,
      email: authUser.email.toLowerCase(),
      role: requestedRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    },
  });
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;
  return syncProfile(data.user);
}
