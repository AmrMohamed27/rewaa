"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ReorderableItem {
  id: string;
  title: string;
}

interface ArrangeSectionsDialogProps<T extends ReorderableItem> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: T[];
  onReorder: (newItems: T[]) => void;
  title?: string;
  subtitle?: string;
  emptyText?: string;
  doneText?: string;
}

export function ArrangeSectionsDialog<T extends ReorderableItem>({
  open,
  onOpenChange,
  items,
  onReorder,
  title,
  subtitle,
  emptyText,
  doneText,
}: ArrangeSectionsDialogProps<T>) {
  const t = useTranslations("courses.new.step2.arrangeDialog");

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const newArr = [...items];
    const [movedItem] = newArr.splice(index, 1);
    newArr.splice(targetIdx, 0, movedItem);
    onReorder(newArr);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title || t("title")}</DialogTitle>
          <DialogDescription>{subtitle || t("subtitle")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2 max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground italic text-center py-4">
              {emptyText || t("noSections")}
            </p>
          ) : (
            items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/40"
              >
                <span className="text-sm font-medium text-foreground">
                  {idx + 1}. {item.title}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, "up")}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    disabled={idx === items.length - 1}
                    onClick={() => handleMove(idx, "down")}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            {doneText || t("done")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
