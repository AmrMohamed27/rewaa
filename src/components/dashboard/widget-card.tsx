import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface WidgetCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4;
  mdSpan?: 1 | 2;
}

export function WidgetCard({ children, className, span = 1, mdSpan, ...props }: WidgetCardProps) {
  const spanClasses = cn("col-span-1", {
    "xl:col-span-1": span === 1,
    "xl:col-span-2": span === 2,
    "xl:col-span-3": span === 3,
    "xl:col-span-4": span === 4,
    "md:col-span-1": mdSpan === 1,
    "md:col-span-2": mdSpan === 2,
  });

  return (
    <Card
      className={cn(
        "h-full overflow-hidden transition-all duration-200 hover:shadow-md",
        spanClasses,
        className,
      )}
      {...props}
    >
      <div className="flex flex-col h-full p-6">{children}</div>
    </Card>
  );
}
