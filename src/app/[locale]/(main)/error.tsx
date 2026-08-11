"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Global error boundary component for the application.
 * Logs errors and provides a way for the user to recover by retrying.
 *
 * @param props - Component props containing the error object and a reset function.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service (e.g., Sentry) later
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center space-y-4 text-center px-4">
      <h1 className="text-3xl font-bold tracking-tight">Something went wrong!</h1>
      <p className="text-muted-foreground">An unexpected error occurred.</p>
      <Button onClick={() => reset()} variant="default">
        Try again
      </Button>
    </div>
  );
}
