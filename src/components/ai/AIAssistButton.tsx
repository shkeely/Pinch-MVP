import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AIAssistButtonProps {
  currentText: string;
  onAIGenerate: (text: string) => void;
  context?: string;
}

export function AIAssistButton({ currentText, onAIGenerate, context }: AIAssistButtonProps) {
  const hasText = currentText.trim().length > 0;

  const handleGenerateDraft = () => {
    // Mock AI generation - replace with real AI call when Cloud is enabled
    const mockDraft = context 
      ? `Hi everyone! ${context} We've made arrangements to ensure everyone has a great time. Looking forward to celebrating with you all!`
      : "Hi everyone! Thank you for your question. Let me provide you with the information you need. We're excited to celebrate with you!";
    onAIGenerate(mockDraft);
  };

  const handleRewrite = () => {
    // Mock AI rewrite
    const mockRewrite = currentText
      .replace(/Hi/g, "Hello")
      .replace(/!/g, ".")
      + " Please let us know if you have any other questions.";
    onAIGenerate(mockRewrite);
  };

  const handleImprove = () => {
    // Mock AI improve
    const improved = `${currentText}\n\nWe truly appreciate your understanding and can't wait to see you there! Feel free to reach out if you need anything else.`;
    onAIGenerate(improved);
  };

  const handleMakeFriendlier = () => {
    const friendly = currentText + " 😊 We're so excited to celebrate with you!";
    onAIGenerate(friendly);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-700"
        >
          <Sparkles className="w-4 h-4" />
          AI Assist
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {!hasText ? (
          <DropdownMenuItem onClick={handleGenerateDraft} className="cursor-pointer">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate draft
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem onClick={handleRewrite} className="cursor-pointer">
              <Sparkles className="w-4 h-4 mr-2" />
              Rewrite
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImprove} className="cursor-pointer">
              <Sparkles className="w-4 h-4 mr-2" />
              Improve & expand
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMakeFriendlier} className="cursor-pointer">
              <Sparkles className="w-4 h-4 mr-2" />
              Make friendlier
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
