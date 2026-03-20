import Navigation from "./Navigation";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation tab="Privacy Policy" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p className="text-slate-600 leading-relaxed">
              Build My Cakes ('we' or 'us' or 'our') operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our website.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">2. Information Collection and Use</h2>
            <p className="text-slate-600 leading-relaxed">
              We collect several different types of information for various purposes to provide and improve our website to you.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">3. Types of Data Collected</h2>
            <p className="text-slate-600 leading-relaxed">
              Personal Data may include email addresses, first name and last name, phone number, address, state, province, ZIP/postal code, city, and cookies and usage data.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">4. Use of Data</h2>
            <p className="text-slate-600 leading-relaxed">
              Build My Cakes uses the collected data for various purposes such as providing and maintaining our website, notifying you about changes in our website, and allowing you to participate in interactive features of our website.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">5. Security of Data</h2>
            <p className="text-slate-600 leading-relaxed">
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
