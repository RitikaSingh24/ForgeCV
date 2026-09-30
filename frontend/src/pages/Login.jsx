import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";

export function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      showToast("Welcome back to ForgeCV!", "success");
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "EMAIL_NOT_VERIFIED" || err.status === 403) {
        showToast("Your email is not verified yet. Redirecting to OTP verification...", "warning");
        navigate("/verify-email", { state: { email: formData.email } });
      } else {
        showToast(err.message || "Invalid email or password.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your ForgeCV account."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Enter your password"
          icon={Lock}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full mt-2"
        >
          Sign in →
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-ink-muted">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-accent hover:text-accent-strong underline">
          Create account
        </Link>
      </div>
    </AuthShell>
  );
}

export default Login;
