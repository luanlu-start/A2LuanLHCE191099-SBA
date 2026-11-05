import React, { useState, useEffect } from 'react';
import { accountApi } from '../../api/accountApi';
import { Search, Plus, Edit, Trash2, Shield, User, AlertCircle, CheckCircle } from 'lucide-react';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

/**
 * TRANG QUẢN LÝ TÀI KHOẢN (Account Management) - DÀNH CHO ADMIN
 * Yêu cầu đề bài:
 * 1. CRUD (Xem danh sách, Thêm mới, Sửa, Xóa) và Tìm kiếm (Search).
 * 2. Thao tác Thêm mới và Sửa BẮT BUỘC dùng Popup Dialog (Modal).
 * 3. Thao tác Xóa BẮT BUỘC có hộp thoại xác nhận (Confirm Dialog).
 * 4. RÀNG BUỘC NGHIỆP VỤ: Không cho phép xóa tài khoản nếu tài khoản đó đã từng tạo bài viết!
 */
export default function AccountManagementPage() {
  // 1. STATE LƯU TRỮ DỮ LIỆU
  const [accounts, setAccounts] = useState([]); // Chứa danh sách tài khoản tải từ server
  const [search, setSearch] = useState('');     // Chứa từ khóa người dùng gõ vào ô tìm kiếm
  const [loading, setLoading] = useState(false); // Trạng thái đang tải dữ liệu
  const [error, setError] = useState('');       // Thông báo lỗi nếu có
  const [successMsg, setSuccessMsg] = useState(''); // Thông báo thành công màu xanh

  // 2. STATE CHO POPUP DIALOG (Thêm mới / Sửa)
  const [isModalOpen, setIsModalOpen] = useState(false); // Đóng/mở Popup
  const [editingAccount, setEditingAccount] = useState(null); // null = Đang tạo mới; có dữ liệu = Đang sửa
  const [formData, setFormData] = useState({
    accountName: '',
    accountEmail: '',
    accountRole: 2, // Mặc định là Staff
    accountPassword: '',
  });
  const [formErrors, setFormErrors] = useState({}); // Chứa các lỗi kiểm tra form

  // 3. STATE CHO HỘP THOẠI XÁC NHẬN XÓA (Confirm Dialog)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Đóng/mở hộp thoại xác nhận xóa
  const [accountToDelete, setAccountToDelete] = useState(null);     // Tài khoản đang được chọn để xóa
  const [deleteLoading, setDeleteLoading] = useState(false);

  // HÀM LẤY DANH SÁCH TÀI KHOẢN TỪ BACKEND
  const fetchAccounts = async (keyword = '') => {
    try {
      setLoading(true);
      setError('');
      const res = await accountApi.getAll(keyword);
      setAccounts(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect: Chạy 1 lần duy nhất ngay khi người dùng vừa mở trang này lên
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Xử lý khi bấm nút "Search"
  const handleSearch = (e) => {
    e.preventDefault();
    fetchAccounts(search);
  };

  // Bấm nút "Add New Account" -> Mở Popup Thêm Mới
  const handleOpenCreate = () => {
    setEditingAccount(null);
    setFormData({
      accountName: '',
      accountEmail: '',
      accountRole: 2,
      accountPassword: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Bấm nút "Edit" tại 1 dòng -> Mở Popup Sửa và điền sẵn dữ liệu cũ vào Form
  const handleOpenEdit = (acc) => {
    setEditingAccount(acc);
    setFormData({
      accountName: acc.accountName,
      accountEmail: acc.accountEmail,
      accountRole: acc.accountRole,
      accountPassword: '', // Để trống nếu không muốn đổi pass
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // KIỂM TRA DỮ LIỆU ĐẦU VÀO TRÊN FRONTEND (Client Validation)
  const validateForm = () => {
    const errs = {};
    if (!formData.accountName.trim()) errs.accountName = 'Account Name is required';
    if (!formData.accountEmail.trim()) {
      errs.accountEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.accountEmail)) {
      errs.accountEmail = 'Invalid email address';
    }
    if (!editingAccount && !formData.accountPassword) {
      errs.accountPassword = 'Password is required for new account';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // LƯU DỮ LIỆU (Thêm mới hoặc Sửa)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Nếu form có lỗi thì không gửi

    try {
      setError('');
      if (editingAccount) {
        // Gọi API PUT sửa tài khoản
        await accountApi.update(editingAccount.accountId, formData);
        setSuccessMsg('Account updated successfully!');
      } else {
        // Gọi API POST tạo tài khoản mới
        await accountApi.create(formData);
        setSuccessMsg('Account created successfully!');
      }
      setIsModalOpen(false); // Đóng popup
      fetchAccounts(search); // Tải lại bảng danh sách
      setTimeout(() => setSuccessMsg(''), 4000); // Tự ẩn thông báo sau 4 giây
    } catch (err) {
      setError(err.message);
    }
  };

  // Bấm nút "Delete" màu đỏ -> Mở Confirm Dialog hỏi xác nhận
  const handleOpenDelete = (acc) => {
    setAccountToDelete(acc);
    setIsDeleteModalOpen(true);
  };

  // Người dùng bấm "Xác nhận xóa" trong Confirm Dialog
  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;
    try {
      setDeleteLoading(true);
      setError('');
      // Gửi yêu cầu DELETE sang Backend
      await accountApi.delete(accountToDelete.accountId);
      setSuccessMsg(`Account "${accountToDelete.accountName}" was deleted.`);
      setIsDeleteModalOpen(false);
      setAccountToDelete(null);
      fetchAccounts(search);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setIsDeleteModalOpen(false);
      // NẾU VI PHẠM RÀNG BUỘC (Đã viết bài), Backend sẽ trả về lỗi:
      // "Cannot delete account: This account has already created ... news articles!"
      // Lỗi này sẽ được hiển thị ngay lên banner màu đỏ!
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Account Management</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Admin Role: Manage system accounts and roles</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Add New Account
          </button>
        </div>

        {/* Thanh Tìm Kiếm (Search) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Search
            </button>
          </form>
        </div>

        {/* Khung cảnh báo Lỗi màu đỏ */}
        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {/* Khung thông báo Thành công màu xanh */}
        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Bảng hiển thị danh sách tài khoản */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Account Name</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading accounts...</td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No accounts found.
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc.accountId}>
                    <td>#{acc.accountId}</td>
                    <td style={{ fontWeight: 600 }}>{acc.accountName}</td>
                    <td>{acc.accountEmail}</td>
                    <td>
                      <span className={`badge ${acc.accountRole === 1 ? 'badge-danger' : 'badge-info'}`}>
                        {acc.accountRole === 1 ? 'Admin' : 'Staff'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginRight: '0.5rem' }}
                        onClick={() => handleOpenEdit(acc)}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenDelete(acc)}
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

      {/* POPUP MODAL DIALOG (Yêu cầu đề bài cho Create & Update) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAccount ? 'Edit Account' : 'Create New Account'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              placeholder="e.g. John Doe"
            />
            {formErrors.accountName && <small style={{ color: 'var(--danger)' }}>{formErrors.accountName}</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-control"
              value={formData.accountEmail}
              onChange={(e) => setFormData({ ...formData, accountEmail: e.target.value })}
              placeholder="e.g. john@funews.com"
            />
            {formErrors.accountEmail && <small style={{ color: 'var(--danger)' }}>{formErrors.accountEmail}</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Role *</label>
            <select
              className="form-control"
              value={formData.accountRole}
              onChange={(e) => setFormData({ ...formData, accountRole: parseInt(e.target.value) })}
            >
              <option value={1}>Admin (Role 1)</option>
              <option value={2}>Staff (Role 2)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Password {editingAccount ? '(Leave blank to keep unchanged)' : '*'}
            </label>
            <input
              type="password"
              className="form-control"
              value={formData.accountPassword}
              onChange={(e) => setFormData({ ...formData, accountPassword: e.target.value })}
              placeholder={editingAccount ? '••••••••' : 'Enter initial password'}
            />
            {formErrors.accountPassword && <small style={{ color: 'var(--danger)' }}>{formErrors.accountPassword}</small>}
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAccount ? 'Update Account' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE MODAL DIALOG (Yêu cầu đề bài cho Delete) */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete Account"
        message={`Are you sure you want to delete account "${accountToDelete?.accountName}" (${accountToDelete?.accountEmail})? Note: Accounts that have already created news articles cannot be deleted.`}
        loading={deleteLoading}
      />
    </div>
  );
}
