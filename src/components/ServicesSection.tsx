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
          Most companies hire for roles.
          <br />
          We design for leverage—then hire accordingly.
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
            We don't get paid to fill roles.
            <br />
            We get paid to build teams that produce outsized output with AI.
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
            <h3 className="text-xl font-bold text-foreground mb-2">Exclusive Partnership</h3>
            <p className="text-sm font-medium text-accent mb-4">
              Deeper alignment. Lower noise. Higher signal.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              For companies committed to a single strategic hiring partner.
              We embed into your team, define the right roles, and execute with full context.
            </p>
            <p className="text-xs text-muted-foreground/60">
              17% placement fee
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-border rounded-lg p-8 bg-surface-elevated hover:border-accent/30 transition-colors flex flex-col"
          >
            <h3 className="text-xl font-bold text-foreground mb-2">Retained Search</h3>
            <p className="text-sm font-medium text-accent mb-4">
              For roles that define your company's trajectory.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              Used when precision matters—early hires, leadership, or leverage-critical roles.
              Includes market mapping, structured assessment, and full architecture alignment.
            </p>
            <p className="text-xs text-muted-foreground/60">
              20% retained engagement
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
