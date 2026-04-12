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
          <p className="text-xs font-medium text-accent tracking-widest uppercase mb-4">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Get Your Hiring Plan in Minutes
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mb-10">
            Answer a few structured questions about your team, roles, and goals.
            Get back a complete hiring plan with clear recommendations — no fluff.
          </p>

          <div className="border border-border rounded-lg bg-surface-elevated p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">AI-Powered · Free · Takes 5 Minutes</span>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-3">
              Your hiring plan will show you:
            </h3>
            <ul className="space-y-2.5 mb-8">
              {[
                "The one role that will actually increase your output",
                "Which current or planned roles AI can replace or reduce",
                "Whether your next hire will improve or hurt revenue per employee",
                "Where your team is bottlenecked — and whether it's a people or process problem",
                "A 30-day action plan: who to hire, what to automate, what to stop",
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
              Generate My Free Hiring Plan →
            </a>
            <p className="text-xs text-accent font-medium mt-3">
              Custom AI hiring plan (typically $1,000+ value) — generated in minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DiagnosticSection;
