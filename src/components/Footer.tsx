const Footer = () => {
  return (
    <footer className="py-6 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
            <a href="/getting-started" className="block text-sm text-slate-600 hover:text-slate-900">Getting Started</a>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">How To Videos</h3>
            <a href="/tutorials" className="block text-sm text-slate-600 hover:text-slate-900">Tutorials</a>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Pricing</h3>
            <a href="/pricing-checkout" className="block text-sm text-slate-600 hover:text-slate-900">Plans</a>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Blog</h3>
            <a href="/blog" className="block text-sm text-slate-600 hover:text-slate-900">Latest</a>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Company</h3>
            <a href="/about-us" className="block text-sm text-slate-600 hover:text-slate-900 mb-1">About Us</a>
            <a href="/support" className="block text-sm text-slate-600 hover:text-slate-900 mb-1">Support</a>
            <a href="/contact-us" className="block text-sm text-slate-600 hover:text-slate-900 mb-1">Contact Us</a>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-sm mb-2 md:mb-0">&copy; {new Date().getFullYear()} Build My Cakes. All rights reserved.</p>
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
