"use client";

import { Terminal, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export function Sidebar() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "SHAHAR ISHAY";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="space-y-6">
      {/* Profile Section */}
      <div className="space-y-4">
        {/* Brutalist Avatar */}
        <div className="relative inline-block">
          <div className="w-40 h-40 border-4 border-[var(--foreground)] bg-white relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <img alt="profile_picture" src="/profile_picture.png" />
            </div>
            {/* Scan line effect */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute w-full h-[2px] bg-[var(--primary)] animate-[scan_3s_linear_infinite]" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[var(--primary)] border-2 border-[var(--background)]" />
        </div>

        {/* Name with typing effect */}
        <div>
          <h1 className="text-4xl font-black font-display mb-3 tracking-tight">
            <span className="inline-block border-r-2 border-[var(--primary)] pr-1">
              {displayedText}
            </span>
          </h1>
          <div className="flex items-center gap-2 text-base font-mono">
            <Terminal className="w-5 h-5 text-[var(--primary)]" />
            <span className="text-gray-600">&gt; Full Stack Developer</span>
          </div>
          <div className="flex items-center gap-2 text-base font-mono mt-2">
            <Zap className="w-5 h-5 text-[var(--primary-dark)]" />
            <span className="text-gray-600">&gt; CS Student</span>
          </div>
        </div>

        {/* Bio with brutalist box */}
        <div className="border-l-4 border-[var(--primary)] pl-5 py-3 bg-[var(--accent)] relative">
          <p className="text-sm font-mono leading-relaxed text-gray-700">
            [ SaaS Developer ]<br />[ Founder of{" "}
            <span className="text-[var(--primary-dark)] font-bold">
              SuperSave
            </span>{" "}
            ]<br />[ Building in public ]
          </p>
          <div className="absolute top-0 right-0 w-2 h-2 bg-[var(--primary-dark)]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-[var(--primary)]" />
        </div>
      </div>

      {/* Links with ASCII art style */}
      <div className="space-y-1 pt-5 border-t-2 border-[var(--border)]">
        <div className="text-sm font-mono text-gray-500 mb-3">[ CONNECT ]</div>
        {[
          { name: "GITHUB", url: "https://github.com/shaharishay14" },
          {
            name: "X",
            url: "https://x.com/shahar_ishay14?s=21&t=pHYwv3OZuImbn_TGDDxPIQ",
          },
          {
            name: "LINKEDIN",
            url: "https://www.linkedin.com/in/shahar-ishay-831762303/",
          },
        ].map((link, index) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm font-mono py-2 px-3 hover:bg-[var(--accent)] transition-all"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
              &gt;&gt;
            </span>
            <span className="text-gray-600 group-hover:text-[var(--primary)] transition-colors">
              {link.name}
            </span>
          </a>
        ))}
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 text-sm font-mono pt-3">
        <div className="w-2 h-2 bg-[var(--primary)] animate-pulse" />
        <span className="text-gray-500">ONLINE</span>
      </div>
    </aside>
  );
}
