"use client";

import { useEffect, useState } from "react";

type Platform = "android" | "ios" | "other";

function getPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "other";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

export function InstallBanner() {
  const [platform, setPlatform] = useState<Platform>("other");
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setInstalled(true);
      return;
    }
    setPlatform(getPlatform());

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as typeof deferredPrompt);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Already installed or user dismissed — show nothing
  if (installed || dismissed) return null;

  // Android: only show once we have the prompt event
  if (platform === "android" && !deferredPrompt) return null;

  // Desktop: skip
  if (platform === "other") return null;

  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setDeferredPrompt(null);
    }
  }

  return (
    <div
      style={{
        background: "white",
        border: "1.5px solid #e9d5ff",
        borderRadius: 14,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 2px 12px rgba(99,102,241,0.1)",
      }}
    >
      <span style={{ fontSize: 28, flexShrink: 0 }}>📲</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 1 }}>
          Add to home screen
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.4 }}>
          {platform === "ios"
            ? `Tap the share icon below, then "Add to Home Screen"`
            : "Install as an app — no App Store needed"}
        </div>
      </div>

      {platform === "android" && (
        <button
          onClick={handleInstall}
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            border: "none",
            borderRadius: 10,
            color: "white",
            fontSize: 12,
            fontWeight: 700,
            padding: "8px 14px",
            cursor: "pointer",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          Install
        </button>
      )}

      {platform === "ios" && showIOSHint && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1e1b4b",
            color: "white",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 12,
            whiteSpace: "nowrap",
            marginBottom: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}
        >
          Tap <strong>Share ↑</strong> → <strong>Add to Home Screen</strong>
        </div>
      )}

      {platform === "ios" && (
        <button
          onClick={() => setShowIOSHint((v) => !v)}
          style={{
            background: "#ede9fe",
            border: "none",
            borderRadius: 10,
            color: "#7c3aed",
            fontSize: 12,
            fontWeight: 700,
            padding: "8px 14px",
            cursor: "pointer",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          How?
        </button>
      )}

      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "none",
          border: "none",
          color: "#d1d5db",
          fontSize: 16,
          cursor: "pointer",
          padding: "0 2px",
          flexShrink: 0,
          lineHeight: 1,
        }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
