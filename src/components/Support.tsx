import Navigation from "./Navigation";
import Footer from "./Footer";

const Support = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation tab="Support" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold mb-6">Support</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">How Can We Help?</h2>
            <p className="text-slate-600 leading-relaxed">
              Our support team is here to help you with any questions or issues you may encounter while using Build My Cakes.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Common Questions</h2>
            <p className="text-slate-600 leading-relaxed">
              Find answers to frequently asked questions about features, account management, and troubleshooting.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Technical Support</h2>
            <p className="text-slate-600 leading-relaxed">
              If you're experiencing technical issues, we're here to help you resolve them quickly.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Contact Our Team</h2>
            <p className="text-slate-600 leading-relaxed">
              For more complex issues, reach out to our support team directly and we'll be happy to assist you.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
