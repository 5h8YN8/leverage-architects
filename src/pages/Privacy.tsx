import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We collect information you provide directly to us, including your name, email address, company name, and any other information you choose to provide when filling out our diagnostic assessment, booking a consultation, or contacting us via email. We also automatically collect certain technical information when you visit our website, including your IP address, browser type, operating system, and browsing behavior through cookies and similar technologies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services; to communicate with you about our services, including sending you diagnostic results and follow-up materials; to respond to your inquiries and schedule consultations; and to analyze usage patterns to improve our website and service offerings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">3. Information Sharing</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, provided those parties agree to keep this information confidential. We may also disclose your information when required by law or to protect our rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">4. Data Security</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">5. Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our website may use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, some features of our website may not function properly without cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. Third-Party Links</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our website may contain links to third-party websites, including Google Calendar for booking consultations. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. Your Rights</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have the right to access, correct, or delete your personal information. You may also opt out of receiving marketing communications from us at any time. To exercise any of these rights, please contact us at inquiry@humanintheloop.com.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">8. Changes to This Policy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our website after changes are posted constitutes your acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">9. Contact Us</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:hello@humaninthelooptalent.com" className="text-accent hover:underline">
                hello@humaninthelooptalent.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
