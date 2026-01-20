"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting to sign in...", { email });
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log("SignIn result:", res);

      if (res?.error) {
        console.error("SignIn error:", res.error);
        setError(res.error);
      } else {
        console.log("SignIn success, redirecting...");
        // Force hard navigation to ensure session is picked up
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Login exception:", err);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-mocha relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mauve/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue/10 rounded-full blur-[120px]" />

      <h1 className="text-6xl font-extrabold text-gradient-mauve mb-12 drop-shadow-sm">BMI Tracker</h1>
      <div className="card w-full max-w-md relative z-10">
        <h2 className="text-3xl font-bold text-text mb-8 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-subtext1 mb-1">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" title="Password" className="block text-subtext1 mb-1">Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red text-sm">{error}</p>}
          <button
            type="submit"
            className="btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-subtext0">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue hover:underline">
            Register
          </Link>
        </p>
      </div>

      {/* Demo Credentials Under Card */}
      <div className="mt-8 relative z-10 flex flex-col items-center gap-2 px-6 py-3 rounded-2xl bg-surface0/30 border border-surface1/30 backdrop-blur-sm animate-fade-in">
        <p className="text-subtext1 text-[10px] font-bold uppercase tracking-[0.2em]">Demo Access</p>
        <div className="flex gap-4 text-xs">
          <div className="flex gap-1.5">
            <span className="text-subtext0">Email:</span>
            <span className="text-mauve font-mono font-bold">test@example.com</span>
          </div>
          <div className="w-px h-3 bg-surface1/50 self-center" />
          <div className="flex gap-1.5">
            <span className="text-subtext0">Pass:</span>
            <span className="text-blue font-mono font-bold">password123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
