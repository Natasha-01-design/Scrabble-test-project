import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ margin: '5px 0', padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ margin: '5px 0', padding: '10px' }}
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          style={{ margin: '5px 0', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', marginTop: '10px' }}>Register</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default Register;