interface LoadingOverlayProps {
  message: string;
  subMessage?: string;
}

export function LoadingOverlay({ message, subMessage }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="text-xl font-semibold text-gray-900">{message}</p>
        {subMessage && (
          <p className="mt-2 text-sm text-gray-600">{subMessage}</p>
        )}
      </div>
    </div>
  );
}
