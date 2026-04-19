import { useState } from "react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
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
        <h2 style={{ marginBottom: "20px" }}>Sign Up</h2>

        {error && <p style={{ color: "var(--error)" }}>{error}</p>}

        <p style={{ marginTop: "10px" }}>
            Already have an account?{" "}
            <span
                style={{ color: "var(--primary)", cursor: "pointer" }}
                onClick={() => navigate("/")}
            >
                Login
            </span>
        </p>

        <form onSubmit={handleSignup}>
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <Button type="submit">Create Account</Button>
        </form>
      </Card>
    </div>
  );
}

export default SignUp;