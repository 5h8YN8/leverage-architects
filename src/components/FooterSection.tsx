const FooterSection = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border py-12">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Human in the Loop<span className="text-accent ml-1">Talent</span>
            </p>
            <p className="text-xs text-muted-foreground">
              AI-Augmented Workforce Architecture
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="mailto:hello@humaninthelooptalent.com"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <button
              onClick={() => scrollTo("diagnostic")}
              className="text-xs font-medium bg-foreground text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Run Hiring Diagnostic
            </button>
            <a
              href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3rhwJR5Cbxz8tOya1Sg6tFEqPy6pioM-j_s0AzeRnMthx0HI5hANo-K9pfzpUl3L_L2XVqgSA3?gv=true"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium border border-border text-foreground px-4 py-2 rounded-md hover:bg-secondary transition-colors"
            >
              Book Free Consultation
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Human in the Loop Talent. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
