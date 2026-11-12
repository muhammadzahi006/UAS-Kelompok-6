"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";

function decodeKey(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = atob(base64);
  return Uint8Array.from(bytes, (character) => character.charCodeAt(0));
}

export default function PushNotificationButton() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const enable = async () => {
    setBusy(true);
    setMessage("");
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) throw new Error("Browser ini belum mendukung Web Push.");
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY belum dikonfigurasi.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Izin notifikasi belum diberikan.");
      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(publicKey) });
      const response = await fetch("/api/notifications/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });
      if (!response.ok) throw new Error((await response.json()).error || "Gagal menyimpan subscription.");
      setMessage("Notifikasi berhasil diaktifkan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Notifikasi gagal diaktifkan.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={enable} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-50">
        <BellRing className="h-4 w-4" />{busy ? "Mengaktifkan..." : "Aktifkan Notifikasi Web Push"}
      </button>
      {message && <span role="status" className="text-sm text-slate-600">{message}</span>}
    </div>
  );
}
