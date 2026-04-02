import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "system" | "user";
  text: string;
}

const questions = [
  { key: "roleTitle", prompt: "What's the role title you're hiring for?" },
  { key: "responsibilities", prompt: "What are the core responsibilities of this role?" },
  { key: "salaryBand", prompt: "What's the target salary band? (e.g., $120k–$160k)" },
  { key: "workModel", prompt: "What's the work model? (Remote / Hybrid / In-office)" },
  { key: "location", prompt: "What location or geography is this role tied to?" },
  { key: "aiTools", prompt: "What AI tools does your team currently use, if any?" },
  { key: "reason", prompt: "What's the primary reason for this hire?" },
];

const generateScores = () => ({
  overall: Math.floor(Math.random() * 3) + 6,
  compensation: Math.floor(Math.random() * 4) + 5,
  scope: Math.floor(Math.random() * 4) + 5,
  aiLeverage: Math.floor(Math.random() * 4) + 4,
  redundancy: Math.floor(Math.random() * 4) + 4,
});

const ScoreBar = ({ label, score }: { label: string; score: number }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-sm">
      <span className="text-foreground font-medium">{label}</span>
      <span className="text-accent font-mono">{score}/10</span>
    </div>
    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score * 10}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full bg-accent rounded-full"
      />
    </div>
  </div>
);

const DiagnosticSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", text: questions[0].prompt },
  ]);
  const [currentQ, setCurrentQ] = useState(0);
  const [input, setInput] = useState("");
  const [completed, setCompleted] = useState(false);
  const [scores, setScores] = useState<ReturnType<typeof generateScores> | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", text: input.trim() },
    ];

    const nextQ = currentQ + 1;
    if (nextQ < questions.length) {
      newMessages.push({ role: "system", text: questions[nextQ].prompt });
      setMessages(newMessages);
      setCurrentQ(nextQ);
    } else {
      newMessages.push({ role: "system", text: "Analyzing your workforce architecture..." });
      setMessages(newMessages);
      setTimeout(() => {
        setScores(generateScores());
        setCompleted(true);
      }, 1500);
    }
    setInput("");
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = () => {
    setMessages([{ role: "system", text: questions[0].prompt }]);
    setCurrentQ(0);
    setInput("");
    setCompleted(false);
    setScores(null);
  };

  return (
    <section id="diagnostic" className="py-24 md:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs font-medium text-accent tracking-widest uppercase mb-4">Interactive</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 max-w-2xl leading-tight">
            Run Your AI Workforce Architecture Diagnostic
          </h2>
          <p className="text-base text-muted-foreground max-w-xl">
            Answer structured questions about your next hire or team structure.
            Receive an executive risk dashboard in minutes.
          </p>
        </motion.div>

        <div className="max-w-2xl">
          <div className="border border-border rounded-lg bg-surface-elevated overflow-hidden">
            {/* Chat header */}
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">Workforce Architecture Diagnostic</span>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-4 min-h-[300px] max-h-[400px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-foreground text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Score dashboard */}
              {completed && scores && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-background border border-border rounded-lg p-6 space-y-6"
                >
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                      AI Workforce Architecture Score
                    </p>
                    <span className="text-5xl font-bold text-accent">{scores.overall}</span>
                    <span className="text-2xl text-muted-foreground font-light"> / 10</span>
                  </div>

                  <div className="space-y-4">
                    <ScoreBar label="Compensation Alignment" score={scores.compensation} />
                    <ScoreBar label="Scope Complexity" score={scores.scope} />
                    <ScoreBar label="AI Leverage Efficiency" score={scores.aiLeverage} />
                    <ScoreBar label="Headcount Redundancy Risk" score={scores.redundancy} />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => scrollTo("services")}
                      className="flex-1 bg-foreground text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Discuss Your Architecture
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 border border-border text-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
                    >
                      Run Again
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            {!completed && (
              <div className="px-5 py-4 border-t border-border">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your answer..."
                    className="flex-1 bg-background border border-border rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-foreground text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticSection;
