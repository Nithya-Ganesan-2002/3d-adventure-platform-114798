"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register, loading, error, isAuthenticated } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ username: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await register(form);
  }

  if (isAuthenticated) {
    router.push("/"); // redirect to home if already registered/logged in
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
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
          minLength={6}
          className="w-full border px-3 py-2 rounded"
        />
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        <button
          disabled={loading}
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="text-center mt-2">
          Already have an account? <a href="/login" className="text-blue-600 underline">Login</a>
        </div>
      </form>
    </div>
  );
}
