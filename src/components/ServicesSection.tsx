import { motion } from "framer-motion";

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="section-container">
        {/* Bridge statement */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-sm md:text-base text-muted-foreground mb-16 leading-relaxed max-w-xl"
        >
          Most companies plan around headcount.
          <br />
          We design for leverage before staffing choices are made.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs font-medium text-accent tracking-widest uppercase mb-4">How We Work With You</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            Aligned for Outcomes, Not Placements
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            We don't use the canvas to make employment decisions.
            <br />
            We help teams clarify structure, ownership, and AI leverage for
            human-led planning.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border border-border rounded-lg p-8 bg-surface-elevated hover:border-accent/30 transition-colors flex flex-col"
          >
            <h3 className="text-xl font-bold text-foreground mb-2">Planning Partnership</h3>
            <p className="text-sm font-medium text-accent mb-4">
              Deeper alignment. Lower noise. Higher signal.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              For companies clarifying where leverage should come from before
              making organizational or staffing choices.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Planning scope defined by engagement
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-border rounded-lg p-8 bg-surface-elevated hover:border-accent/30 transition-colors flex flex-col"
          >
            <h3 className="text-xl font-bold text-foreground mb-2">Architecture Review</h3>
            <p className="text-sm font-medium text-accent mb-4">
              For teams that need clearer ownership and operating leverage.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              Used when workflows, AI adoption, and accountability need to be
              mapped before people-process decisions are made.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Advisory scope defined by engagement
            </p>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-sm text-muted-foreground italic"
        >
          Every engagement starts with defining where leverage actually comes from.
        </motion.p>
      </div>
    </section>
  );
};

export default ServicesSection;
