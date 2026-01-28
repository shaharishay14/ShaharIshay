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

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm font-mono text-gray-500 uppercase tracking-widest mb-2">
        <span className="text-[var(--primary)]">///</span>
        <span>CONTACT</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] opacity-0 group-hover:opacity-20 blur transition duration-300" />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="YOUR NAME"
            className="relative w-full px-4 py-3 terminal-input text-sm uppercase tracking-wide"
            required
            disabled={status === "loading"}
          />
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] opacity-0 group-hover:opacity-20 blur transition duration-300" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="YOUR@EMAIL.COM"
            className="relative w-full px-4 py-3 terminal-input text-sm uppercase tracking-wide"
            required
            disabled={status === "loading"}
          />
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] opacity-0 group-hover:opacity-20 blur transition duration-300" />
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="YOUR MESSAGE..."
            className="relative w-full px-4 py-3 terminal-input text-sm uppercase tracking-wide min-h-[140px] resize-none"
            required
            disabled={status === "loading"}
          />
        </div>

        {status === "success" && (
          <div className="text-sm font-mono text-[var(--primary)] border-l-2 border-[var(--primary)] pl-4 py-3">
            [ MESSAGE SENT SUCCESSFULLY ]
          </div>
        )}

        {status === "error" && (
          <div className="text-sm font-mono text-red-600 border-l-2 border-red-600 pl-4 py-3">
            [ ERROR: {errorMessage} ]
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3.5 bg-[var(--primary)] text-white font-bold text-sm uppercase tracking-wider font-mono hover:bg-[var(--primary-dark)] transition-all duration-200 flex items-center justify-center gap-2 group border-2 border-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{status === "loading" ? "SENDING..." : "SEND MESSAGE"}</span>
          {status !== "loading" && (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </button>
      </form>
    </div>
  );
}
