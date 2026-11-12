ALTER TABLE public."NotificationQueue"
  ADD COLUMN IF NOT EXISTS "availableAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX IF NOT EXISTS "NotificationQueue_status_availableAt_idx"
  ON public."NotificationQueue"("status", "availableAt");
