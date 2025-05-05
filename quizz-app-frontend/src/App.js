import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Components/header'
import { createContext } from 'react';


import './App.css';

export const AuthContext = createContext();


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:8000/me', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        console.log('Current user:', data.user);
      } else if (res.status === 401) {
        console.log('User not authenticated');
        setUser(null);
      } else {
        console.error('Failed to fetch user:', res.statusText);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setUser(null);
    } finally {
      setLoading(false);
      setCheckedAuth(true);
    }
  };

  useEffect(() => {
    if (!checkedAuth) {
      fetchUser();
    }
  }, [checkedAuth]);

  const login = async () => {
    await fetchUser();
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:8000/logout', {
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
    }
  };

  if (loading && !checkedAuth) return <div>Loading...</div>;


  return (
    <div className="App">
        <AuthContext.Provider value={{ user, login, logout }}>
        <Header />
        <main>
          <Outlet />
        </main>
      </AuthContext.Provider>
    </div>
  );
}

export default App;

