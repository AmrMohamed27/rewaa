import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface FormSectionCardProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ElementType | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function FormSectionCard({
  title,
  description,
  icon: Icon,
  children,
  className,
  headerClassName,
  contentClassName,
}: FormSectionCardProps) {
  const renderIcon = () => {
    if (!Icon) return null;
    if (typeof Icon === "function" || (typeof Icon === "object" && "render" in (Icon as object))) {
      const Component = Icon as React.ElementType;
      return <Component className="size-5" />;
    }
    return Icon;
  };

  return (
    <Card className={cn("bg-card border shadow-xs overflow-hidden", className)}>
      <CardHeader className={cn("", headerClassName)}>
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">{renderIcon()}</div>
          )}
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className={cn("", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
