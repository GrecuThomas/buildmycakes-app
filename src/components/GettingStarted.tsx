import Navigation from "./Navigation";
import Footer from "./Footer";


const GettingStarted = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation tab="Getting Started" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold mb-6">Getting Started</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Welcome to Build My Cakes</h2>
            <p className="text-slate-600 leading-relaxed">
              Learn how to get started with Build My Cakes and create your first tiered cake design.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Step 1: Create an Account</h2>
            <p className="text-slate-600 leading-relaxed">
              Sign up for a free account to start designing cakes. You can upgrade later if you need more features.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Step 2: Explore the Builder</h2>
            <p className="text-slate-600 leading-relaxed">
              Once logged in, navigate to the builder to start designing your first cake. You'll find an intuitive interface with drag-and-drop functionality.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Step 3: Customize Your Design</h2>
            <p className="text-slate-600 leading-relaxed">
              Choose your cake tiers, adjust sizes, and customize colors and shapes to match your vision.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Need Help?</h2>
            <p className="text-slate-600 leading-relaxed">
              Check out our tutorials or contact our support team if you have any questions.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GettingStarted;
