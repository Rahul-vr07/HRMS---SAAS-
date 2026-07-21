import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  companyId: string;
  role?: { name: string; permissions: string[] };
  employee?: { id: string };
}

interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  currency: string;
}

interface AuthState {
  user: User | null;
  company: Company | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (data: { user: User; company: Company; accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      company: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        set({
          user: data.user,
          company: data.company,
          accessToken: data.accessToken,
          isAuthenticated: true,
        });
      },
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, company: null, accessToken: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user }),
    }),
    { name: 'nexus-auth' },
  ),
);

interface UIState {
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  aiOpen: boolean;
  toggleSidebar: () => void;
  setCommandOpen: (open: boolean) => void;
  setAiOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandOpen: false,
  aiOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCommandOpen: (open) => set({ commandOpen: open }),
  setAiOpen: (open) => set({ aiOpen: open }),
}));
