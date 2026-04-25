"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Disc3, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Wrong password");
      }
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-5"
      style={{
        background: "#ffffff",
        color: "#1a1612",
        fontFamily: "Fraunces, serif",
      }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .mono { font-family: 'JetBrains Mono', monospace; }
        .serif { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="relative max-w-md w-full">
        <div className="flex items-center gap-2 justify-center mb-8 mono text-[11px] tracking-[0.25em] uppercase opacity-60">
          <Disc3 size={14} />
          <span>Studio J · For Josh Wilkins</span>
        </div>

        <div className="p-8" style={{ background: "#fbf7ee", border: "1.5px solid #1a1612" }}>
          <div className="mono text-[11px] tracking-[0.25em] uppercase opacity-60 mb-2">Door staff</div>
          <h1 className="serif mb-1" style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>
            Members <em style={{ fontWeight: 400 }}>only</em>.
          </h1>
          <p className="serif italic mb-6" style={{ fontSize: 16, color: "#5a4d3c" }}>
            Have a word with the producer if you've forgotten the password.
          </p>

          <form onSubmit={submit}>
            <div className="p-3 mb-3" style={{ background: "transparent", border: "1.5px solid #1a1612" }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  color: "#1a1612",
                }}
              />
            </div>

            {error && (
              <div
                className="mono text-[12px] p-3 mb-3"
                style={{ background: "#f5d9c4", border: "1.5px solid #9a3b1a", color: "#6b2a12" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-2 py-4 serif"
              style={{
                background: "#1a1612",
                color: "#f5efe4",
                border: "1.5px solid #1a1612",
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                cursor: loading || !password ? "not-allowed" : "pointer",
                opacity: loading || !password ? 0.5 : 1,
                boxShadow: "4px 4px 0 #1a1612",
                transition: "all 0.15s ease",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Checking...
                </>
              ) : (
                <>
                  Step in <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
