interface ErrorDisplayProps {
  error: string | Error | null | undefined;
  title?: string;
  className?: string;
}

export default function ErrorDisplay({
  error,
  title = "Error",
  className = "",
}: ErrorDisplayProps) {
  if (!error) {
    return null;
  }

  const errorMessage =
    error instanceof Error ? error.message : String(error);

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20 ${className}`}
    >
      {title && (
        <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-300">
          {title}
        </h3>
      )}
      <p className="text-center text-red-700 dark:text-red-400">
        {errorMessage}
      </p>
    </div>
  );
}

