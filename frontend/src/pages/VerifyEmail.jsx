import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Mail, Clock, RefreshCw } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import authApi from "@/api/auth";

export function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputsRef = useRef([]);
  const { verifyOtp } = useAuth();
  const { showToast } = useUI();

  // Handle 60s cooldown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle single digit input
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle keyboard backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle full 6-digit paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputsRef.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      showToast("Please enter the complete 6-digit OTP code.", "error");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp({ email, otp: otpCode });
      showToast("Email verified successfully! Welcome to ForgeCV.", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.message || "Invalid or expired OTP code. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    try {
      const res = await authApi.resendOtp({ email });
      showToast(res.message || "A new 6-digit OTP code has been sent to your email.", "info");
      setCooldown(60);
    } catch (err) {
      showToast(err.message || "Failed to resend OTP code.", "error");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell
      title="Verify your email"
      subtitle={`We've sent a 6-digit code to ${email || "your email"}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 6-box OTP Input */}
        <div className="flex justify-between items-center gap-2 sm:gap-3" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-13 sm:w-13 sm:h-15 text-center font-display font-bold text-xl sm:text-2xl bg-surface border border-border rounded-2xl shadow-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {/* Expiry info */}
        <div className="flex items-center gap-2 text-xs text-ink-muted bg-surface-2/60 p-3 rounded-xl border border-border/60">
          <Clock className="w-4 h-4 text-accent shrink-0" />
          <span>The code expires in 10 minutes. Check your spam folder if missing.</span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Verify & Continue →
        </Button>
      </form>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted border-t border-border/60 pt-4">
        <span>Didn't receive code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="inline-flex items-center gap-1.5 font-semibold text-accent hover:text-accent-strong disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
      </div>

      <div className="mt-4 text-center text-xs">
        <Link to="/login" className="text-ink-muted hover:text-ink">
          ← Back to Sign in
        </Link>
      </div>
    </AuthShell>
  );
}

export default VerifyEmail;
