const Footer = () => {
  return (
    <footer className="py-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">How It Works</h3>
            <a href="/getting-started" className="block text-sm text-slate-600 hover:text-slate-900">Getting Started</a>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">How To Videos</h3>
            <a href="/tutorials" className="block text-sm text-slate-600 hover:text-slate-900">Tutorials</a>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Pricing</h3>
            <a href="/pricing" className="block text-sm text-slate-600 hover:text-slate-900">Plans</a>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Blog</h3>
            <a href="/blog" className="block text-sm text-slate-600 hover:text-slate-900">Latest</a>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <a href="/about-us" className="block text-sm text-slate-600 hover:text-slate-900 mb-2">About Us</a>
            <a href="/support" className="block text-sm text-slate-600 hover:text-slate-900 mb-2">Support</a>
            <a href="/contact-us" className="block text-sm text-slate-600 hover:text-slate-900 mb-2">Contact Us</a>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} Build My Cakes. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="/terms-of-service" className="text-slate-600 hover:text-slate-900">Terms of Service</a>
            <a href="/privacy-policy" className="text-slate-600 hover:text-slate-900">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
