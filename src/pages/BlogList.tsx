import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock, Heart, Eye } from 'lucide-react';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { blogPosts } from '../data/blogPosts';

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const categories = ['All', 'Garment Care', 'Tips & Tricks', 'Business', 'Seasonal Tips', 'Comparison', 'Emergency Tips'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const handleGetQuote = () => {
    navigate('/', { state: { scrollToCalculator: true } });
  };

  // SEO metadata for blog listing page
  usePageMetadata({
    title: 'Garment Care Blog | Professional Ironing Tips & Guides | Daily Ironing Service',
    description: 'Expert tips and guides for garment care, ironing techniques, and fabric maintenance. Learn from professional ironing specialists in South Surrey, Langley, and White Rock.',
    keywords: 'garment care blog, ironing tips, fabric care, professional ironing, clothing maintenance, South Surrey, Langley, White Rock',
    ogImage: '/Untitled (1920 x 780 px) (1).png'
  });

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.categories.includes(selectedCategory));

  // Fetch articles from Supabase
  const [supabaseArticles, setSupabaseArticles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { BlogArticleService } = await import('../services/blogArticleService');
        const articles = await BlogArticleService.getBlogArticles();
        setSupabaseArticles(articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Combine Supabase articles with fallback articles
  const allPosts = supabaseArticles.length > 0 ? supabaseArticles.map(article => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    author: article.author,
    date: article.created_at,
    readTime: article.readTime,
    categories: article.categories || ['Garment Care'], // Use categories from database
    image: article.image
  })) : filteredPosts;

  const displayPosts = selectedCategory === 'All' 
    ? allPosts 
    : allPosts.filter(post => post.categories.includes(selectedCategory));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#2C3E50' }}>
              Garment Care <span style={{ color: '#E87461' }}>Blog</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: '#2C3E50' }}>
              Expert tips, guides, and insights for keeping your clothes looking their absolute best
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  style={{
                    background: selectedCategory === category ? 'linear-gradient(to right, #f97316, #ef4444)' : 'transparent',
                    color: selectedCategory === category ? 'white' : '#2C3E50'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                // Loading skeleton
                [...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                displayPosts.map((post) => (
                  <article key={post.slug} className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
                    <div className="relative">
                      <img 
                        src={post.image}
                        alt={`${post.title} - Professional garment care blog post`}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                        width="400"
                        height="192"
                      />
                      <div className="absolute top-4 left-4">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: '#E87461' }}
                        >
                          {post.categories[0] || 'General'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-3 line-clamp-2" style={{ color: '#2C3E50' }}>
                        {post.title}
                      </h2>
                      <p className="text-sm mb-4 line-clamp-3" style={{ color: '#2C3E50' }}>
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs mb-4" style={{ color: '#2C3E50' }}>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center space-x-2 font-medium hover:opacity-70 transition-colors"
                        style={{ color: '#E87461' }}
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 text-white" style={{ backgroundColor: '#2C3E50' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Stay Updated with Garment Care Tips
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get the latest tips, guides, and exclusive offers delivered to your inbox
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-orange-500"
                  style={{ color: '#2C3E50' }}
                />
                <button
                  className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogList;