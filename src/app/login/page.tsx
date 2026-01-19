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
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold text-mauve mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-subtext1 mb-1">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-subtext1 mb-1">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
    </div>
  );
}
