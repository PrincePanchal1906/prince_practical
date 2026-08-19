import { useState } from "react";

export default function Login({ setPage }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError((prevError) => ({
      ...prevError,
      [name]: "",
    }));
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError((prevError) => ({
          ...prevError,
          email: "Please enter a valid email address.",
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          email: "",
        }));
      }
    }
    if (name === "password") {
      if (value.length < 6) {
        setError((prevError) => ({
          ...prevError,
          password: "Password must be at least 6 characters.",
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          password: "",
        }));
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      console.log("Login successful...:", data);
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setPage("Task");
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80 p-4 max-w-md bg-white rounded-lg shadow-md"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-600 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error.email && <p style={{ color: "red" }}>{error.email}</p>}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border border-gray-600 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error.password && <p style={{ color: "red" }}>{error.password}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
        <br />
        <p>Don't have an account..!</p>
        <button
          type="button"
          onClick={() => setPage("signup")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
