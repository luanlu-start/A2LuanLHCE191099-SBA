import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * COMPONENT HỘP THOẠI XÁC NHẬN XÓA (Delete Confirmation Dialog):
 * Đáp ứng yêu cầu đề bài: "Delete action always combines with confirmation".
 * 
 * Props:
 * - isOpen: Đóng/Mở hộp thoại
 * - onClose: Hàm hủy bỏ thao tác
 * - onConfirm: Hàm thực thi lệnh xóa sang Backend
 * - title: Tiêu đề cảnh báo
 * - message: Nội dung câu hỏi xác nhận
 * - loading: Hiệu ứng nút bấm đang xử lý xóa
 */
export default function ConfirmModal({ isOpen, onClose, onConfirm, title = 'Confirm Action', message, confirmText = 'Delete', loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
            <AlertTriangle size={22} />
            <h3 style={{ color: 'var(--text)' }}>{title}</h3>
          </div>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
