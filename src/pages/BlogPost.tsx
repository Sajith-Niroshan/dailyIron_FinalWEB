import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Heart, Facebook, Twitter, Linkedin, Mail, Eye } from 'lucide-react';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { blogPosts } from '../data/blogPosts';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [likes, setLikes] = React.useState(0);
  const [views, setViews] = React.useState(0);
  const [hasLiked, setHasLiked] = React.useState(false);
  const [isLiking, setIsLiking] = React.useState(false);
  const [relatedArticles, setRelatedArticles] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const { BlogArticleService } = await import('../services/blogArticleService');
        const fetchedArticle = await BlogArticleService.getBlogArticleBySlug(slug);
        
        if (fetchedArticle) {
          setArticle(fetchedArticle);
          setLikes(fetchedArticle.likes || 0);
          setViews(fetchedArticle.views || 0);
          
          // Increment view count when article is loaded
          BlogArticleService.incrementArticleViews(fetchedArticle.id);
          
          // Check if user has already liked this article
          const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
          setHasLiked(likedArticles.includes(fetchedArticle.id));
          
          // Fetch related articles from Supabase
          try {
            const allArticles = await BlogArticleService.getBlogArticles();
            // Filter out the current article and get up to 3 related articles
            const filteredArticles = allArticles
              .filter(relatedArticle => relatedArticle.slug !== slug)
              .slice(0, 3);
            setRelatedArticles(filteredArticles);
          } catch (relatedError) {
            console.error('Error fetching related articles:', relatedError);
            // Fallback to empty array if fetching related articles fails
            setRelatedArticles([]);
          }
        } else {
          // Fallback to hardcoded articles
          const fallbackArticle = blogPostsData[slug as keyof typeof blogPostsData];
          if (fallbackArticle) {
            setArticle(fallbackArticle);
            setLikes(0);
            setViews(0);
            
            // For fallback articles, use other fallback articles as related
            const otherFallbackArticles = Object.entries(blogPostsData)
              .filter(([key]) => key !== slug)
              .slice(0, 3)
              .map(([key, article]) => ({
                ...article,
                slug: key
              }));
            setRelatedArticles(otherFallbackArticles);
          } else {
            setError('Article not found');
          }
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        // Fallback to hardcoded articles
        const fallbackArticle = blogPostsData[slug as keyof typeof blogPostsData];
        if (fallbackArticle) {
          setArticle(fallbackArticle);
          setLikes(0);
          setViews(0);
          
          // For fallback articles, use other fallback articles as related
          const otherFallbackArticles = Object.entries(blogPostsData)
            .filter(([key]) => key !== slug)
            .slice(0, 3)
            .map(([key, article]) => ({
              ...article,
              slug: key
            }));
          setRelatedArticles(otherFallbackArticles);
        } else {
          setError('Article not found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleLike = async () => {
    if (!article || hasLiked || isLiking) return;
    
    setIsLiking(true);
    
    try {
      const { BlogArticleService } = await import('../services/blogArticleService');
      const result = await BlogArticleService.incrementArticleLikes(article.id);
      
      if (result.success && result.newLikesCount !== undefined) {
        setLikes(result.newLikesCount);
        setHasLiked(true);
        
        // Store in localStorage to prevent multiple likes
        const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
        likedArticles.push(article.id);
        localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
      }
    } catch (error) {
      console.error('Error liking article:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = (platform: string) => {
    if (!article) return;
    
    const url = window.location.href;
    const title = article.title;
    const text = article.excerpt || `Check out this article: ${title}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\nRead more: ${url}`)}`;
        break;
      default:
        return;
    }
    
    if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // SEO metadata for individual blog posts
  React.useEffect(() => {
    if (article) {
      const publishedDate = new Date(article.created_at || article.date).toISOString();
      
      // Use the hook to set metadata
      const metadata = {
        title: `${article.title} | Daily Ironing Service Blog`,
        description: article.excerpt || `Learn about ${article.title.toLowerCase()} from professional ironing experts in South Surrey, Langley, and White Rock.`,
        keywords: `${article.title}, garment care, ironing tips, ${article.categories?.join(', ')}, Daily Ironing Service`,
        ogTitle: article.title,
        ogDescription: article.excerpt,
        ogImage: article.image,
        ogType: 'article',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": article.title,
          "description": article.excerpt,
          "image": article.image,
          "author": {
            "@type": "Organization",
            "name": article.author,
            "url": "https://dailyironing.ca"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Daily Ironing Service",
            "logo": {
              "@type": "ImageObject",
              "url": "/Neighbourhood.png"
            }
          },
          "datePublished": publishedDate,
          "dateModified": publishedDate,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://dailyironing.ca/blog/${slug}`
          },
          "articleSection": article.categories?.[0] || "Garment Care",
          "keywords": article.categories?.join(', ') || "garment care, ironing"
        }
      };
      
      // Manually update metadata since we can't use the hook inside useEffect
      document.title = metadata.title;
      
      const updateMetaTag = (name: string, content: string, property?: boolean) => {
        const attribute = property ? 'property' : 'name';
        let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
        
        if (element) {
          element.content = content;
        } else {
          element = document.createElement('meta');
          element.setAttribute(attribute, name);
          element.content = content;
          document.head.appendChild(element);
        }
      };

      updateMetaTag('description', metadata.description);
      updateMetaTag('keywords', metadata.keywords);
      updateMetaTag('og:title', metadata.ogTitle, true);
      updateMetaTag('og:description', metadata.ogDescription, true);
      updateMetaTag('og:type', metadata.ogType, true);
      updateMetaTag('og:image', metadata.ogImage, true);
      
      // Add structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(metadata.structuredData);
      document.head.appendChild(script);
    }
  }, [article, slug]);

  const blogPostsData = {
    'ultimate-guide-garment-care': {
      title: 'The Ultimate Guide to Professional Garment Care',
      author: 'Daily Ironing Team',
      date: '2024-01-15',
      readTime: '5 min read',
      categories: ['Garment Care'],
      image: 'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
      content: `
        <p>Professional garment care is more than just ironing – it's about understanding fabrics, using the right techniques, and maintaining your clothes to extend their lifespan. In this comprehensive guide, we'll share the secrets that professional garment care specialists use every day.</p>

        <h2>Understanding Your Fabrics</h2>
        <p>The first step in proper garment care is understanding what you're working with. Different fabrics require different approaches:</p>
        
        <ul>
          <li><strong>Cotton:</strong> Durable and heat-tolerant, cotton can handle higher temperatures but may shrink if not handled properly.</li>
          <li><strong>Silk:</strong> Delicate and luxurious, silk requires gentle handling and lower heat settings.</li>
          <li><strong>Wool:</strong> Natural fiber that can felt if exposed to heat and agitation.</li>
          <li><strong>Synthetics:</strong> Often heat-sensitive and may require special care to avoid melting or damage.</li>
        </ul>

        <h2>Professional Techniques</h2>
        <p>Professional garment care involves several key techniques that ensure optimal results:</p>
        
        <h3>Temperature Control</h3>
        <p>Using the correct temperature is crucial. Too hot, and you risk damaging the fabric. Too cool, and wrinkles won't release properly. Professional equipment allows for precise temperature control that home irons often can't match.</p>

        <h3>Steam Application</h3>
        <p>Professional steam systems provide consistent, penetrating steam that relaxes fibers more effectively than home steamers. This results in better wrinkle removal and a more professional finish.</p>

        <h3>Pressing vs. Ironing</h3>
        <p>There's a difference between pressing and ironing. Pressing involves lifting and placing the iron, while ironing involves sliding. Different garments and fabrics benefit from different techniques.</p>

        <h2>Maintenance Between Professional Services</h2>
        <p>To keep your clothes looking their best between professional services:</p>
        
        <ul>
          <li>Hang garments immediately after wearing</li>
          <li>Use quality hangers that maintain shape</li>
          <li>Store in a cool, dry place</li>
          <li>Address stains immediately</li>
          <li>Rotate your wardrobe to prevent excessive wear</li>
        </ul>

        <h2>When to Seek Professional Help</h2>
        <p>While basic maintenance can be done at home, certain situations call for professional expertise:</p>
        
        <ul>
          <li>Delicate or expensive garments</li>
          <li>Stubborn wrinkles or creases</li>
          <li>Special occasion clothing</li>
          <li>Business attire that needs to look perfect</li>
          <li>When you simply don't have the time</li>
        </ul>

        <p>Professional garment care is an investment in your wardrobe and your appearance. By understanding these principles and knowing when to seek professional help, you can ensure your clothes always look their absolute best.</p>
      `
    },
    'fabric-types-ironing-guide': {
      title: 'Fabric Types and Ironing: A Complete Guide',
      author: 'Sarah Johnson',
      date: '2024-01-10',
      readTime: '7 min read',
      categories: ['Tips & Tricks'],
      image: 'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
      content: `
        <p>Understanding how to properly care for different fabric types is essential for maintaining your wardrobe. Each fabric has unique characteristics that require specific care approaches. Let's explore the most common fabrics and how to handle them properly.</p>

        <h2>Cotton: The Versatile Staple</h2>
        <p>Cotton is one of the most common and versatile fabrics in our wardrobes. It's durable, breathable, and relatively easy to care for.</p>
        
        <h3>Cotton Care Tips:</h3>
        <ul>
          <li>Use medium to high heat (300-400°F)</li>
          <li>Iron while slightly damp for best results</li>
          <li>Use steam for stubborn wrinkles</li>
          <li>Iron on the wrong side for dark colors to prevent shine</li>
        </ul>

        <h2>Silk: Luxury Requires Delicacy</h2>
        <p>Silk is a beautiful, natural protein fiber that requires gentle handling to maintain its luster and texture.</p>
        
        <h3>Silk Care Guidelines:</h3>
        <ul>
          <li>Use low heat (250-300°F)</li>
          <li>Always iron on the wrong side</li>
          <li>Use a pressing cloth to prevent water spots</li>
          <li>Never use steam directly on silk</li>
          <li>Work quickly to avoid heat damage</li>
        </ul>

        <h2>Wool: Natural Insulation</h2>
        <p>Wool is a natural fiber that provides excellent insulation but can be tricky to care for due to its tendency to felt and shrink.</p>
        
        <h3>Wool Handling:</h3>
        <ul>
          <li>Use medium heat (300°F)</li>
          <li>Always use a pressing cloth</li>
          <li>Use plenty of steam</li>
          <li>Press, don't slide the iron</li>
          <li>Allow to cool completely before moving</li>
        </ul>

        <h2>Synthetic Fabrics: Modern Convenience</h2>
        <p>Polyester, nylon, and other synthetic fabrics are popular for their durability and easy care, but they require careful temperature control.</p>
        
        <h3>Synthetic Care:</h3>
        <ul>
          <li>Use low to medium heat (250-300°F)</li>
          <li>Check care labels carefully</li>
          <li>Use steam sparingly</li>
          <li>Test on an inconspicuous area first</li>
          <li>Be aware that some synthetics can melt</li>
        </ul>

        <h2>Linen: Crisp and Cool</h2>
        <p>Linen is a natural fiber known for its breathability and crisp appearance, though it wrinkles easily.</p>
        
        <h3>Linen Care:</h3>
        <ul>
          <li>Use high heat (400-450°F)</li>
          <li>Iron while damp</li>
          <li>Use plenty of steam</li>
          <li>Iron on both sides for best results</li>
          <li>Embrace some natural texture</li>
        </ul>

        <h2>Professional vs. Home Care</h2>
        <p>While understanding these guidelines is helpful, professional garment care offers several advantages:</p>
        
        <ul>
          <li>Professional-grade equipment with precise temperature control</li>
          <li>Experience with delicate and expensive fabrics</li>
          <li>Specialized techniques for different garment types</li>
          <li>Time savings for busy lifestyles</li>
          <li>Consistent, professional results</li>
        </ul>

        <p>Whether you choose to care for your garments at home or use professional services, understanding fabric types and their requirements will help you make informed decisions about your wardrobe care.</p>
      `
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2C3E50' }}>
            {error || 'Post Not Found'}
          </h1>
          <p className="text-xl mb-8" style={{ color: '#2C3E50' }}>
            The blog post you're looking for doesn't exist.
          </p>
          <Link 
            to="/blog"
            className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#E87461' }}
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="absolute inset-0 z-0">
          <img 
            src={article.image}
            alt={`${article.title} - Professional garment care blog post image`}
            className="w-full h-full object-cover opacity-20"
            loading="eager"
            width="1200" 
            height="600"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/70"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/blog"
              className="inline-flex items-center space-x-2 mb-8 hover:opacity-70 transition-colors"
              style={{ color: '#E87461' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>
            
            <div className="mb-6">
              <span 
                className="px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500"
              >
                {article.categories?.[0] || 'General'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#2C3E50' }}>
              {article.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-sm" style={{ color: '#2C3E50' }}>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.created_at || article.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>{views.toLocaleString()} views</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-12">
              {/* Main Content */}
              <article className="flex-1">
                <div 
                  className="prose prose-lg max-w-none blog-content"
                  style={{ color: '#2C3E50' }}
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                
                {/* Social Sharing */}
                <div className="mt-12 pt-8 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium" style={{ color: '#2C3E50' }}>
                        Share:
                      </span>
                      <button 
                        onClick={() => handleShare('facebook')}
                        className="p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="Share on Facebook"
                      >
                        <Facebook className="w-5 h-5 text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleShare('twitter')}
                        className="p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="Share on Twitter"
                      >
                        <Twitter className="w-5 h-5 text-blue-400" />
                      </button>
                      <button 
                        onClick={() => handleShare('linkedin')}
                        className="p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="Share on LinkedIn"
                      >
                        <Linkedin className="w-5 h-5 text-blue-700" />
                      </button>
                      <button 
                        onClick={() => handleShare('email')}
                        className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                        title="Share via Email"
                      >
                        <Mail className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <button 
                      onClick={handleLike}
                      disabled={hasLiked || isLiking}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                        hasLiked 
                          ? 'bg-red-50 cursor-not-allowed' 
                          : 'hover:bg-red-50 cursor-pointer'
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 transition-colors ${
                          hasLiked ? 'text-red-500 fill-current' : 'text-red-400'
                        }`} 
                      />
                      <span style={{ color: '#2C3E50' }}>
                        {isLiking ? 'Liking...' : `${likes.toLocaleString()} ${likes === 1 ? 'Like' : 'Likes'}`}
                      </span>
                    </button>
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="w-80 hidden lg:block">
                <div className="sticky top-8">
                  {/* Author Info */}
                  <div className="bg-white rounded-xl p-6 shadow-lg mb-8" style={{ backgroundColor: '#FFF8F0' }}>
                    <h3 className="text-lg font-bold mb-4" style={{ color: '#2C3E50' }}>
                      About the Author
                    </h3>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E87461' }}>
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold" style={{ color: '#2C3E50' }}>
                          {article.author}
                        </div>
                        <div className="text-sm opacity-70" style={{ color: '#2C3E50' }}>
                          Garment Care Expert
                        </div>
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: '#2C3E50' }}>
                      Professional garment care specialist with years of experience in fabric care and maintenance.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="bg-white rounded-xl p-6 shadow-lg" style={{ backgroundColor: '#2C3E50', color: 'white' }}>
                    <h3 className="text-lg font-bold mb-4">
                      Need Professional Care?
                    </h3>
                    <p className="text-sm mb-4 opacity-90">
                      Let our experts handle your garment care needs with professional equipment and techniques.
                    </p>
                    <Link
                      to="/#calculator-section"
                      className="block w-full text-center py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-colors text-white"
                      style={{ backgroundColor: '#E87461' }}
                    >
                      Get Your FREE Quote
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#2C3E50' }}>
              Related Articles
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.length > 0 ? (
                relatedArticles.map((relatedPost) => (
                  <button
                    onClick={() => {
                      const navigate = require('react-router-dom').useNavigate();
                      navigate('/', { state: { scrollToCalculator: true } });
                    }}
                    className="block w-full text-center py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <img 
                      src={relatedPost.image}
                      alt={`${relatedPost.title} - Related garment care article`}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      width="400"
                      height="192"
                    />
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: '#2C3E50' }}>
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs" style={{ color: '#2C3E50' }}>
                        <span>{relatedPost.author}</span>
                        <span>{new Date(relatedPost.created_at || relatedPost.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p style={{ color: '#2C3E50' }}>
                    No related articles available at this time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;