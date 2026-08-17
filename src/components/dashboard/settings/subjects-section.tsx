"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { BookOpen, Plus, Pencil, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubjectItem } from "@/types/settings";
import {
  getStoredSubjects,
  saveSubject,
  deleteSubject,
  resetSubjects,
} from "@/lib/settings-storage";
import { SubjectDialog } from "./subject-dialog";

export function SubjectsSection() {
  const t = useTranslations("settings.subjects");

  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<SubjectItem | null>(null);

  const [subjectToDelete, setSubjectToDelete] = useState<SubjectItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const handleLoad = () => setSubjects(getStoredSubjects());
    handleLoad();
    window.addEventListener("rewaa_subjects_updated", handleLoad);
    return () => window.removeEventListener("rewaa_subjects_updated", handleLoad);
  }, []);

  const handleReset = () => {
    resetSubjects();
  };

  const handleOpenAdd = () => {
    setSubjectToEdit(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (subject: SubjectItem) => {
    setSubjectToEdit(subject);
    setDialogOpen(true);
  };

  const handleOpenDelete = (subject: SubjectItem) => {
    setSubjectToDelete(subject);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (subjectToDelete) {
      deleteSubject(subjectToDelete.id);
      setSubjectToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleSave = (data: { id?: string; name: string }) => {
    saveSubject(data);
  };

  return (
    <div className="bg-card border rounded-xl p-5 md:p-6 shadow-xs space-y-5 flex-1">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">{t("title")}</h2>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="size-3.5" />
            <span>{t("resetSubjects")}</span>
          </Button>
          <Button onClick={handleOpenAdd} size="sm" className="gap-1.5">
            <Plus className="size-4" />
            <span>{t("addSubject")}</span>
          </Button>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="rounded-lg border overflow-y-auto max-h-48">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow className="*:text-start">
              <TableHead>{t("columns.name")}</TableHead>
              <TableHead>{t("columns.coursesCount")}</TableHead>
              <TableHead>{t("columns.teachersCount")}</TableHead>
              <TableHead className="w-20 text-end">{t("columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-28 text-center text-muted-foreground">
                  {t("noSubjects")}
                </TableCell>
              </TableRow>
            ) : (
              subjects.map((subject) => (
                <TableRow key={subject.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium text-sm">{subject.name}</TableCell>
                  <TableCell className="text-xs font-mono">{subject.coursesCount}</TableCell>
                  <TableCell className="text-xs font-mono">{subject.teachersCount}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-md text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenEdit(subject)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 rounded-md text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleOpenDelete(subject)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Dialog */}
      <SubjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subjectToEdit={subjectToEdit}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteDialog.description", { name: subjectToDelete?.name || "" })}
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
