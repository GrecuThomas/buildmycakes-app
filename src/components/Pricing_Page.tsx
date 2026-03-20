import Navigation from "./Navigation";
import Footer from "./Footer";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <Navigation tab="Pricing" />
      {/* Hero Content */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 flex flex-col text-center items-center">
              <h2 className="text-[40px] font-bold text-slate-900 mb-6">Free</h2>
              <div className="space-y-2 text-black text-[20px]">
                <p>2 saved designs</p>
                <p>max 2 tiers per cake</p>
                <p>view-only + watermarks</p>
                <p>access to square shape</p>
                <p>ad-supported content</p>
              </div>
              <button className="mt-6 px-6 py-2 border-2 border-slate-900 text-slate-900 rounded-full font-semibold hover:bg-slate-900 hover:text-white transition-colors">
                Start for Free
              </button>
              <p className="mt-3 text-[14px] font-bold text-slate-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                No credit card required
              </p>
              <div className="flex-1"></div>
            </div>

            {/* Standard Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 flex flex-col text-center items-center">
              <h2 className="text-[40px] font-bold text-blue-600 mb-6">Standard</h2>
              <div className="space-y-2 text-blue-600 text-[20px]">
                <p>unlimited sketch exports</p>
                <p>unlimited saved designs</p>
                <p>high-quality PNG/PDF exports</p>
                <p>simple pricing logic</p>
                <p>no ads</p>
                <p>access to additional content</p>
              </div>
              <button className="mt-6 px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                Upgrade
              </button>
              <p className="mt-3 text-[14px] font-bold text-blue-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                4.99$/month
              </p>
              <p className="text-[14px] font-bold text-blue-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                or pay anually and save 15% (50.99$/year)
              </p>
              <div className="flex-1"></div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 flex flex-col text-center items-center">
              <h2 className="text-[40px] font-bold text-red-600 mb-6">Pro</h2>
              <div className="space-y-2 text-red-600 text-[20px]">
                <p>unlimited sketch exports</p>
                <p>unlimited saved designs</p>
                <p>high-quality PNG/PDF exports</p>
                <p>simple pricing logic</p>
                <p>no ads</p>
                <p>access to additional content</p>
                <p>priority customer support</p>
                <p>early access to new features</p>
              </div>
              <button className="mt-6 px-6 py-2 border-2 border-red-600 text-red-600 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-colors">
                Upgrade
              </button>
              <p className="mt-3 text-[14px] font-bold text-red-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                14.99$/month
              </p>
              <p className="text-[14px] font-bold text-red-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                or pay anually and save 15% (152.89$/year)
              </p>
              <div className="flex-1"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default App;
