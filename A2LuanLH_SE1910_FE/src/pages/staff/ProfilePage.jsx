import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { accountApi } from '../../api/accountApi';
import { User, Mail, Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [accountName, setAccountName] = useState(user?.accountName || '');
  const [accountEmail, setAccountEmail] = useState(user?.accountEmail || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!accountName.trim() || !accountEmail.trim()) {
      setError('Name and Email cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        accountName: accountName.trim(),
        accountEmail: accountEmail.trim(),
        oldPassword: oldPassword ? oldPassword.trim() : null,
        newPassword: newPassword ? newPassword.trim() : null,
      };

      const res = await accountApi.updateProfile(user.accountId, payload);
      if (res.success) {
        updateUser({
          accountName: res.data.accountName,
          accountEmail: res.data.accountEmail,
        });
        setSuccess('Profile updated successfully!');
        setOldPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '650px' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '50%', color: 'var(--primary)' }}>
            <User size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>My Profile</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Staff Account Settings & Password</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label className="form-label">Account Role</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <Shield size={16} color="var(--primary)" />
              <span style={{ fontWeight: 600 }}>Staff (Role 2)</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-control"
              value={accountEmail}
              onChange={(e) => setAccountEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Change Password (Optional)</h3>
            
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter current password to verify"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

