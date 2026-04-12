import { useState } from "react";
import { motion } from "framer-motion";
import LoopLogo from "./LoopLogo";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="section-container flex items-center justify-between h-16">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <LoopLogo size={22} />
          Human in the Loop<span className="text-accent ml-1">Talent</span>
        </button>

         <div className="hidden md:flex items-center gap-8">
          {[
            ["Framework", "framework"],
            ["Services", "services"],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </button>
          ))}
          <a
            href="https://humaninthelooptalent.com/insights/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Insights
          </a>
          <a
            href="https://chatgpt.com/g/g-69372515ad4881918df4d4c2f4080477-hire-for-revenue-per-employee"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium bg-foreground text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Run Hiring Diagnostic
          </a>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {mobileOpen ? (
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" />
            ) : (
              <>
                <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-border bg-background"
        >
          <div className="section-container py-4 flex flex-col gap-3">
            {[
              ["Framework", "framework"],
              ["Services", "services"],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {label}
              </button>
            ))}
            <a
              href="https://chatgpt.com/g/g-69372515ad4881918df4d4c2f4080477-hire-for-revenue-per-employee"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileOpen(false)}
            >
              Run Hiring Diagnostic
            </a>
            <a
              href="https://humaninthelooptalent.com/insights/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileOpen(false)}
            >
              Insights
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
