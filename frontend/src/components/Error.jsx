export default function Error({ message = 'An error occurred', onRetry }) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center p-8 bg-red-50 rounded-lg shadow-md max-w-md">
        <div className="text-red-500 text-5xl mb-4">!</div>
        <p className="text-gray-700 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}