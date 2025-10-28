import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { chatService, MODELS } from '@/lib/chat';
import type { Message } from '../../worker/types';
interface ChatState {
  messages: Message[];
  streamingMessage: string;
  isLoading: boolean;
  model: string;
}
interface ChatActions {
  setSession: (sessionId: string) => void;
  loadInitialMessages: (sessionId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  startNewChat: (sessionId: string) => void;
  setModel: (model: string) => void;
}
export const useChatStore = create<ChatState & ChatActions>()(
  immer((set, get) => ({
    messages: [],
    streamingMessage: '',
    isLoading: false,
    model: MODELS[0].id,
    setSession: (sessionId) => {
      chatService.switchSession(sessionId);
      set((state) => {
        state.messages = [];
        state.streamingMessage = '';
        state.isLoading = true;
      });
      get().loadInitialMessages(sessionId);
    },
    loadInitialMessages: async (sessionId) => {
      chatService.switchSession(sessionId);
      set({ isLoading: true });
      const response = await chatService.getMessages();
      if (response.success && response.data) {
        set((state) => {
          state.messages = response.data?.messages || [];
          state.model = response.data?.model || MODELS[0].id;
        });
      }
      set({ isLoading: false });
    },
    sendMessage: async (message) => {
      if (get().isLoading) return;
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        timestamp: Date.now()
      };
      set((state) => {
        state.isLoading = true;
        state.messages.push(userMessage);
        state.streamingMessage = '';
      });
      const finalMessage = await chatService.sendMessage(message, get().model, (chunk) => {
        set((state) => {
          state.streamingMessage += chunk;
        });
      });

      set((state) => {
        if (finalMessage?.success && finalMessage?.data) {
          const assistantMessage: Message = {
            id: finalMessage.data.id,
            role: 'assistant',
            content: state.streamingMessage,
            timestamp: finalMessage.data.timestamp
          };
          state.messages.push(assistantMessage);
        }
        state.isLoading = false;
        state.streamingMessage = '';
      });
    },
    startNewChat: (sessionId: string) => {
      chatService.switchSession(sessionId);
      set({
        messages: [],
        streamingMessage: '',
        isLoading: false
      });
    },
    setModel: async (model: string) => {
      set({ model });
      await chatService.updateModel(model);
    }
  }))
);
export const useChatMessages = () => useChatStore((state) => state.messages);
export const useChatIsLoading = () => useChatStore((state) => state.isLoading);
export const useStreamingMessage = () => useChatStore((state) => state.streamingMessage);
export const useChatActions = () => useChatStore.getState();