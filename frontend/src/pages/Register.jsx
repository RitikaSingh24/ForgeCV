import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Check, X } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";

export function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  // Password validation rules
  const hasMinLen = formData.password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const isPasswordValid = hasMinLen && hasLetter && hasNumber;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      showToast("Please meet all password requirements.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await register(formData);
      showToast(res.message || "Account created successfully! Please sign in with your email and password.", "success");
      navigate("/login", { state: { email: formData.email } });
    } catch (err) {
      showToast(err.message || "Registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Get started"
      subtitle="Free to start. No credit card required."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          placeholder="Ada Lovelace"
          icon={User}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          icon={Lock}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        {/* Live Password Validation Indicators */}
        <div className="p-3.5 rounded-2xl bg-surface-2/60 border border-border/60 text-xs space-y-1.5">
          <div className="font-semibold text-ink-muted mb-1">Password requirements:</div>
          <div className={`flex items-center gap-2 ${hasMinLen ? "text-emerald-600 font-medium" : "text-ink-muted"}`}>
            {hasMinLen ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-ink-muted/50" />}
            <span>At least 8 characters</span>
          </div>
          <div className={`flex items-center gap-2 ${hasLetter ? "text-emerald-600 font-medium" : "text-ink-muted"}`}>
            {hasLetter ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-ink-muted/50" />}
            <span>Contains at least one letter (A-Z, a-z)</span>
          </div>
          <div className={`flex items-center gap-2 ${hasNumber ? "text-emerald-600 font-medium" : "text-ink-muted"}`}>
            {hasNumber ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-ink-muted/50" />}
            <span>Contains at least one number (0-9)</span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full mt-2"
        >
          Create account →
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-accent hover:text-accent-strong underline">
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}

export default Register;
