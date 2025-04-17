import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

interface SessionState {
    id: string | null;
    setId: (id: string) => void;
    name: string | null;
    setName: (name: string) => void;
    token: string | null;
    setToken: (token: string) => void;
    setAll: (s: { name: string; id: string; token: string; }) => void;
    clearAll: () => void;
}

export const useSessionStore = create<SessionState>()(
    devtools(
        persist(
            (set) => ({
                token: null,
                setToken: (token) => set({ token }),
                id: null,
                setId: (id) => set({ id }),
                name: null,
                setName: (name) => set({ name }),
                setAll: ({ name, id, token }) => set({ name, id, token }),
                clearAll: () => set({ token: null, id: null, name: null }),
            }),
            {
                name: 'session-storage', // name of the item in the storage (must be unique)
                storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
            },
        ),
    ),
)