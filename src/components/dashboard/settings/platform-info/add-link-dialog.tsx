"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (link: { label: string; url: string }) => void;
}

export function AddLinkDialog({ open, onOpenChange, onAdd }: AddLinkDialogProps) {
  const t = useTranslations("settings.platformInfo.communication.addLinkDialog");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) {
      setError(t("validationRequired"));
      return;
    }
    onAdd({ label: label.trim(), url: url.trim() });
    setLabel("");
    setUrl("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <Link className="size-4" />
            </div>
            <DialogTitle>{t("title")}</DialogTitle>
          </div>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && <p className="text-xs text-destructive font-medium">{error}</p>}

          <div className="space-y-1.5">
            <Label htmlFor="link-label">{t("labelField")}</Label>
            <Input
              id="link-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t("labelPlaceholder")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="link-url">{t("urlField")}</Label>
            <Input
              id="link-url"
              type="url"
              dir="ltr"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t("urlPlaceholder")}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setError("");
              }}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" className="gap-1.5">
              <Plus className="size-4" />
              <span>{t("confirm")}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
