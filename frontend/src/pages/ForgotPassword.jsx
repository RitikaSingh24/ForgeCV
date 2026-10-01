import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Clock, RefreshCw, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useUI } from "@/context/UIContext";
import authApi from "@/api/auth";

export function ForgotPassword() {
  const navigate = useNavigate();
  const { showToast } = useUI();

  const [step, setStep] = useState(1); // 1: Email input, 2: OTP + New Password
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputsRef = useRef([]);

  // Cooldown timer for resend OTP
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle single-digit input in OTP boxes
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace keyboard navigation in OTP boxes
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle 6-digit OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(""));
      inputsRef.current[5]?.focus();
    }
  };

  // Step 1: Submit email to receive password reset OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await authApi.forgotPassword({ email });
      showToast(res.message || "Reset verification code sent to your email!", "success");
      setStep(2);
      setCooldown(60);
    } catch (err) {
      showToast(err.message || "Failed to send reset code. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP code
  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    try {
      const res = await authApi.forgotPassword({ email });
      showToast(res.message || "A new verification code has been sent.", "info");
      setCooldown(60);
    } catch (err) {
      showToast(err.message || "Failed to resend code.", "error");
    } finally {
      setResending(false);
    }
  };

  // Step 2: Submit OTP & New Password to reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      showToast("Please enter the complete 6-digit verification code.", "error");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      showToast("Password must be at least 8 characters long.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword({
        email,
        otp: otpCode,
        newPassword,
      });
      showToast(res.message || "Password reset successfully! Please sign in.", "success");
      navigate("/login", { state: { email } });
    } catch (err) {
      showToast(err.message || "Invalid or expired verification code. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={step === 1 ? "Forgot password?" : "Reset your password"}
      subtitle={
        step === 1
          ? "No worries! Enter your email address below and we'll send you a 6-digit verification code."
          : `We've sent a 6-digit verification code to ${email}.`
      }
    >
      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-2"
          >
            Send Verification Code →
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-ink tracking-wide">
              Verification Code (6-digit OTP)
            </label>
            <div className="flex justify-between items-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-13 sm:h-15 text-center font-display font-bold text-xl sm:text-2xl bg-surface border border-border rounded-2xl shadow-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                  autoFocus={idx === 0}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-ink-muted bg-surface-2/60 p-3 rounded-xl border border-border/60">
            <Clock className="w-4 h-4 text-accent shrink-0" />
            <span>Code expires in 10 minutes. Check your spam folder if missing.</span>
          </div>

          <Input
            label="New Password"
            type="password"
            placeholder="At least 8 characters with letter & number"
            icon={Lock}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Reset Password →
          </Button>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted border-t border-border/60 pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 font-medium text-ink-muted hover:text-ink cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Change email
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={cooldown > 0 || resending}
              className="inline-flex items-center gap-1.5 font-semibold text-accent hover:text-accent-strong disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center text-xs">
        <Link to="/login" className="inline-flex items-center gap-1 text-ink-muted hover:text-ink">
          ← Back to Sign in
        </Link>
      </div>
    </AuthShell>
  );
}

export default ForgotPassword;
