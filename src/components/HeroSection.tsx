import { motion } from "framer-motion";
import HumanInTheLoopAnimation from "./HumanInTheLoopAnimation";

const CUSTOM_GPT_URL = "https://chatgpt.com/g/g-69372515ad4881918df4d4c2f4080477-hire-for-revenue-per-employee";

const HeroSection = () => {
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
                AI-Powered Hiring Plan — Free in Minutes
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-foreground mb-6">
              Know Exactly Who to Hire to{" "}
              <br />
              <span className="text-gradient">Increase Revenue Per Employee</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-4">
              <strong className="text-foreground">Stop guessing. Start hiring for revenue per employee.</strong>
              <br className="hidden sm:block" />
              {" "}Get a personalized hiring plan that tells you who to hire, who not to hire, 
              what to automate, and how to improve output — without adding unnecessary headcount.
            </p>

            <p className="text-sm text-muted-foreground mb-10">
              Answer a few questions → get a personalized hiring plan in minutes
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-3">
              <a
                href={CUSTOM_GPT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-foreground text-primary-foreground px-6 py-3.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity text-center"
              >
                Generate My Free Hiring Plan →
              </a>
              <a
                href="https://calendar.app.google/uwpZw9K6raiwU3m29"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border text-foreground px-6 py-3.5 rounded-md text-sm font-medium hover:bg-secondary transition-colors text-center"
              >
                Execute My Hiring Plan Now
              </a>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground text-center sm:text-left">
                Know exactly who to hire (or not) in the next 30 days to improve revenue per employee
              </p>
              <p className="text-xs text-accent font-medium text-center sm:text-left">
                Custom AI hiring plan (typically $1,000+ value) — generated in minutes
              </p>
            </div>
          </motion.div>

          {/* Animated loop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="shrink-0 flex justify-center scale-75 md:scale-100"
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
