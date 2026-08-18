"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Field as UIField,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DeepValue, FormValidateOrFn, Updater, useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import * as z from "zod";
import { $ZodTypeInternals } from "zod/v4/core";

/**
 * Configuration for a single form field.
 *
 * @template T - The type of the form data.
 */
export type FieldConfig<T> = {
  /** The key in the form data object that this field corresponds to */
  name: Extract<keyof T, string>;
  /** The display label for the field */
  label: string;
  /** The input type (default: "text") */
  type?: "text" | "textarea" | "email" | "password" | "tel";
  /** Optional placeholder text for the input */
  placeholder?: string;
  /** Optional descriptive text displayed below the field */
  description?: string;
};

/**
 * Props for the GenericForm component.
 *
 * @template T - The type of the form data.
 */
interface GenericFormProps<T> {
  /** The title of the form */
  title: string;
  /** Optional description for the form */
  description?: string;
  /** The Zod validation schema for the form */
  schema: z.ZodType<T, unknown, $ZodTypeInternals<T, unknown>>;
  /** Initial values for the form fields */
  defaultValues: T;
  /** Callback function triggered on valid form submission */
  onSubmit: (values: T) => Promise<void> | void;
  /** Array of field configurations */
  fields: FieldConfig<T>[];
  /** Optional custom text for the submit button (default: "Submit") */
  submitText?: string;
  /** Optional custom text for the reset button (default from i18n: "Reset") */
  resetText?: string;
  /** Whether to show reset button (default: false) */
  showReset?: boolean;
  /** Extra node to render between fields and submit button (e.g., Remember me & Forgot Password) */
  extraActions?: React.ReactNode;
  /** Optional global error message to display in the form */
  error?: string | null;
  /** Optional callback function to reset the form */
  onReset?: () => void;
}

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  ariaInvalid?: boolean;
}

/**
 * Reusable password input with toggleable visibility icon (Eye / EyeOff).
 * Uses logical Tailwind properties (pe-10, end-0) for seamless LTR & RTL support.
 */
function PasswordInput({
  id,
  name,
  value,
  onBlur,
  onChange,
  placeholder,
  ariaInvalid,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        className="pe-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute inset-y-0 inset-e-0 flex items-center pe-3 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
        aria-label={showPassword ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 shrink-0" />
        ) : (
          <Eye className="h-4 w-4 shrink-0" />
        )}
      </button>
    </div>
  );
}

/**
 * A highly reusable, type-safe generic form component built on TanStack Form and Zod.
 */
export function GenericForm<T>({
  schema,
  defaultValues,
  onSubmit,
  fields,
  submitText,
  resetText,
  showReset = false,
  extraActions,
  error,
  onReset,
}: GenericFormProps<T>) {
  const t = useTranslations("common");
  const form = useForm({
    defaultValues,
    validators: {
      onChange: schema as FormValidateOrFn<T>,
    },
    onSubmit: async ({ value }) => {
      try {
        await onSubmit(value as T);
        form.reset();
      } catch (err) {
        console.error("Form submission error:", err);
      }
    },
  });

  const finalSubmitText = submitText || t("loading");
  const finalResetText = resetText || t("reset");

  return (
    <form
      id="generic-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <FieldGroup>
        {fields.map((fieldConfig) => (
          <form.Field key={fieldConfig.name} name={fieldConfig.name}>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <UIField data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{fieldConfig.label}</FieldLabel>

                  {fieldConfig.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={(field.state.value as string) || ""}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value as Updater<DeepValue<T, Extract<keyof T, string>>>,
                        )
                      }
                      placeholder={fieldConfig.placeholder}
                      className="min-h-24 resize-none"
                      aria-invalid={isInvalid}
                    />
                  ) : fieldConfig.type === "password" ? (
                    <PasswordInput
                      id={field.name}
                      name={field.name}
                      value={(field.state.value as string) || ""}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value as Updater<DeepValue<T, Extract<keyof T, string>>>,
                        )
                      }
                      placeholder={fieldConfig.placeholder}
                      ariaInvalid={isInvalid}
                    />
                  ) : (
                    <Input
                      id={field.name}
                      name={field.name}
                      type={fieldConfig.type || "text"}
                      value={(field.state.value as string) || ""}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value as Updater<DeepValue<T, Extract<keyof T, string>>>,
                        )
                      }
                      placeholder={fieldConfig.placeholder}
                      aria-invalid={isInvalid}
                    />
                  )}

                  {fieldConfig.description && (
                    <FieldDescription>{fieldConfig.description}</FieldDescription>
                  )}

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </UIField>
              );
            }}
          </form.Field>
        ))}
      </FieldGroup>
      {extraActions && (
        <div className="flex items-center justify-between flex-wrap gap-2 text-sm">
          {extraActions}
        </div>
      )}

      {showReset ? (
        <UIField orientation="horizontal" className="w-full justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onReset?.();
            }}
          >
            {finalResetText}
          </Button>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" form="generic-form" disabled={!canSubmit}>
                {isSubmitting ? t("submitting") : finalSubmitText}
              </Button>
            )}
          </form.Subscribe>
        </UIField>
      ) : (
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" form="generic-form" disabled={!canSubmit} className="w-full">
              {isSubmitting ? t("submitting") : finalSubmitText}
            </Button>
          )}
        </form.Subscribe>
      )}
    </form>
  );
}
