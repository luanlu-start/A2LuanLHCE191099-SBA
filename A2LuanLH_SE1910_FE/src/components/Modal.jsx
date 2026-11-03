import React from 'react';
import { X } from 'lucide-react';

/**
 * COMPONENT POPUP MODAL DIALOG DÙNG CHUNG:
 * Đáp ứng yêu cầu đề bài: "Creating and Updating actions must be performed by popup dialog".
 * 
 * Props:
 * - isOpen: boolean (true = hiện popup, false = ẩn)
 * - onClose: hàm đóng popup khi bấm ra ngoài hoặc bấm nút [X]
 * - title: Tiêu đề trên thanh header của popup (ví dụ: "Create New Account")
 * - children: Nội dung form bên trong popup
 */
export default function Modal({ isOpen, onClose, title, children }) {
  // Nếu isOpen = false thì không vẽ gì ra màn hình
  if (!isOpen) return null;

  return (
    // Lớp phủ màu đen mờ mờ toàn màn hình (Overlay)
    <div className="modal-overlay" onClick={onClose}>
      {/* Khung hộp thoại màu trắng ở giữa (e.stopPropagation() để bấm vào trong không bị tắt popup) */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          {/* Nút dấu X góc trên bên phải để đóng popup */}
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>
        {/* Nơi chứa Form nhập dữ liệu */}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
