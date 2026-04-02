import { Mail, MessageCircle, HelpCircle, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import Navigation from "./Navigation";
import Footer from "./Footer";

const Support = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation tab="Support" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 leading-tight">
              We're Here to <span className="text-emerald-300">Help</span>
            </h1>
            <p className="text-lg text-blue-50 leading-relaxed">
              Have questions? Need assistance? Our support team is dedicated to helping you succeed with BuildMyCakes.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Quick Contact Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Email Support */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Mail className="text-blue-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Email Support</h3>
              <p className="text-slate-600 mb-6">Have a question? Send us an email and we'll get back to you within 24 hours.</p>
              <a href="mailto:support@buildmycakes.com" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                <Mail size={18} />
                support@buildmycakes.com
              </a>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
              <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Clock className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Response Time</h3>
              <div className="space-y-2 text-slate-600 mb-6">
                <p><strong>Email:</strong> Within 24 hours</p>
                <p><strong>Urgent Issues:</strong> Within 4 hours</p>
                <p><strong>Billing Questions:</strong> Within 2 hours</p>
              </div>
              <p className="text-sm text-slate-600">Our team works 7 days a week to support you.</p>
            </div>
          </div>
        </section>

        {/* Support Channels */}
        <section className="mb-20 bg-slate-100 rounded-2xl p-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-8">Multiple Ways to Get Help</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <HelpCircle className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tutorials</h3>
              <p className="text-slate-600 mb-4">Watch our comprehensive video tutorials to learn how to use BuildMyCakes.</p>
              <button onClick={() => router.navigate({ to: '/tutorials' })} className="text-blue-600 font-semibold hover:text-blue-700">
                Go to Tutorials →
              </button>
            </div>

            <div>
              <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Knowledge Base</h3>
              <p className="text-slate-600 mb-4">Browse our detailed documentation and troubleshooting guides.</p>
              <button className="text-emerald-600 font-semibold hover:text-emerald-700">
                View Knowledge Base →
              </button>
            </div>

            <div>
              <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Mail className="text-rose-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Email Support</h3>
              <p className="text-slate-600 mb-4">Send us an email for detailed support on any issue you encounter.</p>
              <a href="mailto:support@buildmycakes.com" className="text-rose-600 font-semibold hover:text-rose-700">
                Contact Support →
              </a>
            </div>
          </div>
        </section>

        {/* Common Issues Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
            <AlertCircle size={32} className="text-amber-600" />
            Troubleshooting Common Issues
          </h2>

          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Design Won't Save</h3>
              <p className="text-slate-600 mb-3">Try clearing your browser cache and cookies, then refresh the page. If the issue persists, try a different browser.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Export Quality Issues</h3>
              <p className="text-slate-600 mb-3">Make sure your browser is updated to the latest version. Lower quality exports may result from compatibility issues.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Login Issues</h3>
              <p className="text-slate-600 mb-3">Reset your password if you can't remember it. Check your email (including spam) for password reset instructions.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Slow Performance</h3>
              <p className="text-slate-600 mb-3">Close other browser tabs and applications. A stable internet connection is recommended for the best experience.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
