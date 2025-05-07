import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      router.push("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <input
        name="role"
        type="text"
        placeholder="role"
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
      <p className="mt-4">
        Already have an account?{" "}
        <a href="/login" className="underline">
          Login
        </a>
      </p>
    </form>
  );
}
