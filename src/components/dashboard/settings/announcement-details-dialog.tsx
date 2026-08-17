"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { ExternalLink, Megaphone, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownViewer } from "@/components/ui/markdown-viewer";
import { AnnouncementItem } from "@/types/settings";

interface AnnouncementDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: AnnouncementItem | null;
}

export function AnnouncementDetailsDialog({
  open,
  onOpenChange,
  announcement,
}: AnnouncementDetailsDialogProps) {
  const t = useTranslations("settings.announcements.detailsDialog");

  const locale = useLocale();
  const isRtl = locale === "ar";
  if (!announcement) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Banner Cover Image */}
        {announcement.coverImage ? (
          <div className="relative w-full aspect-video bg-muted border-b overflow-hidden">
            <Image
              src={announcement.coverImage}
              alt={announcement.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-full aspect-3/1 bg-primary/10 border-b flex items-center justify-center text-primary">
            <Megaphone className="size-12 opacity-40" />
          </div>
        )}

        <div className="p-6 space-y-4">
          <DialogHeader className="space-y-2 text-start">
            <div className="flex items-center gap-2">
              <Badge
                variant={announcement.active ? "default" : "secondary"}
                className={
                  announcement.active
                    ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30 gap-1"
                    : "gap-1 text-muted-foreground"
                }
              >
                {announcement.active ? (
                  <>
                    <CheckCircle className="size-3" />
                    <span>{t("active")}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-3" />
                    <span>{t("inactive")}</span>
                  </>
                )}
              </Badge>
            </div>
            <DialogTitle className="text-xl font-bold leading-snug">
              {announcement.title}
            </DialogTitle>
          </DialogHeader>

          {/* Description Content */}
          <div className="prose max-w-none text-sm text-foreground/90 leading-relaxed bg-muted/20 border rounded-lg p-4">
            <MarkdownViewer content={announcement.description} isRtl={isRtl} />
          </div>

          {/* External URL Link if present */}
          {announcement.url && (
            <div className="pt-2 flex items-center justify-between border-t gap-3">
              <span className="text-xs text-muted-foreground font-medium">{t("link")}:</span>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs font-mono max-w-full truncate"
                asChild
              >
                <a href={announcement.url} target="_blank" rel="noopener noreferrer">
                  <span className="truncate">{announcement.url}</span>
                  <ExternalLink className="size-3.5 shrink-0" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
