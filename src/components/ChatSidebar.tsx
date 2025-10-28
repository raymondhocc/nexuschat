import { useState, useRef, useEffect } from 'react';
import { Plus, MessageSquare, Trash2, Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSessions, useCurrentSessionId, useSessionStore } from '@/hooks/useSession';
import { useChatStore } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
export function ChatSidebar() {
  const sessions = useSessions();
  const currentSessionId = useCurrentSessionId();
  const { createSession, switchSession, deleteSession, updateSessionTitle } = useSessionStore.getState();
  const startNewChat = useChatStore((state) => state.startNewChat);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editingSessionId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingSessionId]);
  const handleNewChat = async () => {
    const newSessionId = await createSession();
    startNewChat(newSessionId);
  };
  const handleSwitch = (sessionId: string) => {
    if (editingSessionId === sessionId) return;
    switchSession(sessionId);
  };
  const handleRename = () => {
    if (editingSessionId && newTitle.trim()) {
      updateSessionTitle(editingSessionId, newTitle.trim());
    }
    setEditingSessionId(null);
    setNewTitle('');
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditingSessionId(null);
      setNewTitle('');
    }
  };
  return (
    <div className="flex flex-col h-full bg-muted/50 border-r">
      <div className="p-2 border-b">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={handleNewChat}>
          <Plus size={16} />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                'group flex items-center justify-between p-2 rounded-md cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground',
                currentSessionId === session.id && 'bg-accent text-accent-foreground'
              )}
              onClick={() => handleSwitch(session.id)}
            >
              <div className="flex items-center gap-2 truncate flex-1">
                <MessageSquare size={14} />
                {editingSessionId === session.id ? (
                  <Input
                    ref={inputRef}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={handleRename}
                    onKeyDown={handleKeyDown}
                    className="h-6 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate">{session.title}</span>
                )}
              </div>
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                {editingSessionId === session.id ? (
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleRename(); }}>
                    <Check size={14} />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSessionId(session.id);
                        setNewTitle(session.title);
                      }}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-2 border-t text-xs text-muted-foreground">
        <p>NexusChat by Cloudflare</p>
      </div>
    </div>
  );
}