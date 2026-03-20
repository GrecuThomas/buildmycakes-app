import Navigation from "./Navigation";
import Footer from "./Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation tab="About Us" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold mb-6">About Us</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              Build My Cakes is dedicated to empowering cake designers and creators with intuitive tools to bring their visions to life.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Our Story</h2>
            <p className="text-slate-600 leading-relaxed">
              Founded by passionate cake designers, Build My Cakes started with a simple idea: to make advanced cake design tools accessible to everyone.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Our Team</h2>
            <p className="text-slate-600 leading-relaxed">
              Our diverse team of designers, developers, and bakers work together to create the best platform for cake design.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Our Values</h2>
            <p className="text-slate-600 leading-relaxed">
              We believe in innovation, creativity, and supporting our community of cake designers and enthusiasts.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
