import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "hitl-cookie-consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const setConsent = (value: "accepted" | "declined") => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[60] bg-background border border-border rounded-lg shadow-lg p-5"
    >
      <p className="text-sm text-foreground font-medium mb-1">We use cookies</p>
      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
        We use cookies and similar technologies to analyze site traffic and improve your experience. Read our{" "}
        <Link to="/privacy" className="text-accent hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setConsent("accepted")}
          className="text-xs font-medium bg-foreground text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          Accept
        </button>
        <button
          onClick={() => setConsent("declined")}
          className="text-xs font-medium border border-border text-foreground px-4 py-2 rounded-md hover:bg-secondary transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
