import React, { useState } from 'react';
import './styles/form.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Registration successful!');
        setFormData({ username: '', email: '', password: '' });
      } else {
        const data = await response.json();
        setError(data.detail || 'Signup failed!');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Create Account ✨</h2>
        {error && <p className="error-msg">{error}</p>}
        <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input
          name="password"
          type="password"
          placeholder="Password (8-15 characters)"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
          maxLength={15}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default SignupForm;
