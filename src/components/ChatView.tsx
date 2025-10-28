import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Loader2, Zap, Code, Compass } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/components/ChatMessage';
import { useChatMessages, useStreamingMessage, useChatIsLoading, useChatStore } from '@/hooks/useChat';
import { useSessionStore } from '@/hooks/useSession';
const suggestedPrompts = [
  { icon: Zap, text: 'Explain quantum computing in simple terms' },
  { icon: Code, text: 'Write a python script to scrape a website' },
  { icon: Compass, text: 'What are some fun things to do in Tokyo?' },
];
export function ChatView() {
  const messages = useChatMessages();
  const streamingMessage = useStreamingMessage();
  const isLoading = useChatIsLoading();
  const { sendMessage, startNewChat } = useChatStore(state => ({
    sendMessage: state.sendMessage,
    startNewChat: state.startNewChat,
  }));
  const createSession = useSessionStore(state => state.createSession);
  const viewportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);
  const handlePromptClick = async (prompt: string) => {
    const newSessionId = await createSession(prompt);
    startNewChat(newSessionId);
    await sendMessage(prompt);
  };
  const hasMessages = messages.length > 0;
  return (
    <div className="relative flex-1">
      <ScrollArea className="absolute inset-0">
        <div className="p-4 sm:p-6" ref={viewportRef}>
          <AnimatePresence>
            {hasMessages ? (
              messages.map((msg, index) => (
                <motion.div
                  key={msg.id || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="mb-6"
                >
                  <ChatMessage message={msg} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"
              >
                <div className="mb-4 rounded-full bg-primary p-4 border">
                  <Bot size={32} className="text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">How can I help you today?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full">
                  {suggestedPrompts.map((prompt, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="h-auto text-left p-4 flex flex-col items-start gap-2 hover:bg-accent/50"
                      onClick={() => handlePromptClick(prompt.text)}
                    >
                      <prompt.icon size={16} className="text-foreground/80" />
                      <span className="text-sm text-foreground whitespace-normal">{prompt.text}</span>
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {streamingMessage && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <ChatMessage
                message={{
                  id: 'streaming',
                  role: 'assistant',
                  content: streamingMessage,
                  timestamp: Date.now(),
                }}
              />
            </motion.div>
          )}
          {isLoading && !streamingMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Thinking...</span>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}