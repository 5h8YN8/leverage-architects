import { motion } from "framer-motion";

const PhilosophySection = () => {
  return (
    <section id="philosophy" className="py-24 md:py-32 bg-surface-elevated relative">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-medium text-accent tracking-widest uppercase mb-4">Philosophy</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
            We Don't Fill Seats.{" "}
            <span className="text-gradient">We Architect Leverage.</span>
          </h2>
          <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>In the AI era, the cost of a mis-hire is not salary.</p>
            <p>It is structural drag.</p>
            <p>We design teams before we recruit for them.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;
