import { useState, useCallback, KeyboardEvent } from "react";

interface UseKeyboardListNavigationOptions {
  itemCount: number;
  onSelect?: (index: number) => void;
  onClose?: () => void;
  orientation?: "vertical" | "horizontal" | "both";
  loop?: boolean;
}

/**
 * A custom hook to manage keyboard focus/navigation through lists or grids.
 * Handles Arrow keys, Home, End, Enter, Space, and Escape.
 */
export function useKeyboardListNavigation({
  itemCount,
  onSelect,
  onClose,
  orientation = "vertical",
  loop = true,
}: UseKeyboardListNavigationOptions) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (itemCount <= 0) return;

      const isVertical = orientation === "vertical" || orientation === "both";
      const isHorizontal = orientation === "horizontal" || orientation === "both";

      switch (event.key) {
        case "ArrowDown":
          if (isVertical) {
            event.preventDefault();
            setActiveIndex((prev) => {
              const next = prev + 1;
              if (next >= itemCount) return loop ? 0 : prev;
              return next;
            });
          }
          break;
        case "ArrowUp":
          if (isVertical) {
            event.preventDefault();
            setActiveIndex((prev) => {
              const next = prev - 1;
              if (next < 0) return loop ? itemCount - 1 : prev;
              return next;
            });
          }
          break;
        case "ArrowRight":
          if (isHorizontal) {
            event.preventDefault();
            setActiveIndex((prev) => {
              const next = prev + 1;
              if (next >= itemCount) return loop ? 0 : prev;
              return next;
            });
          }
          break;
        case "ArrowLeft":
          if (isHorizontal) {
            event.preventDefault();
            setActiveIndex((prev) => {
              const next = prev - 1;
              if (next < 0) return loop ? itemCount - 1 : prev;
              return next;
            });
          }
          break;
        case "Enter":
        case " ":
          if (activeIndex >= 0 && activeIndex < itemCount) {
            event.preventDefault();
            onSelect?.(activeIndex);
          }
          break;
        case "Escape":
          event.preventDefault();
          onClose?.();
          setActiveIndex(-1);
          break;
        case "Home":
          event.preventDefault();
          setActiveIndex(0);
          break;
        case "End":
          event.preventDefault();
          setActiveIndex(itemCount - 1);
          break;
        default:
          break;
      }
    },
    [activeIndex, itemCount, onSelect, onClose, orientation, loop],
  );

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
  };
}

/**
 * A custom hook to bind click events to standard trigger keys (Enter and Space).
 * Essential for making custom clickable elements ARIA-compliant and accessible.
 */
export function useKeyboardAction(callback?: () => void) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (!callback) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        callback();
      }
    },
    [callback],
  );

  return handleKeyDown;
}
