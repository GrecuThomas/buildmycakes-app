import Navigation from "./Navigation";
import Footer from "./Footer";
import { ArrowRight, CreditCard, PlayCircle, Sparkles, UserPlus } from "lucide-react";


const GettingStarted = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation tab="Getting Started" />
      
      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(135deg,#eff6ff_0%,#f8fafc_45%,#eef2ff_100%)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
                  <Sparkles size={16} />
                  Start designing right away
                </div>
                <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Getting started is simple.
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
                  Create an account, jump in, and start building cakes immediately. You can follow the tutorials if you want a guided path, or head straight into the builder and start experimenting on your own.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="/sign-up"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
                  >
                    Create your account
                    <ArrowRight size={18} />
                  </a>
                  <a
                    href="/builder"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition-colors hover:border-slate-400 hover:bg-slate-100"
                  >
                    Go to the builder
                  </a>
                </div>
              </div>

              <div className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-sm">
                <div className="rounded-2xl bg-slate-900 px-5 py-5 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Quick start</p>
                  <p className="mt-3 text-2xl font-bold">1. Sign up</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Your free account gets you into the platform right away, no complicated setup required.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500">Path one</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">Watch tutorials</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Learn the basics, pick up workflows faster, and build confidence as you go.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500">Path two</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">Start creating</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Open the builder and experiment freely if you prefer learning by doing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <UserPlus size={22} />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-slate-900">Create your account</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Start with a free account and get access to the core tools you need to design and explore the platform.
              </p>
              <a href="/sign-up" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
                Sign up now
                <ArrowRight size={16} />
              </a>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <PlayCircle size={22} />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-slate-900">Choose your learning style</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Watch the tutorials for a guided introduction, or skip the hand-holding and jump straight into the builder.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/tutorials" className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200">
                  View tutorials
                </a>
                <a href="/builder" className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  Open builder
                </a>
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <CreditCard size={22} />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-slate-900">Use it free or support us</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                You can absolutely use Build My Cakes for free. If you decide to subscribe, you help support the project and unlock extras that make your workflow smoother and more hassle free.
              </p>
              <a href="/pricing-checkout" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
                See subscription options
                <ArrowRight size={16} />
              </a>
            </article>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] bg-slate-900 px-8 py-10 text-white shadow-2xl shadow-slate-300/50 sm:px-10 lg:px-12 lg:py-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">Ready when you are</p>
                  <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Start free, learn fast, and upgrade when it makes sense.</h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                    The fastest way to begin is to create your account and try it. If you want guidance, the tutorials are there. If you already have ideas, head straight to the builder and start creating.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <a href="/sign-up" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100">
                    Create account
                  </a>
                  <a href="/pricing-checkout" className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                    Explore subscriptions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GettingStarted;
