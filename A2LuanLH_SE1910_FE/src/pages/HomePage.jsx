import React, { useState, useEffect } from 'react';
import { newsApi } from '../api/newsApi';
import { Search, Calendar, User, Tag as TagIcon, Folder, Newspaper } from 'lucide-react';
import Modal from '../components/Modal';

export default function HomePage() {
  const [newsList, setNewsList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);

  const fetchPublicNews = async (keyword = '') => {
    try {
      setLoading(true);
      setError('');
      const res = await newsApi.getPublic(keyword);
      setNewsList(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicNews();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPublicNews(search);
  };

  return (
    <div className="container">
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: '#fff', borderRadius: 'var(--radius)', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome to FUNews Management</h1>
        <p style={{ opacity: 0.9 }}>Stay updated with the latest university announcements, technology updates, and campus life.</p>
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', maxWidth: '500px' }}>
          <div className="search-wrapper" style={{ maxWidth: '100%' }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search active news by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: '#fff', color: 'var(--text)' }}
            />
          </div>
          <button type="submit" className="btn" style={{ background: '#0f172a', color: '#fff' }}>
            Search
          </button>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Newspaper size={22} color="var(--primary)" />
          Published News Articles ({newsList.length})
        </h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading news articles...</div>
      ) : newsList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No active news articles found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {newsList.map((article) => (
            <div key={article.newsArticleId} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', marginBottom: 0 }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Folder size={12} /> {article.category?.categoryName || 'General'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
                {article.newsTitle}
              </h3>
              {article.headline && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                  {article.headline}
                </p>
              )}
              <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {article.newsContent}
              </p>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap' }}>
                  {article.tags.map((t) => (
                    <span key={t.tagId} className="badge badge-tag">
                      #{t.tagName}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={13} />
                  {article.createdDate ? new Date(article.createdDate).toLocaleDateString() : 'N/A'}
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedNews(article)}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedNews && (
        <Modal isOpen={!!selectedNews} onClose={() => setSelectedNews(null)} title={selectedNews.newsTitle}>
          <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span className="badge badge-info">{selectedNews.category?.categoryName}</span>
            <span>•</span>
            <span>Created by: <strong>{selectedNews.createdBy?.accountName}</strong></span>
            <span>•</span>
            <span>Date: {selectedNews.createdDate}</span>
          </div>

          {selectedNews.headline && (
            <p style={{ fontWeight: 600, fontSize: '1rem', color: '#334155', marginBottom: '1rem', borderLeft: '4px solid var(--primary)', paddingLeft: '0.75rem' }}>
              {selectedNews.headline}
            </p>
          )}

          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1.5rem' }}>
            {selectedNews.newsContent}
          </div>

          {selectedNews.newsSource && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Source: <em>{selectedNews.newsSource}</em>
            </p>
          )}

          {selectedNews.tags && selectedNews.tags.length > 0 && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '0.85rem', marginRight: '0.5rem' }}>Tags:</strong>
              {selectedNews.tags.map((t) => (
                <span key={t.tagId} className="badge badge-tag">
                  #{t.tagName}
                </span>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

