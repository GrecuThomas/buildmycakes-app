import Navigation from "./Navigation";
import Footer from "./Footer";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation tab="Contact Us" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Get In Touch</h2>
            <p className="text-slate-600 leading-relaxed">
              Have a question or feedback? We'd love to hear from you! Reach out to our team.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Email Support</h2>
            <p className="text-slate-600 leading-relaxed">
              Send us an email at support@buildmycakes.com and we'll get back to you as soon as possible.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Response Time</h2>
            <p className="text-slate-600 leading-relaxed">
              We typically respond to support inquiries within 24 hours during business days.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Other Ways to Connect</h2>
            <p className="text-slate-600 leading-relaxed">
              Follow us on social media or check out our community forums to connect with other cake designers.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
