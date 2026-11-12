import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const SubscriptionSchema = z.object({
  endpoint: z.string().url().max(2048),
  keys: z.object({ p256dh: z.string().min(20).max(256), auth: z.string().min(10).max(128) }),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
  const parsed = SubscriptionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Data subscription tidak valid" }, { status: 400 });
  const { endpoint, keys } = parsed.data;
  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { userId: user.id, p256dh: keys.p256dh, auth: keys.auth },
    create: { endpoint, userId: user.id, p256dh: keys.p256dh, auth: keys.auth },
  });
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login diperlukan" }, { status: 401 });
  const parsed = z.object({ endpoint: z.string().url().max(2048) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Endpoint tidak valid" }, { status: 400 });
  await prisma.pushSubscription.deleteMany({ where: { endpoint: parsed.data.endpoint, userId: user.id } });
  return NextResponse.json({ success: true });
}
