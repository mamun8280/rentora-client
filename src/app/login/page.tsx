
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Clock,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "w-full rounded-2xl border border-[#EBDCC3] bg-[#FFFBF2] px-4 py-3.5 text-[#2B1810] placeholder:text-[#A8957F] outline-none transition duration-200 hover:border-[#E0C99B] focus:border-[#F5A524] focus:bg-white focus:ring-4 focus:ring-[#F5A524]/15";

const labelClass = "mb-2 block text-sm font-semibold text-[#4A2F20]";

const perks = [
  { icon: ShieldCheck, label: "Trusted Owners" },
  { icon: Clock, label: "Flexible Rental" },
  { icon: Truck, label: "Easy Booking" },
];

// Only allow safe internal paths.
const getSafeCallbackURL = (value: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  try {
    const url = new URL(value, window.location.origin);

    if (url.origin !== window.location.origin) {
      return "/";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackURL = getSafeCallbackURL(
    searchParams.get("callbackURL")
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      toast.success("Welcome back to Rentora!");

      router.replace(callbackURL);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
    } catch {
      toast.error("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#FFF8E7] px-4 py-10 sm:px-6">
      {/* Warm background glow */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-115 w-115 rounded-full bg-[#FFD66B]/50 blur-[110px]" />
        <div className="absolute -right-24 bottom-0 h-105 w-105 rounded-full bg-[#D9A877]/40 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(74,44,22,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(74,44,22,0.045)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="mx-auto grid min-h-160 max-w-6xl overflow-hidden rounded-[2rem] border border-white bg-white/90 shadow-[0_40px_90px_-35px_rgba(58,33,20,0.5)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-[#2B1810] via-[#3A2114] to-[#5A3420] p-12 text-white lg:flex">
          <div aria-hidden className="absolute -right-28 -top-28 h-96 w-96 rounded-full border-48 border-[#F5A524]/15" />
          <div aria-hidden className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-[#F5A524]/15 blur-3xl" />
          <div aria-hidden className="absolute right-10 top-1/2 h-40 w-40 rounded-full bg-[#FFD24A]/20 blur-3xl" />

          <Link
            href="/"
            className="relative w-fit text-3xl font-extrabold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-[#FFD24A]"
          >
            Rentora<span className="text-[#FFD24A]">.</span>
          </Link>

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#FFD24A]" />
              Welcome back
            </span>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.05] tracking-[-0.03em]">
              Everything
              <br />
              you need,
              <br />
              <span className="bg-linear-to-r from-[#FFE27A] via-[#FFC233] to-[#F29A2E] bg-clip-text text-transparent">
                within reach.
              </span>
            </h1>

            <p className="mt-6 max-w-md leading-7 text-white/70">
              Sign in to manage your rentals, discover equipment and make
              your next project easier.
            </p>

            <ul className="mt-9 flex flex-wrap gap-2.5">
              {perks.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-3.5 text-sm font-medium text-white/90 backdrop-blur"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-[#FFD24A] to-[#F5A524] text-[#3A2114]">
                    <Icon size={14} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative text-sm text-white/50">
            © 2026 Rentora. All rights reserved.
          </p>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="text-2xl font-extrabold text-[#2B1810] lg:hidden"
            >
              Rentora<span className="text-[#F5A524]">.</span>
            </Link>

            <div className="mt-8 lg:mt-0">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#FFD24A] to-[#F5A524] text-[#3A2114] shadow-lg shadow-[#F5A524]/35">
                <LogIn size={26} />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-[#2B1810]">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-[#7D6757]">
                Sign in to continue your Rentora journey.
              </p>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#EBDCC3] bg-white px-5 py-3.5 font-semibold text-[#4A2F20] shadow-sm transition duration-200 hover:border-[#D6B77B] hover:bg-[#FFFBF2] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.94 46.98 31.71 46.98 24.55z" />
                <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>

              {googleLoading ? "Connecting to Google..." : "Continue with Google"}
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#EBDCC3]" />
              <span className="text-xs font-medium uppercase tracking-wider text-[#A8957F]">
                Or continue with email
              </span>
              <div className="h-px flex-1 bg-[#EBDCC3]" />
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#A8957F] outline-none transition hover:bg-[#FFF1D0] hover:text-[#5A3420] focus-visible:ring-2 focus-visible:ring-[#F5A524]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-[#3A2114] to-[#5A3420] px-5 py-4 font-semibold text-white shadow-[0_16px_36px_-14px_rgba(58,33,20,0.7)] outline-none transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-12px_rgba(58,33,20,0.8)] focus-visible:ring-4 focus-visible:ring-[#F5A524]/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-[#FFD66B]/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />

                <span className="relative">
                  {loading ? "Signing in..." : "Sign In"}
                </span>

                {!loading && (
                  <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-[#FFD24A] to-[#F5A524] text-[#3A2114] transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[#7D6757]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-[#B4651B] underline-offset-4 transition hover:text-[#8A4B1E] hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
