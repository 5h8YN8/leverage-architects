import { motion } from "framer-motion";
import HumanInTheLoopAnimation from "./HumanInTheLoopAnimation";
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      
      {/* Accent glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="section-container relative z-10 py-32 md:py-0">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
                AI-Augmented Workforce Architecture
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-foreground mb-6">
              In the AI Era, You Don't Scale Headcount.{" "}
              <span className="text-gradient">You Scale Leverage.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10">
              Human in the Loop designs AI-augmented product teams and hires the roles
              that multiply human judgment with AI systems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo("diagnostic")}
                className="bg-foreground text-primary-foreground px-6 py-3.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Run Your AI Workforce Architecture Diagnostic
              </button>
              <button
                onClick={() => scrollTo("framework")}
                className="border border-border text-foreground px-6 py-3.5 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
              >
                Explore Our Framework
              </button>
            </div>
          </motion.div>

          {/* Animated loop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="shrink-0 hidden md:block"
          >
            <HumanInTheLoopAnimation />
          </motion.div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 accent-line" />
    </section>
  );
};

export default HeroSection;
