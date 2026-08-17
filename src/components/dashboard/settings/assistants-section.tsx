"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteAssistant,
  getStoredAssistants,
  resetAssistants,
  saveAssistant,
} from "@/lib/settings-storage";
import { AssistantItem, AssistantPermission } from "@/types/settings";
import { KeyRound, Pencil, Plus, RotateCcw, Trash2, UserLock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AssistantDialog } from "./assistant-dialog";

export function AssistantsSection() {
  const t = useTranslations("settings.assistants");

  const [assistants, setAssistants] = useState<AssistantItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assistantToEdit, setAssistantToEdit] = useState<AssistantItem | null>(null);

  const [assistantToDelete, setAssistantToDelete] = useState<AssistantItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [assistantToResetPassword, setAssistantToResetPassword] = useState<AssistantItem | null>(
    null,
  );
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const handleLoad = () => setAssistants(getStoredAssistants());
    handleLoad();
    window.addEventListener("rewaa_assistants_updated", handleLoad);
    return () => window.removeEventListener("rewaa_assistants_updated", handleLoad);
  }, []);

  const handleResetData = () => {
    resetAssistants();
  };

  const handleOpenAdd = () => {
    setAssistantToEdit(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (assistant: AssistantItem) => {
    setAssistantToEdit(assistant);
    setDialogOpen(true);
  };

  const handleOpenDelete = (assistant: AssistantItem) => {
    setAssistantToDelete(assistant);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (assistantToDelete) {
      deleteAssistant(assistantToDelete.id);
      setAssistantToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleOpenResetPassword = (assistant: AssistantItem) => {
    setAssistantToResetPassword(assistant);
    setNewPassword("");
    setResetPasswordDialogOpen(true);
  };

  const handleConfirmResetPassword = () => {
    if (assistantToResetPassword && newPassword) {
      setResetPasswordDialogOpen(false);
      setAssistantToResetPassword(null);
      setNewPassword("");
    }
  };

  const handleSave = (data: Omit<AssistantItem, "id"> & { id?: string }) => {
    saveAssistant(data);
  };

  return (
    <div className="bg-card border rounded-xl p-5 md:p-6 shadow-xs space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <UserLock className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">{t("title")}</h2>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" onClick={handleResetData} className="gap-1.5">
            <RotateCcw className="size-3.5" />
            <span>{t("resetAssistants")}</span>
          </Button>
          <Button onClick={handleOpenAdd} className="gap-1.5">
            <Plus className="size-4" />
            <span>{t("addAssistant")}</span>
          </Button>
        </div>
      </div>

      {/* Assistants Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="*:text-start">
              <TableHead>{t("columns.name")}</TableHead>
              <TableHead>{t("columns.phone")}</TableHead>
              <TableHead>{t("columns.permissions")}</TableHead>
              <TableHead className="w-32 text-end">{t("columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assistants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  {t("noAssistants")}
                </TableCell>
              </TableRow>
            ) : (
              assistants.map((assistant) => (
                <TableRow key={assistant.id} className="hover:bg-muted/30">
                  {/* Name */}
                  <TableCell className="font-medium text-sm">{assistant.name}</TableCell>

                  {/* Phone */}
                  <TableCell
                    className="text-xs text-muted-foreground font-mono rtl:text-end"
                    dir="ltr"
                  >
                    {assistant.phone || "—"}
                  </TableCell>

                  {/* Permissions Badges */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {assistant.permissions && assistant.permissions.length > 0 ? (
                        assistant.permissions.map((perm: AssistantPermission) => (
                          <Badge key={perm} variant="secondary" className="text-[11px]">
                            {t(`dialog.permissions.${perm}`)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-md text-muted-foreground hover:text-foreground"
                        title={t("resetPasswordDialog.title")}
                        onClick={() => handleOpenResetPassword(assistant)}
                      >
                        <KeyRound className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-md text-muted-foreground hover:text-foreground"
                        title={t("dialog.titleEdit")}
                        onClick={() => handleOpenEdit(assistant)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-md text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                        title={t("deleteDialog.title")}
                        onClick={() => handleOpenDelete(assistant)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Assistant Dialog */}
      <AssistantDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        assistantToEdit={assistantToEdit}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteDialog.description", { name: assistantToDelete?.name || "" })}
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

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("resetPasswordDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("resetPasswordDialog.description", { name: assistantToResetPassword?.name || "" })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="new-assistant-password">
              {t("resetPasswordDialog.newPasswordLabel")}
            </Label>
            <Input
              id="new-assistant-password"
              type="password"
              placeholder={t("resetPasswordDialog.newPasswordPlaceholder")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>
              {t("resetPasswordDialog.cancel")}
            </Button>
            <Button disabled={!newPassword} onClick={handleConfirmResetPassword}>
              {t("resetPasswordDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
