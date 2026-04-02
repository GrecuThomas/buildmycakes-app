import { ArrowRight, Wand2, Eye, Smartphone, Save, ChevronRight, Star, Users } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { GoogleAdBanner } from "./GoogleAdBanner";

const App = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <Navigation tab="Home" />
      {/* Hero Content */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Design your <span className="text-blue-600">next tiered cake</span> in minutes.
              </h1>

              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                The most intuitive platform for builders and creators. Turn your complex ideas into beautiful realities with our drag-and-drop
                workspace.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button onClick={() => router.navigate({ to: '/builder' })} className="group flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:translate-y-[-2px] shadow-xl shadow-slate-200">
                  Start Building
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 px-8 py-4 rounded-2xl font-bold text-slate-700 transition-all hover:bg-slate-50" onClick={() => router.navigate({ to: '/tutorials' })}>
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
              See what our users created starting with our sketches and templates. Get inspired by the endless possibilities!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gallery Item 1 */}
            <div className="group rounded-2xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all">
              <div className="bg-gradient-to-br from-rose-300 to-blue-300 h-64 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl mb-2">🎂</div>
                  <p className="font-semibold">Three-Tier Elegance</p>
                </div>
              </div>
              <div className="p-6 bg-white">
                <h3 className="font-bold text-lg text-slate-900 mb-2">Classic Wedding Cake</h3>
                <p className="text-slate-600 text-sm mb-4">Elegant three-tier design with cascading flowers</p>
                <button className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                  View Design <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Gallery Item 2 */}
            <div className="group rounded-2xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all">
              <div className="bg-gradient-to-br from-amber-300 to-rose-300 h-64 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl mb-2">🧁</div>
                  <p className="font-semibold">Rainbow Delight</p>
                </div>
              </div>
              <div className="p-6 bg-white">
                <h3 className="font-bold text-lg text-slate-900 mb-2">Colorful Birthday Cake</h3>
                <p className="text-slate-600 text-sm mb-4">Vibrant multi-colored tiers with custom toppers</p>
                <button className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                  View Design <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Gallery Item 3 */}
            <div className="group rounded-2xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all">
              <div className="bg-gradient-to-br from-slate-300 to-purple-300 h-64 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl mb-2">✨</div>
                  <p className="font-semibold">Modern Chic</p>
                </div>
              </div>
              <div className="p-6 bg-white">
                <h3 className="font-bold text-lg text-slate-900 mb-2">Minimalist Masterpiece</h3>
                <p className="text-slate-600 text-sm mb-4">Sleek geometric design with metallic accents</p>
                <button className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                  View Design <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-bold transition-all hover:translate-y-[-2px] shadow-lg">
              See All Designs
            </button>
          </div>
        </div>
      </section>

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
