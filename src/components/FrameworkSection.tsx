import { motion } from "framer-motion";

const pillars = [
  {
    number: "01",
    title: "Compensation Distortion",
    description:
      "Salary bands misaligned with actual scope, market dynamics, and the leverage a role demands. Overpaying for execution, underpaying for judgment.",
  },
  {
    number: "02",
    title: "Scope Overload",
    description:
      "Roles absorbing responsibilities from adjacent functions without architectural intent. Three jobs packaged as one title, guaranteeing burnout and under-delivery.",
  },
  {
    number: "03",
    title: "Career Architecture Deficiency",
    description:
      "No visible trajectory. No structured growth model. Talent leaves not because of compensation — but because of ceiling.",
  },
  {
    number: "04",
    title: "Geographic Friction",
    description:
      "Location mandates without corresponding compensation calibration. In-office requirements eroding candidate pools without offsetting value.",
  },
  {
    number: "05",
    title: "AI Leverage Inefficiency",
    description:
      "Teams operating without AI workflow integration. Manual processes persisting where intelligent automation would multiply output by orders of magnitude.",
  },
  {
    number: "06",
    title: "Headcount Redundancy Risk",
    description:
      "Hiring roles that AI systems will subsume within 18 months. Building teams for yesterday's execution model instead of tomorrow's leverage architecture.",
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
