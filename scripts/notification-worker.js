const webpush = require("web-push");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || "mailto:admin@example.com";

if (!publicKey || !privateKey) {
  throw new Error("Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY before starting the worker.");
}
webpush.setVapidDetails(subject, publicKey, privateKey);

async function claimJob() {
  return prisma.$transaction(async (tx) => {
    const jobs = await tx.$queryRaw`
      SELECT * FROM public."NotificationQueue"
      WHERE ("status" = 'PENDING' AND "availableAt" <= NOW())
         OR ("status" = 'PROCESSING' AND "availableAt" <= NOW())
      ORDER BY "createdAt" ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1`;
    const job = jobs[0];
    if (!job) return null;
    await tx.$executeRaw`
      UPDATE public."NotificationQueue"
      SET "status" = 'PROCESSING', "attempts" = "attempts" + 1,
          "availableAt" = ${new Date(Date.now() + 5 * 60_000)}
      WHERE "id" = ${job.id}`;
    return { ...job, attempts: job.attempts + 1 };
  });
}

async function processOne() {
  const job = await claimJob();
  if (!job) return false;
  try {
    if (!job.targetUserId) throw new Error("Job tidak memiliki target pengguna.");
    const subscriptions = await prisma.pushSubscription.findMany({ where: { userId: job.targetUserId } });
    const payload = JSON.stringify({ title: job.title, body: job.body, url: job.url || "/" });
    const results = await Promise.allSettled(subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification({ endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } }, payload);
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: subscription.id } });
          return;
        }
        throw error;
      }
    }));
    const failure = results.find((result) => result.status === "rejected");
    if (failure) throw failure.reason;
    await prisma.notificationQueue.update({ where: { id: job.id }, data: { status: "COMPLETED", processedAt: new Date(), lastError: null } });
  } catch (error) {
    const terminal = job.attempts >= job.maxAttempts;
    const delay = Math.min(60, 2 ** job.attempts) * 60_000;
    await prisma.$executeRaw`
      UPDATE public."NotificationQueue"
      SET "status" = ${terminal ? "FAILED" : "PENDING"},
          "availableAt" = ${terminal ? new Date() : new Date(Date.now() + delay)},
          "lastError" = ${String(error?.message || error).slice(0, 4000)}
      WHERE "id" = ${job.id}`;
    console.error(`Notification job ${job.id} failed (${job.attempts}/${job.maxAttempts}):`, error?.message || error);
  }
  return true;
}

async function main() {
  console.log("Notification worker is running.");
  while (true) {
    try {
      const processed = await processOne();
      if (!processed) await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
      console.error("Worker loop error:", error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
