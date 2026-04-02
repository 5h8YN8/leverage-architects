import { motion } from "framer-motion";

const SocialProofSection = () => {
  return (
    <section className="py-20 md:py-24 bg-surface-elevated relative">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-12 h-px bg-accent mx-auto mb-8" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Designed for AI-native and product-led companies scaling intelligently.
          </p>
          <div className="w-12 h-px bg-accent mx-auto mt-8" />
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;
