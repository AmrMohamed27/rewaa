"use client";

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
  type?: "text" | "textarea" | "email" | "password";
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
  /** Optional global error message to display in the form */
  error?: string | null;
  /** Optional callback function to reset the form */
  onReset?: () => void;
}

/**
 * A highly reusable, type-safe generic form component built on TanStack Form and Zod.
 *
 * @template T - The type of the form data, typically a Zod schema inference.
 *
 * @param {GenericFormProps<T>} props - The component props.
 * @param {z.ZodType<T>} props.schema - The Zod validation schema for the form.
 * @param {T} props.defaultValues - The initial values for the form fields.
 * @param {(values: T) => void | Promise<void>} props.onSubmit - Callback function triggered on valid form submission.
 * @param {FieldConfig<T>[]} props.fields - Array of field configurations defining labels, names, and input types.
 * @param {string} [props.submitText="Submit"] - Optional custom text for the submit button.
 * @param {string} [props.error] - Optional global error message to display in the form.
 * @param {() => void} [props.onReset] - Optional callback function to reset the form.
 *
 * @example
 * ```tsx
 * const schema = z.object({ email: z.string().email() });
 * <GenericForm
 *   schema={schema}
 *   defaultValues={{ email: "" }}
 *   fields={[{ name: "email", label: "Email Address", type: "email" }]}
 *   onSubmit={(values) => console.log(values)}
 * />
 * ```
 */

export function GenericForm<T>({
  schema,
  defaultValues,
  onSubmit,
  fields,
  submitText = "Submit",
  error,
  onReset,
}: GenericFormProps<T>) {
  const form = useForm({
    defaultValues,
    validators: {
      onChange: schema as FormValidateOrFn<T>,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value as T);
      form.reset();
    },
  });

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
                      value={field.state.value as string}
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
                  ) : (
                    <Input
                      id={field.name}
                      name={field.name}
                      type={fieldConfig.type || "text"}
                      value={field.state.value as string}
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
      <UIField orientation="horizontal" className="w-full justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset();
            onReset?.();
          }}
        >
          Reset
        </Button>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" form="generic-form" disabled={!canSubmit}>
              {isSubmitting ? "Submitting..." : submitText}
            </Button>
          )}
        </form.Subscribe>
      </UIField>
    </form>
  );
}
