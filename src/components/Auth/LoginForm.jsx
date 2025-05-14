"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
// import { APP_BASE_URL } from "../../helpers";

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const router = useRouter();
  const [showpass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `https://business-backend-production-31d3.up.railway.app/api/auth/login`,
        form
      );
      login(res.data);
      router.push("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ width: "100%" }}
      className="max-w-md mx-auto bg-white p-8 rounded-lg border border-gray-700 shadow-md space-y-4"
    >
      <h2 className="text-3xl font-bold text-center text-blue-700">Login</h2>

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      <div className="relative">
        <input
          name="password"
          type={showpass ? "text" : "password"}
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <i
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 cursor-pointer hover:text-blue-600 ${
            showpass ? "bx bx-hide" : "bx bx-show"
          }`}
          onClick={() => setShowPass(!showpass)}
        ></i>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold tracking-wide"
      >
        Login
      </button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <a
          href="/register"
          className="text-blue-600 hover:underline font-medium"
        >
          Register
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
