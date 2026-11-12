"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/browser";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PENGAJAR" | "MURID";
  image?: string | null;
};
type AuthContextValue = { user: AppUser | null; loading: boolean; signOut: () => Promise<void> };
const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, signOut: async () => {} });

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadProfile = useCallback(async (session: Session | null) => {
    if (!session) {
      setUser(null);
      setLoading(false);
      return;
    }
    const response = await fetch("/api/auth/profile", { cache: "no-store" });
    if (response.ok) setUser((await response.json()).user as AppUser);
    else setUser(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) void loadProfile(data.session);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) void loadProfile(session);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [loadProfile, supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>;
}
