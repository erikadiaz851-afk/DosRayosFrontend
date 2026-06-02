import { createContext, useContext, useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('dr_token');

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    fetch(`${API}/auth/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('dr_token');
        setUser(null);
        setLoading(false);
      });
  }, []);

  async function login(email, password) {
    // Usuario temporal para desarrollo local
    if (
      email === 'admin@dosrayos.com' &&
      password === 'dosrayos2026'
    ) {
      const fakeUser = {
        name: 'Dos Rayos',
        email: 'admin@dosrayos.com',
      };

      localStorage.setItem('dr_token', 'local_dev_token');
      setUser(fakeUser);

      return fakeUser;
    }

    const res = await fetch(`${API}/auth/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    localStorage.setItem('dr_token', data.token);
    setUser(data.user);

    return data.user;
  }

  async function register(name, email, password) {
    const res = await fetch(`${API}/auth/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    localStorage.setItem('dr_token', data.token);
    setUser(data.user);

    return data.user;
  }

  function logout() {
    localStorage.removeItem('dr_token');
    localStorage.removeItem('dr_user');
    setUser(null);
    setLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}