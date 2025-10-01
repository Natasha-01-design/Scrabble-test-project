import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    fetch("http://127.0.0.1:5555/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          // If login is successful, navigate to the home page
          navigate("/home");
          return response.json();
        } else {
          return response.json().then((err) => {
            throw new Error(err.error || "Login failed");
          });
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to bottom, #00010a 50%, #0156a4 100%)",
        color: "white",
      }}
    >
      <h2 style={{ color: "white" }}>Sign In</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", width: "300px" }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            margin: "5px 0",
            padding: "0.5rem 2rem",
            borderRadius: "10px",
            border: "none",
            fontSize: "1rem"
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            margin: "5px 0",
            padding: "0.5rem 2rem",
            borderRadius: "10px",
            border: "none",
            fontSize: "1rem"
          }}
        />
        <button
          type="submit"
          style={{
            marginTop: "1rem",
            fontSize: "1.5rem",
            padding: "0.5rem 2rem",
            borderRadius: "10px",
            border: "none",
          }}
        >
          Sign In
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      <p style={{ marginTop: "20px", color: "white" }}>
        Don't have an account? <Link to="/register" style={{ color: "white" }}>Register</Link>
      </p>
    </div>
  );
}

export default SignIn;
