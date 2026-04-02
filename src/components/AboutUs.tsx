import { Users, Lightbulb, Heart, Rocket } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import Navigation from "./Navigation";
import Footer from "./Footer";

const AboutUs = () => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation tab="About Us" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 leading-tight">
              About <span className="text-emerald-300">BuildMyCakes</span>
            </h1>
            <p className="text-lg text-blue-50 leading-relaxed">
              We're on a mission to empower cake designers and creators with intuitive tools that bring their visions to life. Discover our story, values, and the team behind BuildMyCakes.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Our Mission Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                BuildMyCakes is dedicated to democratizing cake design. We believe that every baker, whether professional or hobbyist, should have access to powerful, intuitive design tools.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our goal is simple: turn complex cake design into a simple, enjoyable process that allows creators to focus on their artistry rather than struggling with pens and papers.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl h-80 flex items-center justify-center">
              <Lightbulb size={120} className="text-blue-600 opacity-30" />
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="mb-20 bg-white rounded-2xl p-12 border border-slate-200">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Our Story</h2>
          <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
            <p>
              BuildMyCakes was founded by a group of passionate cake designers who grew frustrated with existing design tools. They were either too complex, too expensive, or simply didn't understand the unique needs of cake makers.
            </p>
            <p>
              In 2026, a small team decided to change this. They spent months understanding the workflow of professional bakers, learning about their pain points, and designing a solution that would truly serve their needs.
            </p>
            <p>
              Today, BuildMyCakes has helped thousands of bakers design beautiful tiered cakes faster than ever before. From small home businesses to professional cake studios, our platform is transforming how cake design is approached.
            </p>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-12 text-center">Why Choose BuildMyCakes?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Rocket className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Innovative Design</h3>
              <p className="text-slate-600">Built by designers, for designers. Every feature is crafted with your workflow in mind.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all">
              <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Community Focused</h3>
              <p className="text-slate-600">Join thousands of bakers worldwide. Share designs, get inspired, and grow together.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all">
              <div className="bg-rose-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Heart className="text-rose-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Customer First</h3>
              <p className="text-slate-600">Your success is our success. We listen, iterate, and continuously improve.</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-12 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
                JD
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Jessica Davis</h3>
              <p className="text-slate-600 font-semibold mb-3">Founder & Creative Lead</p>
              <p className="text-slate-600">Professional pastry chef with 10+ years of experience. Passionate about making design accessible.</p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
                MK
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Marcus Kim</h3>
              <p className="text-slate-600 font-semibold mb-3">Head of Engineering</p>
              <p className="text-slate-600">Full-stack developer and tech visionary. Building products that delight millions.</p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-rose-400 to-rose-600 w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
                SR
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Sarah Rodriguez</h3>
              <p className="text-slate-600 font-semibold mb-3">Director of Customer Success</p>
              <p className="text-slate-600">Dedicated to listening to customers and shaping the future of BuildMyCakes.</p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12 border border-blue-200">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">🎨 Creativity</h3>
              <p className="text-slate-600 leading-relaxed">We champion creative expression and believe great tools should inspire, not limit.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">🤝 Community</h3>
              <p className="text-slate-600 leading-relaxed">We thrive by connecting creators, sharing knowledge, and uplifting each other.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">⚡ Innovation</h3>
              <p className="text-slate-600 leading-relaxed">We constantly push boundaries, experiment, and improve to stay ahead.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">💙 Integrity</h3>
              <p className="text-slate-600 leading-relaxed">We believe in transparency, honesty, and doing right by our community.</p>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-12 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <div className="text-5xl font-extrabold text-blue-600 mb-2">15,000+</div>
              <p className="text-xl text-slate-600 font-semibold">Active Users</p>
              <p className="text-slate-600 mt-2">Bakers and designers worldwide who trust BuildMyCakes.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <div className="text-5xl font-extrabold text-emerald-600 mb-2">2,500+</div>
              <p className="text-xl text-slate-600 font-semibold">Cakes Designed</p>
              <p className="text-slate-600 mt-2">Beautiful tiered cakes created with our platform.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <div className="text-5xl font-extrabold text-rose-600 mb-2">4.9★</div>
              <p className="text-xl text-slate-600 font-semibold">User Rating</p>
              <p className="text-slate-600 mt-2">Loved by our community. Your trust means everything.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 px-8 rounded-2xl text-white text-center">
          <h2 className="text-4xl font-extrabold mb-4">Ready to Join Our Community?</h2>
          <p className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto">
            Start designing beautiful tiered cakes today. Join thousands of bakers transforming their craft.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => router.navigate({ to: '/builder' })} className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
              Start Building
            </button>
            <button onClick={() => router.navigate({ to: '/tutorials' })} className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">
              Watch Tutorials
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
