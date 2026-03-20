import Navigation from "./Navigation";
import Footer from "./Footer";

const Tutorials = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation tab="Tutorials" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold mb-6">How To Videos</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Video Tutorials</h2>
            <p className="text-slate-600 leading-relaxed">
              Our comprehensive video tutorials will guide you through every step of the cake design process.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Getting Started with the Builder</h2>
            <p className="text-slate-600 leading-relaxed">
              Learn the basics of our drag-and-drop builder interface and how to navigate the platform.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Advanced Design Techniques</h2>
            <p className="text-slate-600 leading-relaxed">
              Master advanced techniques to create complex and beautiful cake designs.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Exporting Your Designs</h2>
            <p className="text-slate-600 leading-relaxed">
              Learn how to export your designs in various formats for use in your business.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tutorials;
