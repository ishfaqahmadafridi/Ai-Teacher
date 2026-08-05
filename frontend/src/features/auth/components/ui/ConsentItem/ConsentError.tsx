interface ConsentErrorProps {
  id: string;
  message: string;
}

/**
 * Renders the inline validation error message for a consent checkbox.
 * The `id` matches aria-describedby on the checkbox for screen-reader support.
 */
export function ConsentError({ id, message }: ConsentErrorProps) {
  return (
    <p
      id={id}
      role="alert"
      aria-live="polite"
      className="text-xs text-[#ff5252] pl-6 font-['Inter',sans-serif]"
    >
      {message}
    </p>
  );
}
