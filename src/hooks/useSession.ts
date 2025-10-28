import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { chatService, generateSessionTitle } from '@/lib/chat';
import type { SessionInfo } from '../../worker/types';
interface SessionState {
  sessions: SessionInfo[];
  currentSessionId: string | null;
  isSidebarOpen: boolean;
  isLoading: boolean;
}
interface SessionActions {
  fetchSessions: () => Promise<void>;
  createSession: (firstMessage?: string) => Promise<string>;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => Promise<void>;
  updateSessionTitle: (sessionId: string, newTitle: string) => Promise<void>;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}
export const useSessionStore = create<SessionState & SessionActions>()(
  immer((set, get) => ({
    sessions: [],
    currentSessionId: null,
    isSidebarOpen: true,
    isLoading: false,
    fetchSessions: async () => {
      set({ isLoading: true });
      const response = await chatService.listSessions();
      if (response.success && response.data) {
        set((state) => {
          state.sessions = response.data || [];
          if (!get().currentSessionId && state.sessions.length > 0) {
            state.currentSessionId = state.sessions[0].id;
          } else if (state.sessions.length === 0) {
            get().createSession();
          }
        });
      }
      set({ isLoading: false });
    },
    createSession: async (firstMessage?: string) => {
      const originalSessions = get().sessions;
      const originalCurrentSessionId = get().currentSessionId;
      const newSessionId = crypto.randomUUID();
      const title = generateSessionTitle(firstMessage);
      const newSession: SessionInfo = {
        id: newSessionId,
        title,
        createdAt: Date.now(),
        lastActive: Date.now(),
      };
      set(state => {
        state.sessions.unshift(newSession);
        state.currentSessionId = newSessionId;
      });
      const response = await chatService.createSession(title, newSessionId, firstMessage);
      if (!response.success) {
        set(state => {
          state.sessions = originalSessions;
          state.currentSessionId = originalCurrentSessionId;
        });
        console.error("Failed to create session");
        throw new Error("Failed to create session");
      }
      return newSessionId;
    },
    switchSession: (sessionId: string) => {
      if (get().currentSessionId === sessionId) return;
      set({ currentSessionId: sessionId });
    },
    deleteSession: async (sessionId: string) => {
      const originalSessions = get().sessions;
      set(state => {
        state.sessions = state.sessions.filter(s => s.id !== sessionId);
        if (state.currentSessionId === sessionId) {
          state.currentSessionId = state.sessions[0]?.id || null;
        }
      });
      const response = await chatService.deleteSession(sessionId);
      if (!response.success) {
        set({ sessions: originalSessions });
        console.error("Failed to delete session");
      }
      if (get().currentSessionId === null) {
        await get().createSession();
      }
    },
    updateSessionTitle: async (sessionId: string, newTitle: string) => {
      const sessionIndex = get().sessions.findIndex(s => s.id === sessionId);
      if (sessionIndex === -1) return;
      const originalTitle = get().sessions[sessionIndex].title;
      if (originalTitle === newTitle) return;
      set(state => {
        state.sessions[sessionIndex].title = newTitle;
      });
      const response = await chatService.updateSessionTitle(sessionId, newTitle);
      if (!response.success) {
        set(state => {
          state.sessions[sessionIndex].title = originalTitle;
        });
        console.error("Failed to update session title");
      }
    },
    toggleSidebar: () => {
      set(state => {
        state.isSidebarOpen = !state.isSidebarOpen;
      });
    },
    setSidebarOpen: (isOpen: boolean) => {
      set({ isSidebarOpen: isOpen });
    }
  }))
);
export const useSessions = () => useSessionStore((state) => state.sessions);
export const useCurrentSessionId = () => useSessionStore((state) => state.currentSessionId);
export const useSessionActions = () => useSessionStore((state) => ({
    createSession: state.createSession,
    switchSession: state.switchSession,
    deleteSession: state.deleteSession,
    fetchSessions: state.fetchSessions,
    updateSessionTitle: state.updateSessionTitle,
}));
export const useSidebarState = () => useSessionStore((state) => ({
    isSidebarOpen: state.isSidebarOpen,
    toggleSidebar: state.toggleSidebar,
    setSidebarOpen: state.setSidebarOpen,
}));