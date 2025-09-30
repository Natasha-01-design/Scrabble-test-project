import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import isWordValid from "../components/index";

function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // --- 1. Run the word validation test ---
    console.log("--- Running word validation test ---");

    const runTest = async (word) => {
      const isValid = await isWordValid(word);
      console.log(`Is '${word}' a valid word? -> ${isValid}`);
    };

    // Let's test a few words
    runTest("hello");
    runTest("react");
    runTest("zzxxcc");
    runTest("scrabble");
    runTest("asdfghj");

    // --- 2. Fetch the list of registered users ---
    fetch("http://127.0.0.1:5555/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []); // The empty array [] means this code runs only once when the component mounts.

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #00010a 50%, #0156a4 100%)",
      }}
    >
      <h1
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          color: "white",
          border: "1px solid white",
          padding: "1rem",
          lineHeight: "2.5rem",
        }}
      >
        <span>S</span>
        <span>C</span>
        <span>R</span>
        <span>A</span>
        <span>B</span>
        <span>B</span>
        <span>L</span>
        <span>E</span>
      </h1>
      <Link to="/game">
        <button
          style={{
            marginTop: "2rem",
            fontSize: "1.5rem",
            padding: "0.5rem 2rem",
            borderRadius: "10px",
            border: "none",
          }}
        >
          Play
        </button>
      </Link>

      <Link to="/register" style={{ marginTop: "1rem" }}>
        <button
          style={{
            fontSize: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "10px",
            border: "none",
          }}
        >
          Register
        </button>
      </Link>

      <div style={{ marginTop: "2rem", color: "white" }}>
        <h2>Registered Players:</h2>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
        ) : (
          <p>No players registered yet.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
