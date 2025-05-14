import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { APP_BASE_URL } from "../../helpers";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const router = useRouter();
  const [reTypePass, setReTypepass] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const handleConfrimPass = (e) => {
    const retypedPassword = e.target.value;
    setReTypepass(retypedPassword);
    setPasswordMatch(form.password === retypedPassword);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${APP_BASE_URL}/api/auth/register`, form);
      router.push("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-8 rounded-lg border border-gray-700 shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Register
        </h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative">
          <input
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <i
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 cursor-pointer hover:text-green-600 ${
              showPass ? "bx bx-hide" : "bx bx-show"
            }`}
            onClick={() => setShowPass(!showPass)}
          ></i>
        </div>
        <input
          type="password"
          placeholder="Retype Password"
          value={reTypePass}
          onChange={handleConfrimPass}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {!passwordMatch && reTypePass.length > 0 && (
          <p style={{ color: "red" }}>Passwords do not match.</p>
        )}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">--Select Role--</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="team-member">Team Member</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-semibold"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </form>
    </>
  );
}
