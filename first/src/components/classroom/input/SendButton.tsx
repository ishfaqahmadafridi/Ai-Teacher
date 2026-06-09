interface SendButtonProps {
  loading: boolean;
  disabled: boolean;
}

export default function SendButton({ loading, disabled }: SendButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="flex-shrink-0 w-12 h-12 rounded-2xl
        bg-gradient-to-br from-blue-600 to-indigo-600
        hover:from-blue-500 hover:to-indigo-500
        shadow-lg shadow-blue-900/40 hover:shadow-blue-700/50
        transition-all disabled:opacity-30 disabled:cursor-not-allowed
        flex items-center justify-center"
    >
      {loading ? (
        <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      ) : (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
        </svg>
      )}
    </button>
  );
}
