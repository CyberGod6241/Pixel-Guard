import React from "react";

const AlertCard = ({ error, title = "Something went wrong", onClose }) => {
  if (!error) return null;

  const message =
    error.response?.data?.message || error.message || "Unknown error";

  return (
    <div className="fixed right-5 left-5 z-[60] flex justify-center px-4 pt-4 sm:px-6">
      <div
        role="alert"
        className="flex w-full max-w-xl items-center justify-between rounded-xl border border-red-500/20 bg-[#0f172a]/95 px-4 py-3 shadow-lg backdrop-blur"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-red-500/10 p-2 text-[#f87171]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="mt-1 text-xs text-slate-400">{message}</p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Dismiss alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertCard;
