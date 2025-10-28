import { useEffect, useCallback } from 'react';
import { PanelLeft, Menu } from 'lucide-react';
import { ChatView } from '@/components/ChatView';
import { ChatInput } from '@/components/ChatInput';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ModelSelector } from '@/components/ModelSelector';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSessionStore, useCurrentSessionId } from '@/hooks/useSession';
import { useChatStore } from '@/hooks/useChat';
export function HomePage() {
  const isMobile = useIsMobile();
  const isSidebarOpen = useSessionStore(state => state.isSidebarOpen);
  const toggleSidebar = useSessionStore(state => state.toggleSidebar);
  const setSidebarOpen = useSessionStore(state => state.setSidebarOpen);
  const currentSessionId = useCurrentSessionId();
  const fetchSessions = useSessionStore(state => state.fetchSessions);
  const setSession = useChatStore(state => state.setSession);
  // Fetch initial sessions on mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);
  // Sync chat store with current session
  useEffect(() => {
    if (currentSessionId) {
      setSession(currentSessionId);
    }
  }, [currentSessionId, setSession]);
  // Handle responsive sidebar state
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [isMobile, setSidebarOpen]);
  const sidebar = <ChatSidebar />;
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {!isMobile && isSidebarOpen && (
        <div className="w-[280px] flex-shrink-0">
          {sidebar}
        </div>
      )}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between p-2 sm:p-4 border-b">
          <div className="flex items-center gap-2">
            {isMobile ? (
              <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px]">
                  {sidebar}
                </SheetContent>
              </Sheet>
            ) : (
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <PanelLeft size={20} />
              </Button>
            )}
            <h1 className="text-lg font-semibold tracking-tight hidden sm:block">NexusChat</h1>
          </div>
          <div className="flex items-center gap-2">
            <ModelSelector />
          </div>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatView />
          <ChatInput />
        </main>
        <footer className="text-center p-2 text-xs text-muted-foreground border-t">
          <p>
            AI interactions may have request limits. Built with ❤️ at Cloudflare.
          </p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
}