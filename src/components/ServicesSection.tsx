import { motion } from "framer-motion";

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs font-medium text-accent tracking-widest uppercase mb-4">Engagement</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Aligned Partnership Models
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border border-border rounded-lg p-8 bg-surface-elevated hover:border-accent/30 transition-colors"
          >
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-foreground">17%</span>
              <span className="text-sm text-muted-foreground">Exclusive Model</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For companies committed to a single strategic hiring partner. Lower fee.
              Deeper calibration. No parallel recruiters.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-border rounded-lg p-8 bg-surface-elevated hover:border-accent/30 transition-colors"
          >
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-foreground">20%</span>
              <span className="text-sm text-muted-foreground">Retained Search</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For leverage-critical roles requiring precision execution. Deep market
              mapping. Structured assessment. Full architecture alignment.
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
          Every engagement begins with workforce architecture alignment.
        </motion.p>
      </div>
    </section>
  );
};

export default ServicesSection;
