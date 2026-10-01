import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, LogOut, ShieldAlert, Trash2, AlertTriangle, X } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import authApi from "@/api/auth";

export function Settings() {
  const { user, setUser, logout } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setProfileLoading(true);
    try {
      const updatedUser = await authApi.updateProfile({ name });
      setUser(updatedUser);
      showToast("Profile name updated successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update profile.", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 8) {
      showToast("New password must be at least 8 characters long.", "error");
      return;
    }

    setPasswordLoading(true);
    try {
      await authApi.changePassword(passwords);
      showToast("Password updated successfully!", "success");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      showToast(err.message || "Failed to change password.", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (confirmText !== "DELETE") {
      showToast('Please type "DELETE" to confirm account deletion.', "error");
      return;
    }
    if (!deletePassword) {
      showToast("Please enter your password.", "error");
      return;
    }

    setDeleteLoading(true);
    try {
      await authApi.deleteAccount({ password: deletePassword });
      setUser(null);
      showToast("Your account has been permanently deleted.", "success");
      navigate("/");
    } catch (err) {
      showToast(err.message || "Failed to delete account.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        title="Account Settings"
        description="Manage your profile information, password, and security preferences."
      />

      {/* Profile Form */}
      <Card className="p-6 space-y-4">
        <h3 className="font-display font-bold text-base text-ink flex items-center gap-2">
          <User className="w-4 h-4 text-accent" /> Profile Information
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Full Name"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address (read-only)"
            icon={Mail}
            value={user?.email || ""}
            disabled
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" loading={profileLoading}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password Form */}
      <Card className="p-6 space-y-4">
        <h3 className="font-display font-bold text-base text-ink flex items-center gap-2">
          <Lock className="w-4 h-4 text-accent" /> Security & Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            icon={Lock}
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
            required
          />

          <Input
            label="New Password"
            type="password"
            placeholder="At least 8 characters with letter & number"
            icon={Lock}
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            required
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="secondary" size="sm" loading={passwordLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 space-y-6 border-rose-200 bg-rose-50/30">
        <h3 className="font-display font-bold text-base text-rose-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" /> Account Actions
        </h3>
        
        <div className="flex items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-ink">Sign Out</h4>
            <p className="text-xs text-ink-muted">Sign out of your active session on this device.</p>
          </div>
          <Button onClick={logout} variant="secondary" size="sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        <div className="pt-4 border-t border-rose-200/60 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-rose-900">Delete Account</h4>
            <p className="text-xs text-ink-muted">
              Permanently delete your account, all uploaded resumes, and analysis history.
            </p>
          </div>
          <Button onClick={() => setIsDeleteModalOpen(true)} variant="danger" size="sm">
            <Trash2 className="w-4 h-4" /> Delete Account
          </Button>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-w-md w-full p-6 space-y-4 bg-surface border-rose-200 shadow-xl relative animate-in fade-in">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="font-display font-bold text-base text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" /> Confirm Account Deletion
              </h3>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setConfirmText("");
                  setDeletePassword("");
                }}
                className="text-ink-muted hover:text-ink transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              This action is permanent and cannot be undone. All your resumes, versions, and ATS reports will be erased.
              Please type <strong className="text-rose-700">DELETE</strong> and enter your password to confirm.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4 pt-1">
              <Input
                label='Type "DELETE" to confirm'
                placeholder="DELETE"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                required
              />

              <Input
                label="Your Password"
                type="password"
                placeholder="Enter password"
                icon={Lock}
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setConfirmText("");
                    setDeletePassword("");
                  }}
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  size="sm"
                  loading={deleteLoading}
                  disabled={confirmText !== "DELETE" || !deletePassword || deleteLoading}
                >
                  Confirm Delete
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Settings;
