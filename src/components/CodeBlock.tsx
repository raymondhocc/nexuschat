import { FC, memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Bot } from 'lucide-react';
import { useCopyToClipboard } from 'react-use';
import { Button } from '@/components/ui/button';
interface CodeBlockProps {
  language: string;
  value: string;
}
const CodeBlock: FC<CodeBlockProps> = memo(({ language, value }) => {
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const handleCopy = () => {
    copyToClipboard(value);
  };
  return (
    <div className="relative text-sm bg-gray-800 rounded-lg font-mono">
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-300 bg-gray-900/50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot size={14} />
          <span>{language || 'code'}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-300 hover:bg-gray-700 hover:text-white" onClick={handleCopy}>
          {copyState.value ? <Check size={14} /> : <Copy size={14} />}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '1rem', background: 'transparent', borderRadius: '0 0 0.5rem 0.5rem' }}
        codeTagProps={{ style: { fontFamily: 'inherit' } }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
});
CodeBlock.displayName = 'CodeBlock';
export { CodeBlock };