import { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        
        localStorage.setItem("token", data.token);
        navigate("/dashboard"); 
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "80px" }}>
      <Card>
        <h2 style={{ marginBottom: "20px" }}>Login</h2>
        {error && <p style={{ color: "var(--error)" }}>{error}</p>}
        <p style={{ marginTop: "10px" }}>
            Dont have an account?{" "}
            <span
                style={{ color: "var(--primary)", cursor: "pointer" }}
                onClick={() => navigate("/signup")}
            >
                Sign up
            </span>
        </p>
        <form onSubmit={handleLogin}>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Login</Button>
        </form>
      </Card>
    </div>
  );
}

export default Login;