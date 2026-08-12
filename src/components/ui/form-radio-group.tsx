import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  id: string;
  label: React.ReactNode;
  desc?: React.ReactNode;
}

export interface FormRadioGroupProps {
  name: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ElementType | React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
  gridClassName?: string;
}

export function FormRadioGroup({
  name,
  title,
  subtitle,
  icon: Icon,
  value,
  onValueChange,
  options,
  className,
  gridClassName,
}: FormRadioGroupProps) {
  const renderIcon = () => {
    if (!Icon) return null;
    if (typeof Icon === "function" || (typeof Icon === "object" && "render" in (Icon as object))) {
      const Component = Icon as React.ElementType;
      return <Component className="size-4 text-primary shrink-0" />;
    }
    return Icon;
  };

  return (
    <div className={cn("space-y-3 pt-2", className)}>
      {(title || subtitle || Icon) && (
        <div className="flex items-center gap-2">
          {renderIcon()}
          <div>
            {title && <span className="text-sm font-medium text-foreground block">{title}</span>}
            {subtitle && <span className="text-xs text-muted-foreground block">{subtitle}</span>}
          </div>
        </div>
      )}

      <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-3", gridClassName)}>
        {options.map((item) => {
          const isSelected = value === item.id;
          return (
            <label
              key={item.id}
              className={cn(
                "flex flex-col gap-1 p-3.5 rounded-xl border cursor-pointer transition-all",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-input bg-card hover:bg-muted/50",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{item.label}</span>
                <input
                  type="radio"
                  name={name}
                  value={item.id}
                  checked={isSelected}
                  onChange={() => onValueChange(item.id)}
                  className="size-4 text-primary accent-primary"
                />
              </div>
              {item.desc && <span className="text-xs text-muted-foreground">{item.desc}</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
}
