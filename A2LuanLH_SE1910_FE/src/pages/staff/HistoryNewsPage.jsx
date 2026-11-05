import React, { useState, useEffect } from 'react';
import { newsApi } from '../../api/newsApi';
import { useAuth } from '../../context/AuthContext';
import { Clock, Calendar, Folder, Tag, AlertCircle } from 'lucide-react';
import Modal from '../../components/Modal';

export default function HistoryNewsPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    if (user?.accountId) {
      fetchMyHistory(user.accountId);
    }
  }, [user]);

  const fetchMyHistory = async (staffId) => {
    try {
      setLoading(true);
      setError('');
      const res = await newsApi.getHistory(staffId);
      setHistory(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={22} color="var(--primary)" />
              My Created News History
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Articles authored by <strong>{user?.accountName}</strong> ({user?.accountEmail})
            </p>
          </div>
          <span className="badge badge-info" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
            Total Articles: {history.length}
          </span>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Tags</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Loading history...</td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    You have not created any news articles yet.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.newsArticleId}>
                    <td><code>{item.newsArticleId}</code></td>
                    <td style={{ fontWeight: 600 }}>{item.newsTitle}</td>
                    <td>
                      <span className="badge badge-info">{item.category?.categoryName}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <Calendar size={13} />
                        {item.createdDate}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${item.newsStatus ? 'badge-success' : 'badge-danger'}`}>
                        {item.newsStatus ? 'Active' : 'Draft / Inactive'}
                      </span>
                    </td>
                    <td>
                      {item.tags?.map((t) => (
                        <span key={t.tagId} className="badge badge-tag">
                          {t.tagName}
                        </span>
                      ))}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedNews(item)}
                      >
                        View Full
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedNews && (
        <Modal isOpen={!!selectedNews} onClose={() => setSelectedNews(null)} title={selectedNews.newsTitle}>
          <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <strong>Created:</strong> {selectedNews.createdDate} | <strong>Category:</strong> {selectedNews.category?.categoryName}
          </div>
          {selectedNews.headline && (
            <p style={{ fontStyle: 'italic', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              {selectedNews.headline}
            </p>
          )}
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {selectedNews.newsContent}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>Source:</strong> {selectedNews.newsSource || 'N/A'}
          </div>
        </Modal>
      )}
    </div>
  );
}

