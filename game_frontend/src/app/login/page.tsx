"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ username: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(form);
  }

  if (isAuthenticated) {
    router.push("/"); // redirect to home if already logged in
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          required
          className="w-full border px-3 py-2 rounded"
        />
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        <button
          disabled={loading}
          type="submit"
          className="w-full py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center mt-2">
          Don&apos;t have an account? <a href="/register" className="text-blue-600 underline">Register</a>
        </div>
      </form>
    </div>
  );
}
