import { useState, useRef, useEffect } from 'react';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatIsLoading, useChatStore } from '@/hooks/useChat';
import { useCurrentSessionId, useSessionStore } from '@/hooks/useSession';
export function ChatInput() {
  const [input, setInput] = useState('');
  const isLoading = useChatIsLoading();
  const { sendMessage, startNewChat } = useChatStore((state) => ({
    sendMessage: state.sendMessage,
    startNewChat: state.startNewChat,
  }));
  const createSession = useSessionStore((state) => state.createSession);
  const currentSessionId = useCurrentSessionId();
  const messages = useChatStore((state) => state.messages);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;
    setInput('');
    // If this is the first message in a new session, create the session first
    if (messages.length === 0) {
      const newSessionId = await createSession(trimmedInput);
      startNewChat(newSessionId);
      sendMessage(trimmedInput);
    } else {
      sendMessage(trimmedInput);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2 p-4 border-t bg-background"
    >
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask NexusChat anything..."
        className="flex-1 resize-none max-h-48 min-h-[44px] pr-12"
        rows={1}
        disabled={isLoading || !currentSessionId}
        aria-label="Chat input"
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-6 bottom-6 h-8 w-8"
        disabled={!input.trim() || isLoading || !currentSessionId}
        aria-label="Send message"
      >
        <SendHorizonal size={16} />
      </Button>
    </form>
  );
}