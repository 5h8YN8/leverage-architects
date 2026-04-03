import { motion } from "framer-motion";

const pillars = [
  {
    number: "01",
    title: "AI Readiness",
    description:
      "Teams operating without AI workflow integration. Manual processes persisting where intelligent automation would multiply output by orders of magnitude. The gap between where AI could take you and where you actually are.",
  },
  {
    number: "02",
    title: "Role Clarity",
    description:
      "Ownership undefined. Roadmap, growth, and AI initiatives either unowned, concentrated in the founder, or scattered across people who weren't hired for them. Structural ambiguity disguised as flexibility.",
  },
  {
    number: "03",
    title: "Execution Bottleneck Severity",
    description:
      "The drag coefficient on your velocity. Founder dependency, slow shipping, bloated coordination — the compounding friction that makes every sprint feel like a quarter.",
  },
  {
    number: "04",
    title: "Leverage Opportunity",
    description:
      "The inverse of your readiness. Where AI can multiply your existing team instead of adding headcount. The higher this score, the more you're leaving on the table by hiring before redesigning.",
  },
  {
    number: "05",
    title: "Hiring Urgency",
    description:
      "Not how fast you want to hire — how fast you should. Budget, stage, bottleneck severity, and whether the problem is a people problem or a process problem. Most teams overestimate this score.",
  },
  {
    number: "06",
    title: "Execution Roadmap",
    description:
      "A 90-day hiring and operations plan calibrated to your scores. Month 1: redesign, clarify, brief. Month 2: open search on the right roles. Month 3: onboarding with defined outcomes. Not a report — a playbook.",
  },
];

const FrameworkSection = () => {
  return (
    <section id="framework" className="py-24 md:py-32 bg-surface-elevated relative">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs font-medium text-accent tracking-widest uppercase mb-4">The Model</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground max-w-3xl leading-tight">
            The AI-Augmented Workforce Architecture Model
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-background p-8 flex flex-col"
            >
              <span className="text-xs font-mono text-accent mb-4">{pillar.number}</span>
              <h3 className="text-lg font-semibold text-foreground mb-3">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrameworkSection;
