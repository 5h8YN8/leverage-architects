import { motion } from "framer-motion";

const problems = [
  "Hiring roles that AI can already handle — wasting salary and time",
  "No clarity on which hire will actually move revenue per employee",
  "Combining three jobs into one role and wondering why output drops",
  "Adding headcount instead of fixing broken workflows",
  "Hiring junior when the bottleneck requires senior judgment",
  "Making hiring decisions based on gut feel instead of data",
];

const ProblemSection = () => {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium text-accent tracking-widest uppercase mb-4">The Problem</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-12 max-w-2xl leading-tight">
            Most Teams Don't Know Who to Hire Next — So They Hire Wrong.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-start gap-3 p-4 rounded-lg bg-surface-elevated border border-border"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
              <span className="text-sm text-foreground leading-relaxed">{problem}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed"
        >
          Every bad hire lowers your revenue per employee. Every unnecessary hire does the same. 
          The difference between growing and scaling is knowing exactly who to add — and who not to.
        </motion.p>
      </div>
    </section>
  );
};

export default ProblemSection;
