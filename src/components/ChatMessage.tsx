import { FC, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';
import type { Message } from '../../worker/types';
interface ChatMessageProps {
  message: Message;
}
const ChatMessage: FC<ChatMessageProps> = memo(({ message }) => {
  const isAssistant = message.role === 'assistant';
  return (
    <div className={cn('flex items-start gap-4', !isAssistant && 'justify-end')}>
      {isAssistant && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
          <Bot className="h-5 w-5" />
        </div>
      )}
      <div
        className={cn(
          'flex-1 space-y-2 overflow-hidden px-1',
          !isAssistant && 'text-right'
        )}
      >
        <div
          className={cn(
            'prose prose-sm dark:prose-invert max-w-none break-words',
            'prose-p:leading-relaxed prose-pre:p-0',
            !isAssistant && 'items-end'
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');
                if (match) {
                  return (
                    <CodeBlock
                      key={Math.random()}
                      language={match[1]}
                      value={codeString}
                      {...props}
                    />
                  );
                }
                return (
                  <code className="not-prose text-sm font-mono bg-muted text-muted-foreground px-1 py-0.5 rounded-sm" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
      {!isAssistant && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
});
ChatMessage.displayName = 'ChatMessage';
export { ChatMessage };