"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRef, type ForwardedRef, useEffect, useImperativeHandle } from "react";
import {
  MDXEditor,
  toolbarPlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor";
import { cn } from "@/lib/utils";
import "@mdxeditor/editor/style.css";

export default function InitializedMDXEditor({
  className,
  contentEditableClassName,
  editorRef,
  markdown,
  ...props
}: { editorRef?: ForwardedRef<MDXEditorMethods> } & MDXEditorProps) {
  // 1. Fetch the Editor namespace translations and current locale
  const t = useTranslations("editor");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const internalRef = useRef<MDXEditorMethods>(null);

  useImperativeHandle(editorRef, () => internalRef.current!, []);

  // Sync editor markdown when value changes externally (e.g. initial course load)
  useEffect(() => {
    if (internalRef.current) {
      const currentVal = internalRef.current.getMarkdown();
      if (currentVal !== markdown) {
        internalRef.current.setMarkdown(markdown || "");
      }
    }
  }, [markdown]);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="w-full min-h-32 border rounded-md overflow-hidden bg-background"
    >
      <MDXEditor
        markdown={markdown}
        className={cn("w-full h-full", className)}
        contentEditableClassName={cn(
          "prose max-w-none p-3 font-[inherit]!",
          // 2. Force text alignment for RTL languages if Tailwind's typography plugin interferes
          isRtl && "text-right",
          contentEditableClassName,
        )}
        // 4. Hook up next-intl
        translation={(key, defaultValue, interpolations) => {
          if (t.has(key)) {
            return t(key, interpolations);
          }
          return defaultValue;
        }}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <ListsToggle />
                <CreateLink />
              </>
            ),
          }),
        ]}
        {...props}
        ref={internalRef}
      />
    </div>
  );
}
