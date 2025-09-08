import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Eye, 
  EyeOff, 
  Calendar, 
  User, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { BlogArticleService, type BlogArticle } from '../services/blogArticleService';

const BlogAdmin: React.FC = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedArticles = await BlogArticleService.getAllBlogArticles(true); // Include unpublished
      setArticles(fetchedArticles);
    } catch (err) {
      setError('Failed to fetch articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    setActionLoading(id);
    try {
      const result = await BlogArticleService.publishArticle(id);
      if (result.success) {
        await fetchArticles(); // Refresh the list
      } else {
        setError(result.error || 'Failed to publish article');
      }
    } catch (err) {
      setError('Failed to publish article');
      console.error('Error publishing article:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnpublish = async (id: string) => {
    setActionLoading(id);
    try {
      const result = await BlogArticleService.unpublishArticle(id);
      if (result.success) {
        await fetchArticles(); // Refresh the list
      } else {
        setError(result.error || 'Failed to unpublish article');
      }
    } catch (err) {
      setError('Failed to unpublish article');
      console.error('Error unpublishing article:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto min-h-[80vh]">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Link 
              to="/"
              className="inline-flex items-center space-x-2 mb-6 hover:opacity-70 transition-colors"
              style={{ color: '#E87461' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2" style={{ color: '#2C3E50' }}>
                  Blog Administration
                </h1>
                <p className="text-lg" style={{ color: '#2C3E50' }}>
                  Manage your blog articles and publications
                </p>
              </div>
              
              <button
                className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-colors flex items-center space-x-2"
               className="px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Article</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#FFF8F0' }}>
                <Edit className="w-8 h-8" style={{ color: '#E87461' }} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#2C3E50' }}>
                No Articles Found
              </h3>
              <p className="mb-6" style={{ color: '#2C3E50' }}>
                Get started by creating your first blog article.
              </p>
              <button
                className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-colors"
               className="px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Create First Article
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <div key={article.id} className="bg-white rounded-xl shadow-lg border overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h2 className="text-xl font-bold" style={{ color: '#2C3E50' }}>
                            {article.title}
                          </h2>
                          <div className="flex items-center space-x-2">
                            {article.is_published ? (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>Published</span>
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center space-x-1">
                                <XCircle className="w-3 h-3" />
                                <span>Draft</span>
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm mb-4 line-clamp-2" style={{ color: '#2C3E50' }}>
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-xs" style={{ color: '#2C3E50' }}>
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{article.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(article.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-6">
                        <Link
                          to={`/blog/${article.slug}`}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Article"
                        >
                          <Eye className="w-5 h-5" style={{ color: '#2C3E50' }} />
                        </Link>
                        
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit Article"
                        >
                          <Edit className="w-5 h-5" style={{ color: '#2C3E50' }} />
                        </button>
                        
                        {article.is_published ? (
                          <button
                            onClick={() => handleUnpublish(article.id)}
                            disabled={actionLoading === article.id}
                            className="px-4 py-2 rounded-lg font-medium border-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ color: '#2C3E50', borderColor: '#2C3E50' }}
                          >
                            {actionLoading === article.id ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                                <span>Unpublishing...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <EyeOff className="w-4 h-4" />
                                <span>Unpublish</span>
                              </div>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublish(article.id)}
                            disabled={actionLoading === article.id}
                            className="px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                           className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === article.id ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Publishing...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>Publish</span>
                              </div>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogAdmin;