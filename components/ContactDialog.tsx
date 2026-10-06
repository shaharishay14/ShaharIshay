"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ContactDialog({ open, onClose }: ContactDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("input")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            className="relative w-full max-w-md rounded-[28px] border border-line bg-surface p-6 shadow-[0_24px_80px_-24px_rgba(23,24,28,0.35)] sm:p-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 id="contact-title" className="font-display text-[28px] font-bold leading-none tracking-tight">
              Say hello
            </h2>
            <p className="mb-6 mt-3 text-[15px] leading-snug text-muted">
              Have a project, a role, or just an idea? Drop me a line.
            </p>
            <ContactForm />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
