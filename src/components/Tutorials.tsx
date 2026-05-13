import Navigation from "./Navigation";
import Footer from "./Footer";
import { StickyRailAds } from "./StickyRailAds";
import { GoogleAdBanner } from "./GoogleAdBanner";

const Tutorials = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <StickyRailAds />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <GoogleAdBanner adSlot="4633851948" adFormat="horizontal" className="mb-4" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-2xl">
          <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">How to Build a Basic Cake</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              The builder is the heart of BuildMyCakes. Here's how to create your first design from scratch:
            </p>
            <ol className="list-decimal list-outside ml-6 space-y-3 text-slate-600 leading-relaxed">
              <li>
                <strong className="text-slate-800">Open the Builder</strong> — Navigate to the <em>Builder</em> page from the top menu. You'll see a canvas area in the middle, a tier panel on the right, and a decorations panel on the left.
              </li>
              <li>
                <strong className="text-slate-800">Choose a shape</strong> — Click on the tier to open its settings. You can choose between <em>Circle</em>, <em>Square</em>, and <em>Hexagon</em> shapes. Platform variants are also available if you need a separator between tiers.
              </li>
              <li>
                <strong className="text-slate-800">Set the size</strong> — Adjust the width and height using the sliders or input fields. Width is measured in inches and represents the diameter (for circles) or the side length (for squares and hexagons).
              </li>
              <li>
                <strong className="text-slate-800">Choose a cake type</strong> — Select the cake type (Sponge, Chocolate, Pound, Cheesecake, or Styrofoam dummy) for each tier. This affects the estimated weight shown in the sidebar.
              </li>
              <li>
                <strong className="text-slate-800">Add more tiers</strong> — Repeat the process to stack multiple tiers. Tiers are displayed top to bottom in the layer panel on the right. Drag them to reorder.
              </li>
              <li>
                <strong className="text-slate-800">Review the weight summary</strong> — The bottom of the right sidebar shows the total estimated weight in kg and lbs, plus a breakdown per tier. This helps you plan transport and structural support.
              </li>
            </ol>
          </section>

          <div className="py-6">
            <GoogleAdBanner adSlot="4633851948" adFormat="horizontal" />
          </div>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">How to Add Decorations</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Decorations let you visually plan flowers, leaves, and other elements on your cake design:
            </p>
            <ol className="list-decimal list-outside ml-6 space-y-3 text-slate-600 leading-relaxed">
              <li>
                <strong className="text-slate-800">Add a decoration</strong> — Click any icon in the library to place it on the canvas.
              </li>
              <li>
                <strong className="text-slate-800">Position it</strong> — Click and drag the decoration on the canvas to move it to the exact position you want on the cake.
              </li>
              <li>
                <strong className="text-slate-800">Resize and rotate</strong> — Select the decoration to reveal its handles. Drag the corner handle to resize, use the rotation handle to angle it, use the "Bring to front" button to bring the decoration on the first layer of the image, and the flip button to flip the decoration.
              </li>
              <li>
                <strong className="text-slate-800">Layer multiple decorations</strong> — Add as many decorations as you need and export when ready.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">How to Save and Export</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Once your design is ready, you can save it to your account or export it as an image or PDF:
            </p>
            <ol className="list-decimal list-outside ml-6 space-y-3 text-slate-600 leading-relaxed">
              <li>
                <strong className="text-slate-800">Save your project</strong> — Click <em>Save Project</em> in the toolbar. Give your design a name and it will be stored in your account. You can return to it any time from the builder.
              </li>
              <li>
                <strong className="text-slate-800">Export as PNG or PDF</strong> — Click the <em>Export</em> button and choose your format. PNG gives you a high-quality image; PDF is better for printing or sharing with clients.
              </li>
              <li>
                <strong className="text-slate-800">Free tier exports</strong> — If you're on the free plan, an ad will play for 30 seconds before your download begins. This supports the platform and keeps it free to use.
              </li>
              <li>
                <strong className="text-slate-800">Pro &amp; Sprint exports</strong> — Subscribers get immediate, watermark-free downloads with no wait time. <em>Sprint Pass</em> gives you 24-hour unlimited access; <em>Pro</em> is a monthly subscription for regular users.
              </li>
            </ol>
          </section>

          <div className="py-6">
            <GoogleAdBanner adSlot="4633851948" adFormat="horizontal" />
          </div>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Subscription Plans Explained</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              BuildMyCakes offers three tiers of access:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-3 text-slate-600 leading-relaxed">
              <li>
                <strong className="text-slate-800">Free</strong> — Full access to the builder, unlimited designs, and exports with a short ad and watermark. Great for occasional use.
              </li>
              <li>
                <strong className="text-slate-800">Sprint Pass</strong> — A one-time payment for 24 hours of unlimited, watermark-free exports. Ideal if you have a big batch of designs to get through.
              </li>
              <li>
                <strong className="text-slate-800">Pro</strong> — Monthly subscription for professionals who need clean exports every day. Includes priority support and all future features as they ship.
              </li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              You can upgrade, downgrade, or cancel your subscription at any time from the <em>Subscription</em> page in your account.
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
