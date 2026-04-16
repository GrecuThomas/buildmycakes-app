import { ArrowRight, CheckCircle2, Clock3, Layers3, Rocket, Sparkles, Wand2 } from "lucide-react";
import Navigation from "./Navigation";
import Footer from "./Footer";

const roadmapSections = [
  {
    title: "Coming next",
    description: "The improvements we want to tackle soonest to make the builder more useful day to day.",
    accent: "from-blue-500 to-cyan-500",
    icon: Clock3,
    items: [
      "More decorative tools and a larger library of flowers and leaves",
      "Smarter pricing support to help turn cake designs into cleaner quotes",
      "Better project organization so saved designs are easier to revisit and manage",
    ],
  },
  {
    title: "Planned after that",
    description: "Features that add more flexibility once the core workflow feels solid.",
    accent: "from-emerald-500 to-teal-500",
    icon: Layers3,
    items: [
      "More export options and cleaner files for sharing with clients",
      "Expanded tutorial content and more guided onboarding throughout the site",
      "Additional builder controls for faster customisation and less repetitive work",
    ],
  },
  {
    title: "Longer term",
    description: "Bigger ideas we would like to add as Build My Cakes keeps growing.",
    accent: "from-violet-500 to-fuchsia-500",
    icon: Rocket,
    items: [
      "Client-friendly workflows for presenting and discussing designs",
      "Collaboration features for teams and studios",
      "More advanced tools for making the full design-to-delivery process hassle free",
    ],
  },
];

const Roadmap = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation tab="Roadmap" />

      <main>
        <section className="bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#1d4ed8_100%)] px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur-sm">
                <Sparkles size={16} />
                What we are planning next
              </div>
              <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                The Build My Cakes roadmap.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-200 sm:text-xl">
                This page is a straightforward look at the features we want to add in the future. Some are focused on making the builder faster and more flexible, and some are aimed at making the whole workflow easier from first sketch to final delivery.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">Roadmap focus</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold text-white">Make designing faster</p>
                  <p className="mt-1 text-sm leading-6 text-slate-200">Reduce friction inside the builder and expand what users can do without workarounds.</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold text-white">Make the platform more helpful</p>
                  <p className="mt-1 text-sm leading-6 text-slate-200">Add tools, guidance, and upgrades that make the site more valuable over time.</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold text-white">Make the workflow smoother</p>
                  <p className="mt-1 text-sm leading-6 text-slate-200">Improve organisation, exports, and future client-facing features so everything feels more hassle free.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-3">
            {roadmapSections.map((section) => {
              const Icon = section.icon;

              return (
                <article key={section.title} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${section.accent} text-white shadow-lg`}>
                    <Icon size={24} />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-slate-900">{section.title}</h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">{section.description}</p>
                  <ul className="mt-6 space-y-4">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-slate-700">
                        <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-600" />
                        <span className="leading-7">{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Wand2 size={22} />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-slate-900">Why this roadmap matters</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                The goal is not to add features for the sake of it. The goal is to keep making Build My Cakes more practical, more creative, and easier to use for real cake design work.
              </p>
            </div>

            <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-300/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-blue-200">
                <ArrowRight size={22} />
              </div>
              <h2 className="mt-6 text-3xl font-bold">Building forward, one useful feature at a time</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                You can use the platform right now, and this roadmap shows where we want to take it next. As new features are added, this page can evolve into the public snapshot of what is coming and what is already on the way.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Roadmap;