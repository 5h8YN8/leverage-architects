import { motion } from "framer-motion";

const pillars = [
  {
    number: "01",
    title: "AI Replacement Score",
    description:
      "See which roles on your team (or on your hiring plan) can be partially or fully handled by AI. Stop paying for work that doesn't need a human.",
  },
  {
    number: "02",
    title: "Role Clarity Check",
    description:
      "Find out if your next hire has a clearly defined outcome — or if you're about to create a vague role that drags down output and confuses your team.",
  },
  {
    number: "03",
    title: "Bottleneck Diagnosis",
    description:
      "Identify whether your slowdown is a people problem or a process problem. Most teams hire when they should redesign. This tells you which one.",
  },
  {
    number: "04",
    title: "Headcount Efficiency Rating",
    description:
      "Get a clear score on how much output you're generating per person. See where you're overstaffed, understaffed, or misallocated.",
  },
  {
    number: "05",
    title: "Hiring Urgency Assessment",
    description:
      "Not how fast you want to hire — how fast you should. Based on your budget, stage, and bottlenecks. Most teams overestimate urgency.",
  },
  {
    number: "06",
    title: "30-Day Hiring Roadmap",
    description:
      "A step-by-step plan for the next 30 days: who to hire, what to automate, and what to stop doing. Not theory — a concrete action plan.",
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
          <p className="text-xs font-medium text-accent tracking-widest uppercase mb-4">What You Get</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground max-w-3xl leading-tight">
            Your Hiring Plan Covers Six Critical Decisions
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
