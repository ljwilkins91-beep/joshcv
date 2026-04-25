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
    } catch (err) {
      setError("Couldn't reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-5"
      style={{ background: "#0e0c0a", color: "#e8e0d2", fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232, 132, 26, 0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-md w-full">
        <div className="flex items-center gap-2 justify-center mb-10">
          <Disc3 size={26} style={{ color: "#e8841a" }} />
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 40,
              letterSpacing: "0.15em",
              lineHeight: 1,
            }}
          >
            STUDIO <span style={{ color: "#e8841a" }}>J</span>
          </div>
        </div>

        <div
          className="p-8"
          style={{
            background: "linear-gradient(180deg, #1a1612 0%, #15110d 100%)",
            border: "1px solid #2a2420",
            borderRadius: 2,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#e8841a",
              marginBottom: 8,
            }}
          >
            Door staff
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 32,
              letterSpacing: "0.04em",
              color: "#f5ead6",
              marginBottom: 4,
            }}
          >
            Members only.
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: 17,
              color: "#9a8a74",
              marginBottom: 24,
            }}
          >
            Have a word with the producer if you've forgotten the password.
          </div>

          <form onSubmit={submit}>
            <div
              className="p-3 mb-3"
              style={{ background: "#0a0806", border: "1px solid #2a2420", borderRadius: 2 }}
            >
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
                  color: "#e8e0d2",
                }}
              />
            </div>

            {error && (
              <div
                className="p-3 mb-3"
                style={{
                  background: "#2a0f0a",
                  border: "1px solid #7a2617",
                  color: "#ff9999",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  borderRadius: 2,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-2 py-4"
              style={{
                background:
                  "linear-gradient(180deg, #e8841a 0%, #b85c0a 100%)",
                color: "#0e0c0a",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 22,
                letterSpacing: "0.1em",
                border: "none",
                borderRadius: 2,
                cursor: loading || !password ? "not-allowed" : "pointer",
                opacity: loading || !password ? 0.5 : 1,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 0 #6b3506",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  Step in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
