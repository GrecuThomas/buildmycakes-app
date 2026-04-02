import Navigation from "./Navigation";
import Footer from "./Footer";

const Tutorials = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation tab="Tutorials" />
      
      {/* Hero Section with Blue Background */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 leading-tight">
                Our Full Library of <span className="text-emerald-300">Tutorials</span><br />
                Teaches You All the Basics of BuildMyCakes
              </h1>
              <p className="text-lg text-blue-50 leading-relaxed">
                Can't find a tutorial for your question below? Check out our FAQ page or contact our stellar support. We can help you learn all the ins and outs of our subscription manager.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img src="/general_usage.gif" alt="Tutorials Demo" className="max-w-full h-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">How to Build a Basic Cake</h2>
            <p className="text-slate-600 leading-relaxed">
              Learn the fundamentals of creating your first cake. We'll walk you through selecting your base, adding tiers, and adjusting sizing to get started with BuildMyCakes.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">How to Add Decorations</h2>
            <p className="text-slate-600 leading-relaxed">
              Master the art of decorating your cakes. Discover how to add colors, patterns, flowers, and other decorative elements to make your designs truly unique and eye-catching.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">How to Export</h2>
            <p className="text-slate-600 leading-relaxed">
              Save and share your creations. Learn how to export your cake designs in various formats and share them with clients or collaborate with your team.
            </p>
          </section>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tutorials;
