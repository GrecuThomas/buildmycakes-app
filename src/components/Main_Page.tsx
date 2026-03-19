import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navigation from "./Navigation";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <Navigation tab="Home" />
      {/* Hero Content */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider border border-blue-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                New: AI Builder V2.0 is out
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Design your <span className="text-blue-600">future</span> in minutes.
              </h1>

              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                The most intuitive platform for builders and creators. Turn your complex ideas into beautiful realities with our drag-and-drop
                workspace.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button className="group flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:translate-y-[-2px] shadow-xl shadow-slate-200">
                  Start Building
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 px-8 py-4 rounded-2xl font-bold text-slate-700 transition-all hover:bg-slate-50">
                  Watch Demo
                </button>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8">
                {["No code required", "Real-time sync", "Enterprise secure"].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {feature}
                  </div>
                ))}
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

      {/* Basic Footer */}
      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Build My Cake. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
