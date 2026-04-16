import { ArrowRight, Wand2, Eye, Smartphone, Save, ChevronRight, Star, X, Download } from "lucide-react";
import React from "react";
import { useRouter } from "@tanstack/react-router";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { GoogleAdBanner } from "./GoogleAdBanner";
import { copyTemplateSketch } from "../server/projects.functions";

const communityDesigns = [
  {
    id: "classic-wedding",
    sketchId: "45403174-55ad-4b9e-aea0-bd1cdf170015", // Add real UUID when created in DB
    eyebrow: "Three-Tier Elegance",
    title: "Classic Wedding Cake",
    description: "Elegant stacked tiers with soft florals and a timeless finish.",
    icon: "🎂",
    gradient: "from-rose-300 via-pink-200 to-blue-300",
    cakeImage: "main_page_cakes/1.jpg",
    sketchImage: "main_page_cakes/sketches/1.png?v=2",
  },
  {
    id: "birthday-rainbow",
    sketchId: "8b5c3d2e-0f4g-58c9-b2d3-4e6f8g0h2i3j",
    eyebrow: "Rainbow Delight",
    title: "Colorful Birthday Cake",
    description: "Playful portrait-style design with bold color bands and toppers.",
    icon: "🧁",
    gradient: "from-amber-300 via-orange-200 to-rose-300",
    cakeImage: "main_page_cakes/2.jpg",
    sketchImage: "main_page_cakes/sketches/1.png?v=2",
  },
  {
    id: "minimalist-modern",
    sketchId: "9c6d4e3f-1g5h-69d0-c3e4-5f7g9h1i3j4k",
    eyebrow: "Modern Chic",
    title: "Minimalist Masterpiece",
    description: "Clean geometry, crisp edges, and metallic accents for a modern look.",
    icon: "✨",
    gradient: "from-slate-300 via-zinc-200 to-violet-300",
    cakeImage: "main_page_cakes/3.jpg",
    sketchImage: "main_page_cakes/sketches/1.png?v=2",
  },
  {
    id: "garden-party",
    sketchId: "0d7e5f4g-2h6i-70e1-d4f5-6g8h0i2j4k5l",
    eyebrow: "Garden Romance",
    title: "Floral Party Centerpiece",
    description: "A tall floral-forward cake with layered petals and soft spring tones.",
    icon: "🌸",
    gradient: "from-pink-300 via-rose-200 to-emerald-200",
    cakeImage: "main_page_cakes/4.jpg",
    sketchImage: "main_page_cakes/sketches/1.png?v=2",
  },
];

