import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By accessing and using the Human in the Loop Talent website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. Description of Services</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Human in the Loop Talent provides AI-augmented workforce architecture consulting services, including but not limited to hiring diagnostics, workforce planning, role design, and talent acquisition strategy. Our diagnostic assessment tool provides preliminary analysis and recommendations based on the information you provide.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">3. Use of Services</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services in any way that could damage, disable, or impair our website or interfere with any other party's use of our services. You are responsible for maintaining the confidentiality of any account information and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">4. Intellectual Property</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All content on this website, including text, graphics, logos, frameworks, methodologies, and software, is the property of Human in the Loop Talent and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">5. Diagnostic Assessment</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our diagnostic assessment tool is provided for informational purposes only and does not constitute professional advice. The results and recommendations generated are based on the information you provide and general industry knowledge. Actual outcomes may vary. We recommend consulting with our team for a comprehensive analysis tailored to your specific situation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. Consultations</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free consultations are subject to availability and are offered at our discretion. We reserve the right to modify, suspend, or discontinue consultation offerings at any time. Booking a consultation does not create a binding contract for services until a separate engagement agreement is executed by both parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. Limitation of Liability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, Human in the Loop Talent shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability for any claim arising from these Terms or our services shall not exceed the amount you paid us in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">8. Indemnification</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless Human in the Loop Talent, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of our services or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">9. Modifications</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of our services after any changes constitutes acceptance of the revised Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">10. Governing Law</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising under these Terms shall be resolved through good-faith negotiation, and if necessary, binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">11. Contact Us</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:inquiry@humanintheloop.com" className="text-accent hover:underline">
                inquiry@humanintheloop.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
