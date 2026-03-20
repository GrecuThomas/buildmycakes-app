import Navigation from "./Navigation";
import Footer from "./Footer";

const Blog = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation tab="Blog" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold mb-6">Latest Blog Posts</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Welcome to Our Blog</h2>
            <p className="text-slate-600 leading-relaxed">
              Stay updated with the latest news, tips, and trends in cake design and decorating.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Featured Articles</h2>
            <p className="text-slate-600 leading-relaxed">
              Discover our most popular articles about cake design trends, techniques, and inspiration.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Design Inspiration</h2>
            <p className="text-slate-600 leading-relaxed">
              Get inspired by showcasing beautiful cake designs from our community and experts.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mt-8 mb-4">Tips and Tricks</h2>
            <p className="text-slate-600 leading-relaxed">
              Learn valuable tips and tricks to improve your cake decorating skills.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
