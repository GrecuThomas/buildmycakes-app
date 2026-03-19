import React, { useState } from 'react';
import { Home, Tag, Hammer, LogIn, Menu, X, ArrowRight, CheckCircle2 } from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  const navItems = [
    { name: 'Home', icon: <Home size={18} /> },
    { name: 'Pricing', icon: <Tag size={18} /> },
    { name: 'Builder', icon: <Hammer size={18} /> },
    { name: 'Log In', icon: <LogIn size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">Nexus</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeTab === item.name
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
              <div className="ml-4 pl-4 border-l border-slate-200">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-sm transition-all active:scale-95">
                  Get Started
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-200">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    activeTab === item.name
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
              <div className="pt-4 px-4">
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200">
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

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
                The most intuitive platform for builders and creators. Turn your complex ideas into beautiful realities with our drag-and-drop workspace.
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
                {['No code required', 'Real-time sync', 'Enterprise secure'].map((feature) => (
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
              <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
                <div className="h-8 border-b border-slate-100 bg-slate-50 flex items-center px-4 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center items-center gap-6">
                   <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-blue-600 rounded-full"></div>
                   </div>
                   <div className="grid grid-cols-3 gap-4 w-full">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="h-20 bg-slate-50 rounded-xl border border-slate-100 border-dashed animate-pulse"></div>
                      ))}
                   </div>
                   <div className="text-center">
                     <p className="text-slate-400 text-sm font-medium italic">Nexus Interface Preview</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Basic Footer */}
      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Nexus Technology Group. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
