"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Megaphone,
  Plus,
  RotateCcw,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnnouncementItem } from "@/types/settings";
import {
  getStoredAnnouncements,
  saveAnnouncement,
  toggleAnnouncementActive,
  deleteAnnouncement,
  resetAnnouncements,
} from "@/lib/settings-storage";
import { AnnouncementDialog } from "./announcement-dialog";
import { AnnouncementDetailsDialog } from "./announcement-details-dialog";

export function AnnouncementsSection() {
  const t = useTranslations("settings.announcements");

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState<AnnouncementItem | null>(null);

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [announcementToView, setAnnouncementToView] = useState<AnnouncementItem | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<AnnouncementItem | null>(null);

  const [deactivationToastNotice, setDeactivationToastNotice] = useState<string | null>(null);

  useEffect(() => {
    const handleLoad = () => setAnnouncements(getStoredAnnouncements());
    handleLoad();
    window.addEventListener("rewaa_announcements_updated", handleLoad);
    return () => window.removeEventListener("rewaa_announcements_updated", handleLoad);
  }, []);

  const activeCount = announcements.filter((a) => a.active).length;
  const activeAnnouncementsSorted = announcements
    .filter((a) => a.active)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const oldestActiveTitle = activeAnnouncementsSorted[0]?.title;

  const handleReset = () => {
    resetAnnouncements();
  };

  const handleOpenAdd = () => {
    setAnnouncementToEdit(null);
    setCreateDialogOpen(true);
  };

  const handleOpenEdit = (announcement: AnnouncementItem) => {
    setAnnouncementToEdit(announcement);
    setCreateDialogOpen(true);
  };

  const handleOpenDetails = (announcement: AnnouncementItem) => {
    setAnnouncementToView(announcement);
    setDetailsDialogOpen(true);
  };

  const handleOpenDelete = (announcement: AnnouncementItem) => {
    setAnnouncementToDelete(announcement);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (announcementToDelete) {
      deleteAnnouncement(announcementToDelete.id);
      setAnnouncementToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleToggleStatus = (announcement: AnnouncementItem) => {
    const res = toggleAnnouncementActive(announcement.id);
    if (res.deactivatedAnnouncementTitle) {
      setDeactivationToastNotice(
        t("deactivatedNotice", { name: res.deactivatedAnnouncementTitle }),
      );
      setTimeout(() => setDeactivationToastNotice(null), 5000);
    }
  };

  const handleSave = (data: {
    id?: string;
    title: string;
    description: string;
    coverImage?: string;
    url?: string;
    active?: boolean;
  }) => {
    const res = saveAnnouncement(data);
    if (res.deactivatedAnnouncementTitle) {
      setDeactivationToastNotice(
        t("deactivatedNotice", { name: res.deactivatedAnnouncementTitle }),
      );
      setTimeout(() => setDeactivationToastNotice(null), 5000);
    }
  };

  return (
    <div className="bg-card border rounded-xl p-5 md:p-6 shadow-xs space-y-5">
      {/* Toast Notice Banner for Auto-Deactivation */}
      {deactivationToastNotice && (
        <div className="bg-amber-500/15 border border-amber-500/30 text-amber-900 px-4 py-3 rounded-lg text-sm flex items-center justify-between animate-in fade-in">
          <span>{deactivationToastNotice}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-amber-900 hover:bg-amber-500/20"
            onClick={() => setDeactivationToastNotice(null)}
          >
            ✕
          </Button>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Megaphone className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight">{t("title")}</h2>
              <Badge variant="outline" className="text-xs font-normal">
                {t("activeCountBadge", { count: activeCount, max: 3 })}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="size-3.5" />
            <span>{t("resetAnnouncements")}</span>
          </Button>
          <Button onClick={handleOpenAdd} className="gap-1.5">
            <Plus className="size-4" />
            <span>{t("addAnnouncement")}</span>
          </Button>
        </div>
      </div>

      {/* Announcements Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="*:text-start">
              <TableHead className="w-16">{t("columns.cover")}</TableHead>
              <TableHead>{t("columns.title")}</TableHead>
              <TableHead>{t("columns.url")}</TableHead>
              <TableHead className="w-28">{t("columns.status")}</TableHead>
              <TableHead className="w-16 text-end">{t("columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  {t("noAnnouncements")}
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  {/* Cover Image Thumbnail */}
                  <TableCell>
                    <div className="relative size-10 rounded-md overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                      {item.coverImage ? (
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <ImageIcon className="size-4 text-muted-foreground/60" />
                      )}
                    </div>
                  </TableCell>

                  {/* Title & Preview */}
                  <TableCell className="font-medium text-sm max-w-xs">
                    <div className="space-y-0.5">
                      <p className="line-clamp-1 font-semibold text-foreground">{item.title}</p>
                    </div>
                  </TableCell>

                  {/* URL */}
                  <TableCell>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-mono max-w-45 truncate"
                        dir="ltr"
                      >
                        <span className="truncate">{item.url}</span>
                        <ExternalLink className="size-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Badge
                      variant={item.active ? "default" : "secondary"}
                      className={
                        item.active
                          ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30 gap-1 text-[11px]"
                          : "gap-1 text-muted-foreground text-[11px]"
                      }
                    >
                      {item.active ? (
                        <>
                          <CheckCircle className="size-3" />
                          <span>{t("statusActive")}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3" />
                          <span>{t("statusInactive")}</span>
                        </>
                      )}
                    </Badge>
                  </TableCell>

                  {/* Actions Dropdown Options Menu */}
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-md text-muted-foreground hover:text-foreground"
                        >
                          <MoreVertical className="size-4" />
                          <span className="sr-only">{t("columns.actions")}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {/* View Details */}
                        <DropdownMenuItem
                          onClick={() => handleOpenDetails(item)}
                          className="gap-2 cursor-pointer"
                        >
                          <Eye className="size-4 text-muted-foreground" />
                          <span>{t("actions.viewDetails")}</span>
                        </DropdownMenuItem>

                        {/* Edit */}
                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(item)}
                          className="gap-2 cursor-pointer"
                        >
                          <Pencil className="size-4 text-muted-foreground" />
                          <span>{t("actions.edit")}</span>
                        </DropdownMenuItem>

                        {/* Mark Active / Inactive */}
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(item)}
                          className="gap-2 cursor-pointer"
                        >
                          {item.active ? (
                            <>
                              <XCircle className="size-4 text-amber-600" />
                              <span>{t("actions.markInactive")}</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="size-4 text-emerald-600" />
                              <span>{t("actions.markActive")}</span>
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Delete */}
                        <DropdownMenuItem
                          onClick={() => handleOpenDelete(item)}
                          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="size-4" />
                          <span>{t("actions.delete")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Dialog */}
      <AnnouncementDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        announcementToEdit={announcementToEdit}
        activeAnnouncementsCount={activeCount}
        oldestActiveTitle={oldestActiveTitle}
        onSave={handleSave}
      />

      {/* View Details Dialog */}
      <AnnouncementDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        announcement={announcementToView}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteDialog.description", { title: announcementToDelete?.title || "" })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t("deleteDialog.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              {t("deleteDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
