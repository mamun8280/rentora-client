
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  Clock,
  Truck,
  User,
  Store,
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

const roles = [
  { value: "owner", label: "Owner", icon: Store },
  { value: "customer", label: "Customer", icon: User },
] as const;

type Role = (typeof roles)[number]["value"];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      toast.error("Password needs uppercase and lowercase letters");
      return;
    }

    if (image.trim()) {
      try {
        const photoURL = new URL(image.trim());

        if (photoURL.protocol !== "https:" && photoURL.protocol !== "http:") {
          toast.error("Photo URL must start with http:// or https://");
          return;
        }
      } catch {
        toast.error("Please enter a valid photo URL");
        return;
      }
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        ...(image.trim() ? { image: image.trim() } : {}),
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      toast.error("Google sign up failed. Please try again.");
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

      <div className="mx-auto grid min-h-170 max-w-6xl overflow-hidden rounded-[2rem] border border-white bg-white/90 shadow-[0_40px_90px_-35px_rgba(58,33,20,0.5)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-[#2B1810] via-[#3A2114] to-[#5A3420] p-12 text-white lg:flex">
          <div
            aria-hidden
            className="absolute -right-28 -top-28 h-96 w-96 rounded-full border-48 border-[#F5A524]/15"
          />
          <div
            aria-hidden
            className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-[#F5A524]/15 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute right-10 top-1/2 h-40 w-40 rounded-full bg-[#FFD24A]/20 blur-3xl"
          />

          <Link
            href="/"
            className="relative w-fit text-3xl font-extrabold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-[#FFD24A]"
          >
            Rentora<span className="text-[#FFD24A]">.</span>
          </Link>

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#FFD24A]" />
              Your rental journey starts here
            </span>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.05] tracking-[-0.03em]">
              Make renting
              <br />
              simple and
              <br />
              <span className="bg-linear-to-r from-[#FFE27A] via-[#FFC233] to-[#F29A2E] bg-clip-text text-transparent">
                smarter.
              </span>
            </h1>

            <p className="mt-6 max-w-md leading-7 text-white/70">
              Join Rentora and discover a smarter way to rent the equipment you
              need, whenever you need it.
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
                <UserPlus size={26} />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-[#2B1810]">
                Create an account
              </h2>

              <p className="mt-2 text-sm text-[#7D6757]">
                Join Rentora and start your rental journey.
              </p>
            </div>

            {/* Role selection */}
            <div className="mt-7">
              <label className={labelClass}>Select Your Role</label>

              <div className="grid grid-cols-2 gap-3">
                {roles.map(({ value, label, icon: Icon }) => {
                  const selected = role === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRole(value)}
                      aria-pressed={selected}
                      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3.5 text-sm font-semibold transition duration-200 ${
                        selected
                          ? "border-[#B87932] bg-[#FFF0D3] text-[#75451D] shadow-sm ring-2 ring-[#F5A524]/20"
                          : "border-[#EBDCC3] bg-[#FFFBF2] text-[#8B7764] hover:border-[#D9B77D] hover:bg-[#FFF8E9]"
                      }`}
                    >
                      <Icon size={21} />
                      <span>{label}</span>
                      {selected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B87932]" />
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-xs text-[#A8957F]">
                Choose how you want to use Rentora.
              </p>
            </div>

            {/* Google signup */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={googleLoading || loading}
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#EBDCC3] bg-white px-5 py-3.5 font-semibold text-[#4A2F20] transition hover:border-[#D9B77D] hover:bg-[#FFFBF2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                "Connecting to Google..."
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 35 15.1l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5Z"
                    />
                    <path
                      fill="#FF3D00"
                      d="m6.3 14.7 6.6 4.8A12 12 0 0 1 35 15.1l5.7-5.7A20 20 0 0 0 6.3 14.7Z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44a20 20 0 0 0 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.9 28l-6.5 5A20 20 0 0 0 24 44Z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2A20 20 0 0 0 44 24c0-1.2-.1-2.3-.4-3.5Z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#EBDCC3]" />
              <span className="text-xs font-medium text-[#A8957F]">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-[#EBDCC3]" />
            </div>

            {/* Registration form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className={inputClass}
                  required
                />
              </div>

              {/* Email */}
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
                  className={inputClass}
                  required
                />
              </div>

              {/* Profile image */}
              <div>
                <label htmlFor="image" className={labelClass}>
                  Profile Photo URL{" "}
                  <span className="font-normal text-[#A8957F]">(Optional)</span>
                </label>
                <input
                  id="image"
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className={inputClass}
                />
              </div>

              {/* Password */}
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
                    placeholder="Create a strong password"
                    className={`${inputClass} pr-12`}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#A8957F] outline-none transition hover:bg-[#FFF1D0] hover:text-[#5A3420] focus-visible:ring-2 focus-visible:ring-[#F5A524]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>

                <p className="mt-2 text-xs text-[#A8957F]">
                  Minimum 6 characters, including uppercase and lowercase
                  letters.
                </p>
              </div>

              {/* Submit */}
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
                  {loading ? "Creating account..." : "Create Account"}
                </span>

                {!loading && (
                  <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-[#FFD24A] to-[#F5A524] text-[#3A2114] transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>

            {/* Sign in link */}
            <p className="mt-7 text-center text-sm text-[#7D6757]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#B4651B] underline-offset-4 transition hover:text-[#8A4B1E] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
