import { create } from "zustand";
import type { Session } from "@/lib/types";

type AuthUser = {
  id: number | string;
  name: string;
  username?: string | null;
  email: string;
} | null;

type AppStore = {
  ready: boolean;
  session: Session | null;
  hydrate: (user: AuthUser) => void;
  logout: () => void;
};

function toSession(user: AuthUser): Session | null {
  if (!user) return null;
  return {
    userId: String(user.id),
    username: user.username || user.email,
    name: user.name,
    email: user.email,
  };
}

export const useAppStore = create<AppStore>((set) => ({
  ready: false,
  session: null,
  hydrate: (user) => set({ ready: true, session: toSession(user) }),
  logout: () => set({ session: null }),
}));