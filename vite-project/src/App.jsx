import { useState } from 'react'
import './App.css'
import tactEaseLogo from './assets/react.svg'

function App() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });
      if (response.ok) {
        console.log('Login successful!');
      } else {
        console.error('Login failed! Response status:', response.status);
        const errorMessage = await response.text();
        console.error('Error message:', errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div>
        <a>
          <img src={tactEaseLogo} className="logo" alt="TE logo" />
        </a>
      </div>
      <h1>TactEase</h1>
      <div className="card">
        <form onSubmit={handleLogin}>
          <label>
            Login:<br></br>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </label><br></br>
          <label>
            Password:<br></br>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label><br></br>
          <button type="submit">Login</button>
        </form>
      </div>
      <p className="read-the-docs">
        This is current login page
      </p>
    </>
  )
}

export default App