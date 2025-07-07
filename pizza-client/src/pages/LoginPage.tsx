import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./loginPageStyles.css";

const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          username: login.trim(),
          password,
        }
      );
      localStorage.setItem("token", response.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      alert("Incorrect credentials");
    }
  };

  return (
    <div className="login-page">
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      <input
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        placeholder="Login"
      />
      <input
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" className="menu-buttons">
        Login
        </button>
    </form>
    </div>
  );
};

export default LoginPage;
