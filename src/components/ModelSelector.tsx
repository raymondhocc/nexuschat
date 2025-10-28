import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChatStore } from '@/hooks/useChat';
import { MODELS } from '@/lib/chat';
export function ModelSelector() {
  const model = useChatStore((state) => state.model);
  const setModel = useChatStore((state) => state.setModel);
  const isLoading = useChatStore((state) => state.isLoading);
  const handleModelChange = (newModel: string) => {
    setModel(newModel);
  };
  return (
    <Select value={model} onValueChange={handleModelChange} disabled={isLoading}>
      <SelectTrigger className="w-full sm:w-[180px] text-xs sm:text-sm">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {MODELS.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            {m.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}