import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth();

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const user = await register(
      name,
      email,
      password
    );

    navigate("/");
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Registration failed"
    );
  }
};

  return (
    <div>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Signup;