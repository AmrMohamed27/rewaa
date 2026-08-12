import { cn } from "@/lib/utils";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  codeBlockPlugin, // <-- 1. Import the codeBlockPlugin
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

interface MarkdownViewerProps {
  content: string;
  className?: string;
  isRtl?: boolean;
}

export function MarkdownViewer({ content, className, isRtl = false }: MarkdownViewerProps) {
  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      <MDXEditor
        key={content}
        markdown={content}
        readOnly={true}
        className={cn("font-[inherit]", className)}
        contentEditableClassName={cn(
          "prose max-w-none p-0",
          // 2. Add these two classes to hide Tailwind's auto-generated backticks
          "prose-code:before:content-none prose-code:after:content-none",
          isRtl && "text-right",
        )}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          codeBlockPlugin(), // <-- 3. Add it to the plugins array
        ]}
      />
    </div>
  );
}
