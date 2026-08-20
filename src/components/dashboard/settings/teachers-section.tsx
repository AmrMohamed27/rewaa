"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { UserCheck, Plus, Pencil, Trash2, User, RotateCcw } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhoneLink } from "@/components/ui/phone-link";
import { Teacher } from "@/types/settings";
import {
  getStoredTeachers,
  saveTeacher,
  deleteTeacher,
  resetTeachers,
} from "@/lib/settings-storage";
import { TeacherDialog } from "./teacher-dialog";

export function TeachersSection() {
  const t = useTranslations("settings.teachers");
  const tSubjects = useTranslations("courses.new.subjects");

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);

  const formatSubject = (sub: string) => {
    if (!sub) return "";
    return tSubjects.has(sub as Parameters<typeof tSubjects.has>[0])
      ? tSubjects(sub as Parameters<typeof tSubjects>[0])
      : sub;
  };

  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const handleLoad = () => setTeachers(getStoredTeachers());
    handleLoad();
    window.addEventListener("rewaa_teachers_updated", handleLoad);
    return () => window.removeEventListener("rewaa_teachers_updated", handleLoad);
  }, []);

  const handleReset = () => {
    resetTeachers();
  };

  const handleOpenAdd = () => {
    setTeacherToEdit(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setTeacherToEdit(teacher);
    setDialogOpen(true);
  };

  const handleOpenDelete = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (teacherToDelete) {
      deleteTeacher(teacherToDelete.id);
      setTeacherToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleSave = (data: Omit<Teacher, "id"> & { id?: string }) => {
    saveTeacher(data);
  };

  return (
    <div className="bg-card border rounded-xl p-5 md:p-6 shadow-xs space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <UserCheck className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">{t("title")}</h2>
            <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="size-3.5" />
            <span>{t("resetTeachers")}</span>
          </Button>
          <Button onClick={handleOpenAdd} className="gap-1.5">
            <Plus className="size-4" />
            <span>{t("addTeacher")}</span>
          </Button>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="*:text-start">
              <TableHead className="w-16">{t("columns.image")}</TableHead>
              <TableHead>{t("columns.name")}</TableHead>
              <TableHead>{t("columns.phone")}</TableHead>
              <TableHead>{t("columns.subjects")}</TableHead>
              <TableHead className="w-24 text-end">{t("columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  {t("noTeachers")}
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow key={teacher.id} className="hover:bg-muted/30">
                  {/* Image Column */}
                  <TableCell>
                    <div className="relative size-9 rounded-full overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                      {teacher.image ? (
                        <Image
                          src={teacher.image}
                          alt={teacher.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <User className="size-5 text-muted-foreground/70" />
                      )}
                    </div>
                  </TableCell>

                  {/* Teacher Name */}
                  <TableCell className="font-medium text-sm">{teacher.name}</TableCell>

                  {/* Phone Number */}
                  <TableCell
                    className="text-xs text-muted-foreground font-mono rtl:text-end"
                    dir="ltr"
                  >
                    {teacher.phone ? (
                      <PhoneLink
                        phone={teacher.phone}
                        className="hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        {teacher.phone}
                      </PhoneLink>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  {/* Subjects */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects && teacher.subjects.length > 0 ? (
                        teacher.subjects.map((sub, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[11px]">
                            {formatSubject(sub)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Action Icon Buttons */}
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-md text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenEdit(teacher)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-md text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleOpenDelete(teacher)}
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

      {/* Add / Edit Dialog */}
      <TeacherDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        teacherToEdit={teacherToEdit}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteDialog.description", { name: teacherToDelete?.name || "" })}
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
