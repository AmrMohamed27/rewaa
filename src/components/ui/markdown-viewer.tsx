import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  content: string;
  className?: string;
  isRtl?: boolean;
}

export function MarkdownViewer({ content, className, isRtl = false }: MarkdownViewerProps) {
  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "font-[inherit]",
        "prose max-w-none p-0",
        "prose-pre:p-0 prose-pre:bg-transparent prose-pre:m-0 prose-code:text-foreground",
        isRtl && "text-right",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