const App = () => {
  const router = useRouter();
  const [selectedDesign, setSelectedDesign] = React.useState<typeof communityDesigns[0] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <Navigation tab="Home" />
      {/* Hero Content */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Design your <span className="text-blue-600">next tiered cake</span> in minutes.
              </h1>

              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                The most intuitive platform for builders and creators. Turn your complex ideas into beautiful realities with our drag-and-drop
                workspace.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button onClick={() => router.navigate({ to: '/builder' })} className="group flex items-center justify-center gap-2 whitespace-nowrap bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:translate-y-[-2px] shadow-xl shadow-slate-200">
                  Start Building
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.navigate({ to: '/sign-up' })}
                  className="flex items-center justify-center gap-2 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:translate-y-[-2px] shadow-xl shadow-blue-200"
                >
                  Create Free Account
                </button>
                <button className="flex items-center justify-center gap-2 whitespace-nowrap bg-white border border-slate-200 hover:border-slate-300 px-8 py-4 rounded-2xl font-bold text-slate-700 transition-all hover:bg-slate-50" onClick={() => router.navigate({ to: '/tutorials' })}>
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Visual Element / Placeholder */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
                <div className="h-8 border-b border-slate-100 bg-slate-50 flex items-center px-4 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="flex-1 overflow-hidden flex items-center justify-center bg-slate-50">
                  <img src="/BuildMyCakes.png" alt="Build My Cake Interface" className="max-w-full max-h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
              Why Designers Choose BuildMyCakes
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to create stunning tiered cakes with professional results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Wand2 className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Intuitive Drag & Drop</h3>
              <p className="text-slate-600">No design experience needed. Drag, drop, and customize with our intuitive editor.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all">
              <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Eye className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Real-time Preview</h3>
              <p className="text-slate-600">See your changes instantly. Watch your cake design come to life as you create.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Smartphone className="text-amber-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Fully Responsive</h3>
              <p className="text-slate-600">Your designs look perfect on all devices. Mobile, tablet, and desktop compatible.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all">
              <div className="bg-rose-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Save className="text-rose-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Save & Share</h3>
              <p className="text-slate-600">Store your designs, share with clients, and export in multiple formats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
              Get Your Design in 4 Simple Steps
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From concept to beautiful tiered cake in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 md:gap-4">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Choose Your Base</h3>
                <p className="text-slate-600">Select cake size, shape, and foundation style</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ChevronRight className="text-slate-300" size={32} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Design Tiers</h3>
                <p className="text-slate-600">Add, arrange, and customize each cake tier</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ChevronRight className="text-slate-300" size={32} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Customize Details</h3>
                <p className="text-slate-600">Add colors, decorations, and finishing touches</p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ChevronRight className="text-slate-300" size={32} />
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-lg">
                  4
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Export & Share</h3>
                <p className="text-slate-600">Download or share your beautiful creation with your customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
              Beautiful Cakes Built by Our Community
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              See what our users created starting with our sketches and templates. Click any cake to see the sketch and customize it in the builder!
            </p>
          </div>

          <div className="-mx-4 px-4 overflow-x-auto pb-4 [scrollbar-width:thin] [scrollbar-color:#94a3b8_transparent]">
            <div className="flex gap-6 snap-x snap-mandatory min-w-max">
              {communityDesigns.map((design) => (
                <article
                  key={design.id}
                  onClick={() => setSelectedDesign(design)}
                  className="group snap-start w-[20rem] sm:w-[21rem] shrink-0 rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${design.gradient} aspect-[3/4] relative flex items-center justify-center p-6 overflow-hidden`}>
                  {design.cakeImage && (
                    <img
                      src={design.cakeImage}
                      alt={design.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none z-20">
                    <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View & Edit</span>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <p className="text-slate-600 text-sm leading-6">{design.description}</p>
                </div>
              </article>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sketch Comparison Modal */}
      {selectedDesign && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedDesign(null)}
        >
          <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-2xl font-bold text-slate-900">{selectedDesign.title}</h3>
              <button
                onClick={() => setSelectedDesign(null)}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-0 p-8">
              {/* Cake Image */}
              <div className="flex flex-col gap-4">
                <h4 className="text-lg font-semibold text-slate-900">Final Cake Design</h4>
                <div className="w-full md:max-w-[96%] mr-auto rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[20rem] md:min-h-[24rem] flex items-center justify-center p-4">
                  {selectedDesign.cakeImage ? (
                    <img
                      src={selectedDesign.cakeImage}
                      alt="Cake"
                      className="max-w-full max-h-[65vh] object-contain"
                    />
                  ) : (
                    <div className="text-slate-400 text-center">
                      <p className="text-4xl mb-2">{selectedDesign.icon}</p>
                      <p>Cake image coming soon</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sketch Image */}
              <div className="flex flex-col gap-4">
                <h4 className="text-lg font-semibold text-slate-900">Blueprint Sketch</h4>
                <div className="w-full md:max-w-[96%] mr-auto rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[20rem] md:min-h-[24rem] flex items-center justify-center p-4">
                  {selectedDesign.sketchImage ? (
                    <img
                      src={selectedDesign.sketchImage}
                      alt="Sketch"
                      className="max-w-full max-h-[65vh] object-contain"
                    />
                  ) : (
                    <div className="text-slate-400 text-center">
                      <p className="text-4xl mb-2">📐</p>
                      <p>Sketch image coming soon</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-200 bg-slate-50 flex gap-4 justify-end">
              <button
                onClick={() => setSelectedDesign(null)}
                className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const { supabase } = await import("../lib/supabase");
                    const { data: sessionData } = await supabase.auth.getSession();
                    
                    if (!sessionData?.session) {
                      // Not logged in - redirect to sign up
                      router.navigate({ to: '/sign-up' });
                      setSelectedDesign(null);
                      return;
                    }

                    // Copy the template sketch
                    const result = await copyTemplateSketch({
                      data: {
                        sketchId: selectedDesign.sketchId,
                        authToken: sessionData.session.access_token,
                      },
                    });

                    if (result.success && result.project) {
                      // Navigate to builder with the new project
                      router.navigate({
                        to: '/builder',
                        search: { projectId: result.project.id },
                      });
                      setSelectedDesign(null);
                    } else {
                      alert('Error loading sketch: ' + (result.error || 'Unknown error'));
                    }
                  } catch (error: any) {
                    alert('Error: ' + error.message);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                {isLoading ? 'Loading...' : 'Load Sketch in Builder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Proof Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Stat 1 */}
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-2">2,500+</div>
              <p className="text-lg text-blue-100">Cakes Designed</p>
            </div>
            {/* Stat 2 */}
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-2">15,000+</div>
              <p className="text-lg text-blue-100">Happy Users</p>
            </div>
            {/* Stat 3 */}
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-2">4.9★</div>
              <p className="text-lg text-blue-100">Out of 5 Stars</p>
            </div>
          </div>

          <div className="border-t border-blue-400 pt-12">
            <h3 className="text-3xl font-bold text-center mb-12">What Users Love About Us</h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-300 text-amber-300" />
                  ))}
                </div>
                <p className="text-blue-50 mb-4 italic">
                  "BuildMyCakes has completely transformed my cake design process. What used to take hours now takes minutes!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-300 flex items-center justify-center font-bold text-sm">
                    SJ
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-blue-200">Professional Baker</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-300 text-amber-300" />
                  ))}
                </div>
                <p className="text-blue-50 mb-4 italic">
                  "The interface is so intuitive, even my team members without design experience can create beautiful cakes!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-300 flex items-center justify-center font-bold text-sm">
                    MC
                  </div>
                  <div>
                    <p className="font-semibold">Maria Chen</p>
                    <p className="text-sm text-blue-200">Cake Studio Owner</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-300 text-amber-300" />
                  ))}
                </div>
                <p className="text-blue-50 mb-4 italic">
                  "Amazing tool! I've already recommended it to 10 of my baker friends. Absolute game-changer!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center font-bold text-sm">
                    AR
                  </div>
                  <div>
                    <p className="font-semibold">Alex Rivera</p>
                    <p className="text-sm text-blue-200">Pastry Chef</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Ad Banner */}
      <section className="bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <GoogleAdBanner
            adSlot="YOUR_AD_SLOT_ID"
            adClient="ca-pub-xxxxxxxxxxxxxxxx"
            adFormat="auto"
          />
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default App;
