import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * 404 Not Found page component.
 * Displays a friendly message when a user navigates to a non-existent route.
 */
export default function NotFound() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center space-y-4 text-center px-4">
      <h1 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
      <p className="text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
