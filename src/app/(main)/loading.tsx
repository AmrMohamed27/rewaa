/**
 * Global loading component for the application.
 * Displays a spinner during route transitions.
 */
export default function Loading() {
  // You can replace this with a branded skeleton loader
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
    </div>
  );
}
