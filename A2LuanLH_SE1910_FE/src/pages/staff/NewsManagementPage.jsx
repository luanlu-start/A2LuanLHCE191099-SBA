import React, { useState, useEffect } from 'react';
import { newsApi } from '../../api/newsApi';
import { categoryApi } from '../../api/categoryApi';
import { tagApi } from '../../api/tagApi';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, Edit, Trash2, FileText, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

export default function NewsManagementPage() {
  const { user } = useAuth();
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State for Create / Update (Popup Dialog requirement)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    newsArticleId: '',
    newsTitle: '',
    headline: '',
    newsContent: '',
    newsSource: '',
    categoryId: '',
    newsStatus: true,
    tagIds: [],
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // View Details Modal
  const [viewArticle, setViewArticle] = useState(null);

  const fetchNews = async (keyword = '') => {
    try {
      setLoading(true);
      setError('');
      const res = await newsApi.getAll(keyword);
      setNewsList(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownData = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        categoryApi.getActive(),
        tagApi.getAll(),
      ]);
      setCategories(catRes.data || []);
      setTags(tagRes.data || []);
    } catch (err) {
      console.error('Error fetching categories/tags', err);
    }
  };

  useEffect(() => {
    fetchNews();
    loadDropdownData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(search);
  };

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      newsArticleId: 'NEWS' + Math.floor(100 + Math.random() * 900),
      newsTitle: '',
      headline: '',
      newsContent: '',
      newsSource: 'FUNews Internal',
      categoryId: categories.length > 0 ? categories[0].categoryId : '',
      newsStatus: true,
      tagIds: [],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      newsArticleId: article.newsArticleId,
      newsTitle: article.newsTitle,
      headline: article.headline || '',
      newsContent: article.newsContent,
      newsSource: article.newsSource || '',
      categoryId: article.category?.categoryId || '',
      newsStatus: article.newsStatus !== undefined ? article.newsStatus : true,
      tagIds: article.tags ? article.tags.map((t) => t.tagId) : [],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const exists = prev.tagIds.includes(tagId);
      if (exists) {
        return { ...prev, tagIds: prev.tagIds.filter((id) => id !== tagId) };
      } else {
        return { ...prev, tagIds: [...prev.tagIds, tagId] };
      }
    });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.newsArticleId.trim()) errs.newsArticleId = 'Article ID is required';
    if (!formData.newsTitle.trim()) errs.newsTitle = 'Article Title is required';
    if (!formData.newsContent.trim()) errs.newsContent = 'Article Content is required';
    if (!formData.categoryId) errs.categoryId = 'Category is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setError('');
      const payload = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        createdById: user?.accountId,
      };

      if (editingArticle) {
        await newsApi.update(editingArticle.newsArticleId, payload, user?.accountId);
        setSuccessMsg('Article updated successfully!');
      } else {
        await newsApi.create(payload, user?.accountId);
        setSuccessMsg('Article created successfully!');
      }
      setIsModalOpen(false);
      fetchNews(search);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenDelete = (article) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    try {
      setDeleteLoading(true);
      setError('');
      await newsApi.delete(articleToDelete.newsArticleId);
      setSuccessMsg(`Article "${articleToDelete.newsTitle}" was deleted.`);
      setIsDeleteModalOpen(false);
      setArticleToDelete(null);
      fetchNews(search);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setIsDeleteModalOpen(false);
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>News Article Management</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Staff Role: Manage news articles, categories, and tags</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Create News Article
          </button>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '1.25rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search articles by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Search
            </button>
          </form>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Tags</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Loading articles...</td>
                </tr>
              ) : newsList.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No news articles found.
                  </td>
                </tr>
              ) : (
                newsList.map((article) => (
                  <tr key={article.newsArticleId}>
                    <td><code>{article.newsArticleId}</code></td>
                    <td style={{ fontWeight: 600, maxWidth: 280 }}>
                      {article.newsTitle}
                      {article.headline && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>{article.headline}</div>}
                    </td>
                    <td>
                      <span className="badge badge-info">{article.category?.categoryName}</span>
                    </td>
                    <td>{article.createdBy?.accountName}</td>
                    <td>
                      <span className={`badge ${article.newsStatus ? 'badge-success' : 'badge-danger'}`}>
                        {article.newsStatus ? 'Active (1)' : 'Inactive (0)'}
                      </span>
                    </td>
                    <td>
                      {article.tags && article.tags.map((t) => (
                        <span key={t.tagId} className="badge badge-tag">
                          {t.tagName}
                        </span>
                      ))}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '0.35rem' }}
                        onClick={() => setViewArticle(article)}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '0.35rem' }}
                        onClick={() => handleOpenEdit(article)}
                        title="Edit Article"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenDelete(article)}
                        title="Delete Article"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / UPDATE MODAL DIALOG */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? 'Edit News Article' : 'Create New News Article'}
      >
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Article ID *</label>
              <input
                type="text"
                className="form-control"
                value={formData.newsArticleId}
                onChange={(e) => setFormData({ ...formData, newsArticleId: e.target.value })}
                disabled={!!editingArticle}
              />
              {formErrors.newsArticleId && <small style={{ color: 'var(--danger)' }}>{formErrors.newsArticleId}</small>}
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-control"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
              {formErrors.categoryId && <small style={{ color: 'var(--danger)' }}>{formErrors.categoryId}</small>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">News Title *</label>
            <input
              type="text"
              className="form-control"
              value={formData.newsTitle}
              onChange={(e) => setFormData({ ...formData, newsTitle: e.target.value })}
              placeholder="Catchy headline title..."
            />
            {formErrors.newsTitle && <small style={{ color: 'var(--danger)' }}>{formErrors.newsTitle}</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Headline / Subtitle</label>
            <input
              type="text"
              className="form-control"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="Short summary under the title"
            />
          </div>

          <div className="form-group">
            <label className="form-label">News Content *</label>
            <textarea
              className="form-control"
              rows={5}
              value={formData.newsContent}
              onChange={(e) => setFormData({ ...formData, newsContent: e.target.value })}
              placeholder="Full article content..."
            />
            {formErrors.newsContent && <small style={{ color: 'var(--danger)' }}>{formErrors.newsContent}</small>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">News Source</label>
              <input
                type="text"
                className="form-control"
                value={formData.newsSource}
                onChange={(e) => setFormData({ ...formData, newsSource: e.target.value })}
                placeholder="e.g. FPT Media, VnExpress..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">News Status *</label>
              <select
                className="form-control"
                value={formData.newsStatus ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, newsStatus: e.target.value === 'true' })}
              >
                <option value="true">Active (1) - Publicly visible</option>
                <option value="false">Inactive (0) - Draft / Internal</option>
              </select>
            </div>
          </div>

          {/* Tags Selection */}
          <div className="form-group">
            <label className="form-label">Select Tags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              {tags.map((tag) => {
                const checked = formData.tagIds.includes(tag.tagId);
                return (
                  <label
                    key={tag.tagId}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '0.25rem 0.5rem',
                      background: checked ? '#dbeafe' : '#fff',
                      border: `1px solid ${checked ? '#93c5fd' : 'var(--border)'}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleTagToggle(tag.tagId)}
                    />
                    {tag.tagName}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingArticle ? 'Update Article' : 'Create Article'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete Article"
        message={`Are you sure you want to delete article "${articleToDelete?.newsTitle}" (${articleToDelete?.newsArticleId})?`}
        loading={deleteLoading}
      />

      {/* VIEW MODAL */}
      {viewArticle && (
        <Modal isOpen={!!viewArticle} onClose={() => setViewArticle(null)} title={viewArticle.newsTitle}>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span className="badge badge-info">{viewArticle.category?.categoryName}</span>
            <span>• By: {viewArticle.createdBy?.accountName}</span>
            <span>• Date: {viewArticle.createdDate}</span>
          </div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {viewArticle.newsContent}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Status: {viewArticle.newsStatus ? 'Active' : 'Inactive'} | Source: {viewArticle.newsSource}
          </div>
        </Modal>
      )}
    </div>
  );
}

