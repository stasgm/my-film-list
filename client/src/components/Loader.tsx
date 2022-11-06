import { FetchError } from "../services/api"

const Loader = ({ error = false }: { error?: unknown }) => (
  <div
    className={`
      fixed inset-0 h-screen w-screen
      flex items-center justify-center
      px-6 py-6
      bg-white text-opacity-75
      ${error ? "text-red-700" : "text-gray-600"}
  `}
  >
    <div className="animate-appear flex flex-col items-center text-center">
      <div className="mb-2">
        <svg
          className="animate-spin h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      {error ? (
        <p>
          {error
            ? error instanceof FetchError
              ? `Oops. The API returned a HTTP ${error.status}…`
              : error instanceof Error && error.message === "Failed to fetch"
                ? "We cannot reach the API… Make sure your network connection is active."
                : "Oops, an error has occurred"
            : null}
        </p>
      ) : (
        <p>Warming up the server...</p>
      )}
    </div>
  </div>
)

export default Loader
