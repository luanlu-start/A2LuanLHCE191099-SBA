import React, { useState, useEffect } from 'react';
import { categoryApi } from '../../api/categoryApi';
import { Search, Plus, Edit, Trash2, Folder, AlertCircle, CheckCircle } from 'lucide-react';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State for Create / Update (Popup Dialog requirement)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryDesciption: '',
    parentCategoryId: '',
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = async (keyword = '') => {
    try {
      setLoading(true);
      setError('');
      const res = await categoryApi.getAll(keyword);
      setCategories(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCategories(search);
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      categoryName: '',
      categoryDesciption: '',
      parentCategoryId: '',
      isActive: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      categoryName: cat.categoryName,
      categoryDesciption: cat.categoryDesciption || '',
      parentCategoryId: cat.parentCategory ? cat.parentCategory.categoryId : '',
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.categoryName.trim()) {
      errs.categoryName = 'Category Name is required';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setError('');
      const payload = {
        categoryName: formData.categoryName.trim(),
        categoryDesciption: formData.categoryDesciption.trim(),
        parentCategoryId: formData.parentCategoryId ? parseInt(formData.parentCategoryId) : null,
        isActive: formData.isActive,
      };

      if (editingCategory) {
        await categoryApi.update(editingCategory.categoryId, payload);
        setSuccessMsg('Category updated successfully!');
      } else {
        await categoryApi.create(payload);
        setSuccessMsg('Category created successfully!');
      }
      setIsModalOpen(false);
      fetchCategories(search);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenDelete = (cat) => {
    setCategoryToDelete(cat);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleteLoading(true);
      setError('');
      await categoryApi.delete(categoryToDelete.categoryId);
      setSuccessMsg(`Category "${categoryToDelete.categoryName}" was deleted.`);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories(search);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setIsDeleteModalOpen(false);
      // Constraint rule display: "Cannot delete category: There are existing news articles linked to this category!"
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Category Management</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Staff Role: Manage news categories and subcategories</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Add New Category
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
                placeholder="Search category name..."
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
                <th>Category Name</th>
                <th>Description</th>
                <th>Parent Category</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.categoryId}>
                    <td>#{cat.categoryId}</td>
                    <td style={{ fontWeight: 600 }}>{cat.categoryName}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{cat.categoryDesciption || '—'}</td>
                    <td>{cat.parentCategory ? cat.parentCategory.categoryName : 'None (Root)'}</td>
                    <td>
                      <span className={`badge ${cat.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {cat.isActive ? 'Active (1)' : 'Inactive (0)'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '0.5rem' }}
                        onClick={() => handleOpenEdit(cat)}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenDelete(cat)}
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
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              className="form-control"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              placeholder="e.g. Science & Technology"
            />
            {formErrors.categoryName && <small style={{ color: 'var(--danger)' }}>{formErrors.categoryName}</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={formData.categoryDesciption}
              onChange={(e) => setFormData({ ...formData, categoryDesciption: e.target.value })}
              placeholder="Brief summary of what this category covers"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Parent Category (Optional)</label>
            <select
              className="form-control"
              value={formData.parentCategoryId}
              onChange={(e) => setFormData({ ...formData, parentCategoryId: e.target.value })}
            >
              <option value="">None (Top-level Category)</option>
              {categories
                .filter((c) => !editingCategory || c.categoryId !== editingCategory.categoryId)
                .map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category Status *</label>
            <select
              className="form-control"
              value={formData.isActive ? 'true' : 'false'}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
            >
              <option value="true">Active (1)</option>
              <option value="false">Inactive (0)</option>
            </select>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.categoryName}"? Note: Categories linked to any news articles cannot be deleted.`}
        loading={deleteLoading}
      />
    </div>
  );
}

