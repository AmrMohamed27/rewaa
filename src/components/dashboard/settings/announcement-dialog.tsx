/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, ChangeEvent } from "react";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Upload, AlertTriangle, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMarkdownEditor } from "@/components/ui/form-markdown-editor";
import { AnnouncementItem } from "@/types/settings";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcementToEdit: AnnouncementItem | null;
  activeAnnouncementsCount: number;
  oldestActiveTitle?: string;
  onSave: (data: {
    id?: string;
    title: string;
    description: string;
    coverImage?: string;
    url?: string;
    active?: boolean;
  }) => void;
}

export function AnnouncementDialog({
  open,
  onOpenChange,
  announcementToEdit,
  activeAnnouncementsCount,
  oldestActiveTitle,
  onSave,
}: AnnouncementDialogProps) {
  const t = useTranslations("settings.announcements.dialog");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const isEditing = !!announcementToEdit;

  // Calculate if saving this (as active) will trigger automatic deactivation of an older announcement
  const targetWillBeActive = isEditing ? announcementToEdit.active : true;
  const isActivatingOther = isEditing && !announcementToEdit.active;
  const willDeactivateOldest =
    (!isEditing || isActivatingOther) && activeAnnouncementsCount >= 3 && targetWillBeActive;

  useEffect(() => {
    if (open) {
      setTitle(announcementToEdit?.title || "");
      setDescription(announcementToEdit?.description || "");
      setCoverImage(announcementToEdit?.coverImage || "");
      setUrl(announcementToEdit?.url || "");
      setError("");
    }
  }, [open, announcementToEdit]);

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError(t("titleRequired"));
      return;
    }

    if (!description.trim()) {
      setError(t("descriptionRequired"));
      return;
    }

    onSave({
      id: announcementToEdit?.id,
      title: title.trim(),
      description: description.trim(),
      coverImage: coverImage.trim() || undefined,
      url: url.trim() || undefined,
      active: targetWillBeActive,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("titleEdit") : t("titleAdd")}</DialogTitle>
          <DialogDescription>{t("descriptionHint")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Deactivation Warning Alert */}
          {willDeactivateOldest && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs leading-relaxed">
              <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">{t("maxActiveWarningTitle")}</span>
                <span>
                  {t("maxActiveWarningDesc", {
                    name: oldestActiveTitle || "",
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Cover Image Upload Area */}
          <div className="space-y-2">
            <Label>{t("coverImageLabel")}</Label>
            <div className="relative border-2 border-dashed border-input hover:border-primary/50 transition-colors rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-muted/20 text-center">
              {coverImage ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="relative w-full h-36 rounded-lg overflow-hidden border shadow-xs bg-muted">
                    <Image
                      src={coverImage}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="text-xs font-semibold text-primary flex items-center gap-1.5 pt-1">
                    <Upload className="size-3.5" />
                    <span>{t("changeCoverImage")}</span>
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ImageIcon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{t("uploadCoverPrompt")}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {t("uploadCoverFormats")}
                    </p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="absolute inset-0 size-full opacity-0 cursor-pointer"
              />
            </div>
            {/* Direct URL input fallback */}
            <Input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder={t("imageUrlPlaceholder")}
              className="text-xs"
            />
          </div>

          {/* Announcement Title */}
          <div className="space-y-2">
            <Label htmlFor="announcement-title">{t("titleLabel")} *</Label>
            <Input
              id="announcement-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder={t("titlePlaceholder")}
            />
          </div>

          {/* Announcement Description */}
          <div className="space-y-2">
            <Label>{t("descriptionLabel")} *</Label>
            <FormMarkdownEditor
              value={description}
              onChange={(val) => {
                setDescription(val);
                if (error) setError("");
              }}
              placeholder={t("descriptionPlaceholder")}
            />
          </div>

          {/* Optional URL */}
          <div className="space-y-2">
            <Label htmlFor="announcement-url" className="flex items-center justify-between">
              <span>{t("urlLabel")}</span>
              <span className="text-xs text-muted-foreground font-normal">{t("optional")}</span>
            </Label>
            <div className="relative">
              <LinkIcon className="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="announcement-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("urlPlaceholder")}
                className="ps-9 font-mono text-xs"
                dir="ltr"
              />
            </div>
          </div>

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}

          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit">{t("save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
