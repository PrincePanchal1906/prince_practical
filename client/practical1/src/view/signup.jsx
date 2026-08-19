import { useState } from "react";

export default function Signup({ setPage }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "name") {
      if (value.trim() === "") {
        setError((prevError) => ({
          ...prevError,
          name: "Name is required.",
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          name: "",
        }));
      }
    }
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

    const response = await fetch("http://localhost:5000/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    console.log("Response:", response);
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("data:", data);

    if (response.ok) {
      setPage("login");
    } else {
      setError(data.error);
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col  gap-4 px-4 py-2 bg-white rounded shadow-md "
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-500 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error.name && <p className="text-red-500">{error.name}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-500 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error.email && <p style={{ color: "red" }}>{error.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border border-gray-500 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error.password && <p className="text-red-500">{error.password}</p>}

        <br />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 "
        >
          Sign Up
        </button>
        <br />
        <p>
          Already have an account?{" "}
          <span
            onClick={() => setPage("login")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
