"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message");
    }
  };

  const field =
    "w-full rounded-2xl border border-line bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-accent/50 disabled:opacity-60";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Your name"
        aria-label="Your name"
        autoComplete="name"
        className={field}
        required
        disabled={status === "loading"}
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="you@email.com"
        aria-label="Your email"
        autoComplete="email"
        className={field}
        required
        disabled={status === "loading"}
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="What are you working on?"
        aria-label="Message"
        className={`${field} min-h-[140px] resize-none`}
        required
        disabled={status === "loading"}
      />

      <div aria-live="polite">
        {status === "success" && (
          <p className="px-1 text-sm font-medium text-[#1F8A4C]">Message sent. I&apos;ll get back to you soon.</p>
        )}
        {status === "error" && <p className="px-1 text-sm font-medium text-accent">{errorMessage}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-medium text-bg transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>{status === "loading" ? "Sending…" : "Send message"}</span>
        {status !== "loading" && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        )}
      </button>
    </form>
  );
}
