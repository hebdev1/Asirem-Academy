"use client";

import { useFormStatus } from "react-dom";
import { Icon } from "@/components/admin/icon";

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-[15px] font-semibold text-white transition-opacity disabled:opacity-80"
      style={{ background: "var(--accent)", cursor: pending ? "default" : "pointer" }}
    >
      {pending ? (
        <>
          <Icon name="progress_activity" size={19} className="animate-spin" />
          Signing in…
        </>
      ) : (
        <>
          Sign in
          <Icon name="arrow_forward" size={19} />
        </>
      )}
    </button>
  );
}
