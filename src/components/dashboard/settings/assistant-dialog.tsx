"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { AssistantItem, AssistantPermission } from "@/types/settings";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface AssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assistantToEdit?: AssistantItem | null;
  onSave: (assistant: Omit<AssistantItem, "id"> & { id?: string }) => void;
}

const PERMISSION_KEYS: AssistantPermission[] = [
  "manage-courses",
  "manage-exams-and-questions",
  "manage-students",
  "manage-billing",
];

export function AssistantDialog({
  open,
  onOpenChange,
  assistantToEdit,
  onSave,
}: AssistantDialogProps) {
  const t = useTranslations("settings.assistants.dialog");

  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<AssistantPermission[]>([]);

  const [prevAssistant, setPrevAssistant] = useState<AssistantItem | null | undefined>(undefined);
  const [prevOpen, setPrevOpen] = useState(false);

  if (open !== prevOpen || assistantToEdit !== prevAssistant) {
    setPrevOpen(open);
    setPrevAssistant(assistantToEdit);
    if (assistantToEdit) {
      setName(assistantToEdit.name || "");
      setNationalId(assistantToEdit.nationalId || "");
      setPhone(assistantToEdit.phone || "");
      setPassword("");
      setSelectedPermissions(assistantToEdit.permissions || []);
    } else {
      setName("");
      setNationalId("");
      setPhone("");
      setPassword("");
      setSelectedPermissions([]);
    }
  }

  const togglePermission = (perm: AssistantPermission) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || nationalId.length !== 14 || selectedPermissions.length === 0) return;

    onSave({
      id: assistantToEdit?.id,
      name: name.trim(),
      nationalId: nationalId.trim(),
      phone: phone.trim(),
      permissions: selectedPermissions,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{assistantToEdit ? t("titleEdit") : t("titleAdd")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="assistant-name">{t("nameLabel")}</Label>
            <Input
              id="assistant-name"
              required
              placeholder={t("namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* National ID */}
          <div className="space-y-2">
            <Label htmlFor="assistant-national-id">{t("nationalIdLabel")}</Label>
            <Input
              id="assistant-national-id"
              required
              maxLength={14}
              minLength={14}
              pattern="\d{14}"
              dir="ltr"
              placeholder={t("nationalIdPlaceholder")}
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value.replace(/\D/g, "").slice(0, 14))}
              className="font-mono rtl:text-end"
            />
            {nationalId && nationalId.length !== 14 && (
              <p className="text-[11px] text-destructive">{t("nationalIdError")}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="assistant-phone">{t("phoneLabel")}</Label>
            <Input
              id="assistant-phone"
              type="tel"
              required
              dir="ltr"
              placeholder={t("phonePlaceholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rtl:text-end font-mono"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="assistant-password">{t("passwordLabel")}</Label>
            <Input
              id="assistant-password"
              type="password"
              required={!assistantToEdit}
              placeholder={
                assistantToEdit ? t("passwordEditPlaceholder") : t("passwordPlaceholder")
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Permissions Checkbox List */}
          <div className="space-y-2">
            <Label>{t("permissionsLabel")}</Label>
            <div className="space-y-2 border rounded-lg p-3 bg-muted/10">
              {PERMISSION_KEYS.map((perm) => {
                const checked = selectedPermissions.includes(perm);
                return (
                  <div key={perm} className="flex items-center gap-2">
                    <Checkbox
                      id={`perm-${perm}`}
                      checked={checked}
                      onCheckedChange={() => togglePermission(perm)}
                    />
                    <label
                      htmlFor={`perm-${perm}`}
                      className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {t(`permissions.${perm}`)}
                    </label>
                  </div>
                );
              })}
            </div>
            {selectedPermissions.length === 0 && (
              <p className="text-[11px] text-destructive">{t("permissionsError")}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={
                !name.trim() || nationalId.length !== 14 || selectedPermissions.length === 0
              }
            >
              {t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
