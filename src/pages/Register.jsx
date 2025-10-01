import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Clear previous errors

    fetch('http://127.0.0.1:5555/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, country }),
    })
    .then(response => {
      if (response.ok) {
        // If registration is successful, navigate to the home/login page
        navigate('/');
        return response.json();
      } else {
        // If there's an error, parse the error message from the backend
        return response.json().then(err => {
          throw new Error(err.error || 'Registration failed');
        });
      }
    })
    .catch(error => {
      // Set the error state to display the message to the user
      setError(error.message);
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: "linear-gradient(to bottom, #00010a 50%, #0156a4 100%)",
      color: "white"
    }}>
      <h2 style={{ color: "white" }}>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            margin: '5px 0',
            padding: '0.5rem 2rem',
            borderRadius: '10px',
            border: 'none',
            fontSize: '1rem'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            margin: '5px 0',
            padding: '0.5rem 2rem',
            borderRadius: '10px',
            border: 'none',
            fontSize: '1rem'
          }}
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          style={{
            margin: '5px 0',
            padding: '0.5rem 2rem',
            borderRadius: '10px',
            border: 'none',
            fontSize: '1rem'
          }}
        />
        <button
          type="submit"
          style={{
            marginTop: '1rem',
            fontSize: '1.5rem',
            padding: '0.5rem 2rem',
            borderRadius: '10px',
            border: 'none',
          }}
        >
          Register
        </button>
        <Link to="/" style={{ marginTop: '1rem' }}>
          <button
            style={{
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '10px',
              border: 'none',
            }}
          >
            Back to Sign In
          </button>
        </Link>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default Register;