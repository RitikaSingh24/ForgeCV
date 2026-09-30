import React, { useState } from "react";
import { User, Mail, Lock, LogOut, ShieldAlert } from "lucide-react";
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

  const [name, setName] = useState(user?.name || "");
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

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
      <Card className="p-6 space-y-4 border-rose-200 bg-rose-50/30">
        <h3 className="font-display font-bold text-base text-rose-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" /> Account Actions
        </h3>
        <p className="text-xs text-ink-muted">
          Sign out of your active session on this device.
        </p>

        <div>
          <Button onClick={logout} variant="danger" size="sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Settings;
