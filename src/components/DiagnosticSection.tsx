import { motion } from "framer-motion";

const CUSTOM_GPT_URL = "https://chatgpt.com/g/g-69372515ad4881918df4d4c2f4080477-hire-for-revenue-per-employee";

const DiagnosticSection = () => {
  return (
    <section id="diagnostic" className="py-24 md:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-medium text-accent tracking-widest uppercase mb-4">Interactive</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Run Your AI Workforce Architecture Hiring Diagnostic
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mb-10">
            Answer structured questions about your next hire or team structure.
            Receive an executive risk dashboard powered by AI in minutes.
          </p>

          <div className="border border-border rounded-lg bg-surface-elevated p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">AI-Powered Analysis</span>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-3">
              What you'll get:
            </h3>
            <ul className="space-y-2.5 mb-8">
              {[
                "AI Workforce Architecture Score (1–10)",
                "Compensation Alignment analysis",
                "Scope Complexity breakdown",
                "AI Leverage Efficiency rating",
                "Headcount Redundancy Risk assessment",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={CUSTOM_GPT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-foreground text-primary-foreground px-6 py-3.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Free: Start Your Hiring Diagnostic
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DiagnosticSection;
