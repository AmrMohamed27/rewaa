import { cn } from "@/lib/utils";
import React from "react";

const MIN_CHART_DIMENSION = 32;

interface Props extends React.PropsWithChildren {
  className?: string;
}

export default function ChartContainer({ children, className }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = (rect = el.getBoundingClientRect()) => {
      if (rect.width >= MIN_CHART_DIMENSION && rect.height >= MIN_CHART_DIMENSION) {
        setIsReady(true);
      }
    };

    update();
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === el) update(entry.contentRect);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      data-chart-ready={isReady ? "true" : "false"}
      className={cn(
        "flex w-full min-w-0 min-h-[250px] aspect-video justify-center",
        !isReady && "opacity-0 pointer-events-none",
        className,
      )}
    >
      {isReady ? children : null}
    </div>
  );
}
